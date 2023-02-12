import { type H3Event, readBody } from 'h3'

export const yimaReadBody = async (event: H3Event) => {
  let body = await readBody(event)

  if (Buffer.isBuffer(body)) {
    body = JSON.parse(body.toString())
  }

  return body
}
