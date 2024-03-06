import {Hono} from "hono";
import {cors} from "hono/cors";

const origin = [
  "http://localhost:5173",
  "https://typing-learner.pages.dev",
  "https://typing-learner.longpddev.site",
];

const app = new Hono<{
  Bindings: { AI: string; BUCKET: R2Bucket; DB: D1Database };
}>();

app.use("*", cors({ origin }));

export default app;