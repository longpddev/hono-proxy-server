import app from "../app";
import cache from "../middleware/cache";
import {vocabularyToKeyWords} from "../service/openai";
import {search} from "../shutterstock";
import {fromCodePoint, groupImages} from "../utils";

//cache(2592000)
app.get("/visualize", cache(2592000), async (c) => {
  const text = c.req.query("text")?.trim().toLocaleLowerCase() ?? "";
  if (!text) throw new Error(`query text not found`);
  const searchText = (await vocabularyToKeyWords(text)).join(" OR ");
  console.log("🚀 ~ searchText:", searchText);
  const image = await search(searchText);
  if (!image) throw new Error(`image not found`);

  async function toBase64Uri(r: Response) {
      const arrayBuffer = await r.arrayBuffer();
      const base64 = btoa(fromCodePoint(new Uint8Array(arrayBuffer)));
      const contentType = r.headers.get("Content-Type") ?? "image/jpg";
      return `data:${contentType};base64,${base64}`;
  }

  return c.newResponse(
      groupImages(
          await Promise.all(
              image.slice(0, 4).map((item) => {
                  const img = item.assets.preview;
                  return fetch(img.url).then(toBase64Uri);
              })
          ),
          { width: 450, height: 300, cols: 2 }
      ),
      200,
      {
          "Content-Type": "image/svg+xml",
      }
  );
  // return new Response(groupImages(await Promise.all(image.slice(0,4).map(item => {
  //     const img = item.assets.preview
  //     return fetch(img.url).then(toBase64Uri)
  // })), { width: 450, height: 300, cols: 2}), {
  //     headers: {
  //         'Content-Type': 'image/svg+xml'
  //     }
  // })
  // return c.html(groupImages(await Promise.all(image.slice(0,4).map(item => {
  //     const img = item.assets.preview
  //     return fetch(img.url).then(toBase64Uri)
  // })), { width: 450, height: 250, cols: 2}))
});