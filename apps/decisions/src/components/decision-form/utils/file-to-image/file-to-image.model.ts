// String.fromCharCode spreads its arguments, so bytes go in chunks to stay
// under the engine's argument limit on large images.
export const CHUNK_SIZE = 0x8000;
