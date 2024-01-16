import { Hono } from 'hono'
import { cors } from 'hono/cors'
const app = new Hono()

app.use('/dictvoice', cors({ origin: '*'}))
app.get('/dictvoice', async (c) => {
  // c.header('Cache-Control', 'public, max-age=36000');
  const query = Object.entries(c.req.queries()).map(([key, value]) => `${key}=${value.join(',')}`).join('&')
  let url = 'https://dict.youdao.com/dictvoice';
  if(query.length > 0) url = url + '?' + query
  
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer()
  const newHeaders = {'Cache-Control': 'public, max-age=36000'};
  Array.from(response.headers.entries()).forEach(([key, value]) => {
    if(key.toLowerCase() === 'content-length') return
    newHeaders[key as keyof typeof newHeaders] = value
  })

  return c.newResponse(arrayBuffer, 200, newHeaders)
})

export default app
