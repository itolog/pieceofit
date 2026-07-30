// Stub for Ink's optional `react-devtools-core` dependency.
//
// Ink's devtools.js has a top-level static `import 'react-devtools-core'`, and
// `bun build --compile` bundles that file whether or not the DEV guard around
// it can ever be true - so the name has to resolve. Installing the real ~3 MB
// package just to satisfy the bundler is wasteful, so this no-op stands in for
// it via a `file:` dependency.
//
// Both methods below are the ones devtools.js calls; keep them in sync with it.
export default {
  initialize() {},
  connectToDevTools() {},
};
