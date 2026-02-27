// Temporary type declarations for Bun APIs.
// Will be removed when all scripts are migrated to Node.js APIs in US-003.

interface BunFile {
  text(): Promise<string>;
  json(): Promise<unknown>;
  exists(): Promise<boolean>;
  delete(): Promise<void>;
}

interface BunServerWebSocket {
  send(data: string | ArrayBuffer): void;
  close(code?: number, reason?: string): void;
  subscribe(topic: string): void;
  unsubscribe(topic: string): void;
  publish(topic: string, data: string): void;
}

interface BunServer {
  port: number;
  hostname: string;
  stop(): void;
  upgrade(request: Request, options?: { headers?: Record<string, string>; data?: unknown }): boolean;
}

interface BunServeOptions {
  port?: number;
  hostname?: string;
  development?: boolean;
  fetch?: (request: Request, server: BunServer) => Response | undefined | Promise<Response | undefined>;
  websocket?: {
    maxPayloadLength?: number;
    message?: (ws: BunServerWebSocket, message: string | Uint8Array) => void | Promise<void>;
    open?: (ws: BunServerWebSocket) => void | Promise<void>;
    close?: (ws: BunServerWebSocket, code?: number, reason?: string) => void | Promise<void>;
    drain?: (ws: BunServerWebSocket) => void | Promise<void>;
  };
  error?: (error: Error) => Response | Promise<Response>;
}

type BunStdioOption = 'pipe' | 'inherit' | 'ignore';

interface BunSpawnOptions {
  cwd?: string;
  env?: Record<string, string | undefined>;
  stdout?: BunStdioOption;
  stderr?: BunStdioOption;
  stdin?: BunStdioOption;
  stdio?: [BunStdioOption, BunStdioOption, BunStdioOption];
}

interface BunSpawnResult {
  exited: Promise<number>;
  stdout: ReadableStream<Uint8Array>;
  stderr: ReadableStream<Uint8Array>;
  stdin: WritableStream<Uint8Array> | null;
  kill(signal?: string | number): void;
}

interface BunSpawnSyncResult {
  exitCode: number;
  stdout: Uint8Array;
  stderr: Uint8Array;
}

interface BunGlob {
  scanSync(options: { cwd: string }): Iterable<string>;
  match(path: string): boolean;
}

declare const Bun: {
  version: string;
  env: Record<string, string | undefined>;
  argv: string[];
  file(path: string): BunFile;
  write(path: string, content: string | ArrayBuffer | Uint8Array | BunFile): Promise<number>;
  serve(options: BunServeOptions): BunServer;
  spawn(cmd: string[], options?: BunSpawnOptions): BunSpawnResult;
  spawnSync(cmd: string[], options?: BunSpawnOptions): BunSpawnSyncResult;
  Glob: new (pattern: string) => BunGlob;
};
