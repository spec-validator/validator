import { serve } from '@validator/rest-api-server'
import { DEFAULT_SERVER_CONFIG } from '@validator/rest-api-server/server'
import withOpenApi from './withOpenApi'

serve(withOpenApi(DEFAULT_SERVER_CONFIG))
