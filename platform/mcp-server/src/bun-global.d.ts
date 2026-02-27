// Temporary type declarations for Bun APIs.
// Will be removed when createBunServer and Bun.serve() are eliminated in US-002.

interface BunServerWebSocket {
  send(data: string | ArrayBuffer): void;
  close(code?: number, reason?: string): void;
  subscribe(topic: string): void;
  unsubscribe(topic: string): void;
  publish(topic: string, data: string): void;
}

/** Must satisfy ServerAdapter from http-routes.ts */
interface BunServer {
  port: number;
  hostname: string;
  stop(): void;
  upgrade(req: Request, opts: { data: unknown; headers?: HeadersInit }): boolean;
  timeout(req: Request, seconds: number): void;
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

declare const Bun: {
  serve(options: BunServeOptions): BunServer;
};
