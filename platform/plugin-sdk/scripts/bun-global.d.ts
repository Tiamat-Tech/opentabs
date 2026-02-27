// Temporary type declaration for Bun.write.
// Will be removed when Bun.write is replaced with node:fs/promises in US-003.

interface BunFile {
  text(): Promise<string>;
  json(): Promise<unknown>;
  exists(): Promise<boolean>;
  delete(): Promise<void>;
}

declare const Bun: {
  version: string;
  write(path: string, content: string | ArrayBuffer | Uint8Array | BunFile): Promise<number>;
};
