// Pre-rendered "LLM Translator" in cfonts' `tiny` font, captured from what
// <BigText> used to emit.
//
// ! Don't reach for `ink-big-text` again. It renders through `cfonts`, which
// loads its font files with a computed `require(`../fonts/${font}.json`)` —
// a path no bundler can resolve statically. The fonts therefore never make it
// into `bun build --compile` output, and the binary dies with "Font file for
// the font "tiny" could not be found". The title is a constant, so rendering
// it at runtime bought nothing.
//
// To change the text or font, regenerate with cfonts rather than editing by
// hand:
//   bunx cfonts "<text>" --font tiny --spaceless
const ART = [
  " █   █   █▀▄▀█   ▀█▀ █▀█ ▄▀█ █▄ █ █▀▀ █   ▄▀█ ▀█▀ █▀█ █▀█",
  " █▄▄ █▄▄ █ ▀ █    █  █▀▄ █▀█ █ ▀█ ▄▄█ █▄▄ █▀█  █  █▄█ █▀▄",
].join("\n");

// cfonts padded the art with a blank line above and below even with
// `space: false`; kept verbatim so the header occupies the same height.
export const HEADER_BANNER = `\n\n${ART}\n\n`;
