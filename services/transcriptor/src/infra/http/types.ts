import type { Hono } from "hono";

export type TranscriptorApp = Hono<{ Bindings: Env }>;
