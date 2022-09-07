import fetch, { Headers } from 'node-fetch'

export async function scrape(url: string | URL) {

  let headers = new Headers({

  });

  let f = await fetch(url, {
    method: 'GET',
    headers: headers,
    redirect: 'follow',
  })

  let txt = await f.text()
  return txt
}