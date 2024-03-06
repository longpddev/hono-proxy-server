const token = `v2/em5kYU9ERHVjMEsyWEt0aG1tazZaYnZndjNjV3ZZczQvMzU5ODMyNjQ1L2N1c3RvbWVyLzQvSGF2aXBzTFUtM1dCUlJIN1dUcVluZHViT2N0LXFtcjMxQmQ0bnFMekN0VUdhcVdxc0lHdUZXN0ItbnR0Qi1yR00wZ182S3QwNlF1eFpGNEdtVG1GUFJ2eUJVQ2hOUnJfQVpCLTRIUmFmdGs5SDhQUHdXd21RSk1vYlRJU1RqelFsSU5CU2FHWm1VVGw4VnJ4enMxTVJrajFzbjZIREgzNVdSUDZvRHpqV2Myei1YOVRTNUVwNVVNVFdTUWpOMG9WWUI0U1dsekV2ZkJXMi1xLTJUYWI1Zy9BVDlzck04Vi0yZi1MNFpXVHBtQmdB`
const headers = new Headers({
  'Authorization': `Bearer ${token}`,
  "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 Edg/120.0.0.0"
})

export type Image<W extends number> = {
  height: number,
  width: W,
  url: string
}

export async function prefetchImage<W extends number>(image: Image<W>) {
  return fetch(image.url, {
    cf: {
      cacheTtl: 2592000,
      cacheEverything: true
    }
  })
}

export async function search (
  query: string, 
  {
    image_type = 'photo',
    orientation = 'horizontal' as "vertical" | "horizontal",
    sort = 'relevance' as 'popular' | 'newest' | 'random' | 'relevance'
  } = {}
) {

  const uri = new URL('https://api.shutterstock.com/v2/images/search')
  uri.searchParams.append('query', query)
  uri.searchParams.append('image_type', image_type)
  uri.searchParams.append('orientation', orientation)
  uri.searchParams.append('sort', sort)
  
  const response = await fetch(uri.toString(), { headers });

  const result = (await response.json()) as { data : Array<{id: string, aspect: number, assets: {
    small_thumb: Image<100>,
    large_thumb: Image<150>,
    huge_thumb: Image<390>,
    mosaic: Image<250>,
    preview: Image<450>,
    preview_1000: Image<1000>,
    preview_1500: Image<1500>,
  }}>}
  return result.data
}