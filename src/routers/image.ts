import app from "../app";
import { openai } from "../service/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {groupImages} from "../utils";

app.get("/image", async (c) => {
  const text = c.req.query("text")?.trim().toLowerCase();
  const explain = await openai.invoke([
      new SystemMessage("You are a translator."),
      new HumanMessage(
          `Explain the meaning of "${text}" with one sentence. Just a sentence:`
      ),
  ]);
  const response = await fetch("https://api.craiyon.com/v3", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "User-Agent":
              "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 Edg/120.0.0.0",
          Origin: "https://www.craiyon.com",
      },
      body: JSON.stringify({
          prompt: explain.content,
          negative_prompt: "",
          model: "none",
          version: "c4ue22fb7kb6wlac",
      }),
  });

  const data = (await response.json()) as { images: string[] };
  data.images = data.images.map((item) => `https://img.craiyon.com/${item}`);

  return c.html(groupImages(data.images));
});