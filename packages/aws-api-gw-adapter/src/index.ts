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
}

const getUrl = (awsReq: AwsReq): string =>
  `${awsReq.path}?${querystring.encode(awsReq.queryStringParameters)}`

const toWildCardRequest = (awsReq: AwsReq): WildCardRequest => ({
  body: awsReq.body || '',
  url: getUrl(awsReq),
  method: awsReq.httpMethod,
  headers: awsReq.headers,
})

export const createAwsLambdaHandler = (config: Partial<ServerConfig>):
  ((event: AwsReq) => Promise<WildCardResponse>) => {
  const handle = createHandler(getServerConfigs(config))
  return async (event: AwsReq): Promise<WildCardResponse> => await handle(toWildCardRequest(event))
}
