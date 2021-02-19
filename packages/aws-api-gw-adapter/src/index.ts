import querystring from 'querystring'

import createHandler, {
  getServerConfigs, ServerConfig, WildCardRequest, WildCardResponse,
} from '@spec-validator/rest-api-server/handler'

type AwsReq = {
  headers: Record<string, string>,
  path: string,
  queryStringParameters: Record<string, string>,
  httpMethod: string,
  body?: string,
  requestContext: {
    stage: string
  }
}

const getUrl = (awsReq: AwsReq): string =>
  `${awsReq.path}?${querystring.encode(awsReq.queryStringParameters)}`

const toWildCardRequest = (awsReq: AwsReq): WildCardRequest => ({
  body: awsReq.body || '',
  url: getUrl(awsReq),
  method: awsReq.httpMethod,
  headers: awsReq.headers,
})

export const configureBaseUrl = (event: AwsReq): void => {
  const host = event.headers.Host || 'unknown'
  const proto = event.headers['X-Forwarded-Proto'] || 'http'
  const stage = event.requestContext?.stage || 'unknown'

  process.env.REST_API_BASE_URL = host.endsWith('amazonaws.com') ?
    `${proto}://${host}/${stage}` : `${proto}://${host}`
}

export const createAwsLambdaHandler = (config: Partial<ServerConfig>):
  ((event: AwsReq) => Promise<WildCardResponse>) => {
  const handle = createHandler(getServerConfigs(config))
  return async (event: AwsReq): Promise<WildCardResponse> => {
    configureBaseUrl(event)
    return await handle(toWildCardRequest(event))
  }
}
