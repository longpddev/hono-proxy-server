import app from "../app";

app.get('/dictionary', async c => {
  const text = c.req.query('text')?.trim().toLowerCase() 
  if(!text) return c.json({result: null})
  const prepare = c.env.DB.prepare(`SELECT * FROM translation WHERE word_search = ?1`).bind(text)
  const result = await prepare.all();
  return c.json({ result: result.results.at(0)?.translation_word ?? null })
})