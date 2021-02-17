import http from 'http'
import { URL } from 'url'

import createHandler, { getServerConfigs, ServerConfig, WildCardRequest, WildCardResponse } from './handler'

const SUPPORTED_PROTOCOLS= {
  'http': 80,
  'https': 443,
} as const

const supportedProtocols = new Set(Object.keys(SUPPORTED_PROTOCOLS))

const verifyProtocol = (protocol: string): protocol is keyof typeof SUPPORTED_PROTOCOLS =>
  supportedProtocols.has(protocol)

const getPort = (baseUrl: string): number => {
  const url = new URL(baseUrl)
  // Node's protocol has a trailing column
  const protocol = url.protocol.replace(/:$/, '')
  if (!verifyProtocol(protocol)) {
    throw `Protocol ${url.protocol} is not supported`
  }
  return url.port ? Number.parseInt(url.port) : SUPPORTED_PROTOCOLS[protocol]
}

type ConfiguredServer = http.Server & { serve: () => http.Server }

const getData = async (msg: http.IncomingMessage): Promise<string> => new Promise<string> ((resolve, reject) => {
  const chunks: string[] = []
  msg.on('readable', () => chunks.push(msg.read()))
  msg.on('error', reject)
  msg.on('end', () => resolve(chunks.join('')))
})

const getWildcardRequest = async (
  request: http.IncomingMessage,
): Promise<WildCardRequest> => ({
  method: request.method as string,
  url: request.url as string,
  body: await getData(request),
  headers: request.headers,
})

const toHttpResponse = async (
  config: ServerConfig,
  resp: WildCardResponse,
  response: http.ServerResponse
): Promise<void> => {
  Object.entries(resp.headers || {}).forEach(([key, value]) => {
    response.setHeader(key, value as any)
  })

  response.statusCode = resp.statusCode

  if (resp.body !== undefined) {
    response.write(
      resp.body,
      config.encoding
    )
  }

  response.end()
}

// eslint-disable-next-line max-statements
const proc =  (
  config: ServerConfig
): ((request: http.IncomingMessage, response: http.ServerResponse) => Promise<void>) => {
  const handleWildCardRounte = createHandler(config)
  return async (request: http.IncomingMessage, response: http.ServerResponse): Promise<void> => {
    const wildCardRequest = await getWildcardRequest(request)
    const wildCardResponse = await handleWildCardRounte(wildCardRequest)
    await toHttpResponse(config, wildCardResponse, response)
  }
}

export const createServer = (
  config: Partial<ServerConfig>,
): ConfiguredServer => {
  const merged = getServerConfigs(config)
  const server = http.createServer(proc(merged)) as ConfiguredServer
  server.serve = () => server.listen(getPort(merged.baseUrl))
  return server
}
