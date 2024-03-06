import app from "../app";

app.get("/dictvoice", async (c) => {
  const query = Object.entries(c.req.queries())
      .map(([key, value]) => `${key}=${value.join(",")}`)
      .join("&");
  let url = "https://dict.youdao.com/dictvoice";
  if (query.length > 0) url = url + "?" + query;
  const cacheTtl = 2592000;
  const response = await fetch(url, {
      cf: {
          cacheTtl,
          cacheEverything: true,
      },
  });
  const arrayBuffer = await response.arrayBuffer();
  const newHeaders = {
      "Cache-Control": `max-age=${cacheTtl}`,
      "Content-Type": "audio/mpeg",
      "Content-Length": arrayBuffer.byteLength.toString(),
  };

  return c.newResponse(arrayBuffer, 200, newHeaders);
});