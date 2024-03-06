import {Ai} from "@cloudflare/ai";
import app from "../app";
import {TranslateResponse} from "../interfaces";

app.get("/translate", async (c) => {
  const ai = new Ai(c.env.AI);
  const text = c.req.query("text");
  const source_lang = c.req.query("source") ?? "en";
  const target_lang = c.req.query("target") ?? "vi";
  if (!text) return c.json({ translated_text: "" });

  const response: TranslateResponse = await ai.run("@cf/meta/m2m100-1.2b", {
      text,
      source_lang,
      target_lang,
  });

  return c.json(response);
});