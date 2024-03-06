import app from "../app"
import {openai} from "../service/openai"
import { streamSSE } from 'hono/streaming'
import { HumanMessage } from "@langchain/core/messages";
app.get('/execute', async c => streamSSE(c, async stream => {
  const controller = new AbortController();
  stream.onAbort(() => controller.abort());
  const text = c.req.query("text")?.trim().toLowerCase();
  function writeSteam(text: string) {
    stream.write(`data: ${JSON.stringify({text})}\n\n`)
  }
  if (!text) {
    return writeSteam('');
  }

  const bucketKey = text + "__streamsse"
  const content = await c.env.BUCKET.get(bucketKey);
  if (content) return writeSteam(await content.text());

  const message = await openai.stream([
    new HumanMessage(`Common ways to use the vocabulary word "${text}" and general pros and cons with similar words`),
    new HumanMessage('giải thích ngắn gọn bằng tiếng việt.')
  ], { signal: controller.signal });

  let result = ''
  for await (const chunk of message) {
    result += chunk.content
    writeSteam(chunk.content as string)
  }

  stream.close();
  await c.env.BUCKET.put(bucketKey, result);
}))