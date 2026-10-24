# decisions

A small web app for trying Ollama **decision models** such as
[`d3`](https://ollama.com/library/d3) and [`tev1`](https://ollama.com/library/tev1).
These models take a `state` (text, JSON or images) and typed questions, and return
probabilities instead of generated text.

Stack: Vite, React, [shadcn/ui](https://ui.shadcn.com/), [zod](https://zod.dev/),
[react-hook-form](https://react-hook-form.com/), [Nivo](https://nivo.rocks/).

## Run

```bash
ollama pull d3
bun run dev                      # http://localhost:5173
OLLAMA_URL=http://host:11434 bun run dev
```

The page lists every installed model with the `decision` capability. Pick a preset or
start blank, edit the state and the questions, and press **Decide** (or ⌘/Ctrl + Enter).
The answers panel shows each answer: a meter for yes/no, and a [Nivo](https://nivo.rocks/)
bar chart for choice and score with the model's pick highlighted (hover a bar for its
value), plus the raw request and response JSON. The theme switch in the header offers
light, dark or the system setting, and remembers the choice.

The page talks to Ollama through the dev server's `/ollama` proxy, so Ollama needs no
CORS setup. That also means it needs `bun run dev` or `bun run preview`: a static
`dist/` alone has no proxy.

## Models

All of them use the same `POST /v1/systemone` endpoint.

| Model                                                      | Size in memory | Input        | Notes                                      |
| ---------------------------------------------------------- | -------------- | ------------ | ------------------------------------------ |
| [`d3`](https://ollama.com/library/d3) (4B)                 | ~5.6 GB        | text, images | Ollama ≥ 0.40.9; `d3:2b` for 8 GB machines |
| [`tev1`](https://ollama.com/library/tev1) (4B)             | ~4.5 GB        | text         | `tev1:0.8b` is under 1 GB                  |
| [`clef-flash`](https://ollama.com/library/clef-flash) (9B) | ~11.5 GB       | text, images | too big for a 16 GB Mac's GPU limit        |

## Questions

- **Yes / no** (`noul`): returns the probability that the answer is true. Descriptions
  of what true and false mean are optional.
- **Choice** (`choice`): 2–26 options; picks one and returns the probability of each. An
  option without a description is described by its name.
- **Score** (`score`): 2–26 levels, lowest first, numbered from 0; returns a
  probability-weighted level.

Question keys become the keys of the answers, so they must be unique. A state that is a
valid JSON object or array is sent as structured state. Images (PNG, JPEG, WebP) are
enabled for models with the `vision` capability and shared by all questions.

## Presets

`src/presets/*.json` are request bodies without `model`. List a new one in
`src/presets/presets.model.ts` to show it in the picker.
