import { IncomingMessage, IncomingHttpHeaders, ServerResponse } from 'http'
import { Request, Response } from './handler'

const getData = async (msg: IncomingMessage): Promise<string> => new Promise<string> ((resolve, reject) => {
  try {
    const chunks: string[] = []
    msg.on('readable', () => chunks.push(msg.read()))
    msg.on('error', reject)
    msg.on('end', () => resolve(chunks.join('')))
  } catch (err) {
    reject(err)
  }
})

const extractWildcardRequest = async (request: IncomingMessage): Promise<{
  method?: string,
  path?: string,
  data?: string,
  headers?: IncomingHttpHeaders,
  queryString?: string
}> => {
  const [path, queryString] = (request.url || '').split('?', 2)
  return {
    method: request.method?.toUpperCase(),
    path,
    data: await getData(request),
    headers: request.headers,
    queryString
  }
}

const writeWildcardResponse = async (response: Response, out: ServerResponse): Promise<void> => {
  Object.entries(response.headers || {}).forEach(([key, value]) =>
    response.setHeader(key, value as any)
  )
}
