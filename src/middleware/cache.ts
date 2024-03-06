import type { Context, Next } from "hono";

export default function cache(cacheTtl?: number) {
  return async (c: Context, next: Next) => {
    const cache = caches.default;
    const url = new URL(c.req.url);
    const origin = c.req.header('origin') ?? ''
    url.searchParams.append('origin', origin)
    const urlString = url.toString()
    
    const request = new Request(urlString, {
      cf: {
        cacheTtl,
        cacheEverything: true
      }
    })
    const responseCache = await cache.match(request)
    if(responseCache) {
      console.log("🚀 ~ urlString cached:", urlString)
      return new Response(responseCache.body, { headers: responseCache.headers});
    }
    if(cacheTtl !== undefined) c.header('Cache-Control', `public, s-maxage=${cacheTtl}`);
    await next();
    await cache.put(request, c.res.clone())
  }
}