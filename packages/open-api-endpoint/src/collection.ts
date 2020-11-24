// Postman

type Information = {
  name: string
  description: string
  version: string
  // as per: https://schema.getpostman.com/collection/json/v2.1.0/draft-07/docs/index.html
  // value hardcoded: https://schema.getpostman.com/collection/json/v2.1.0/draft-07/collection.json
  // schema: string //!!
}

type Url = {
  // postman style request template
  // e.g.: /items/:itemId/something
  raw: string
}

type Header = {
  key: string,
  value: string,
  description?: string
}

type Request = {
  url: Url
  description?: string
  header: Header[]
  body: {
    mode: 'raw' // there are more modes, but having just raw is fine
    raw: string
  }
}

type Response = {

}

type Item = {
  name?: string
  description?: string
  request: Request
  response: Response[]
}

type Collection = {
  info: Information
  item: Item[]
}
