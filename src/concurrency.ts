export default function concurrency<T>(cbs: Array<() => Promise<T>>, maxConcurrency = 10) {
  const {promise, resolve} = Promise.withResolvers<Array<PromiseSettledResult<T>>>()
  let cursor = 0;

  const result: Array<PromiseSettledResult<T>> = []
  function next() {
      if(cursor < cbs.length) {
          const index = cursor++
          const cb = cbs[index]
          cb().then((data) => {
              result[index] = { status: "fulfilled",value: data }
          }).catch(error => {
              result[index] = { status: 'rejected', reason: error }
          }).finally(() => setTimeout(next))
      } else if(result.length === cbs.length) {
          resolve(result)
      }
  }

  while(maxConcurrency--) {
      next();
  }
  return promise
}