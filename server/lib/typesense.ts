import { useRuntimeConfig } from '#imports'
import Typesense from 'typesense'

const config = useRuntimeConfig()

export const client = new Typesense.Client({
  nodes: [
    {
      host: 'iwsc34ytvrjq02gkp-1.a1.typesense.net',
      port: 443,
      protocol: 'https',
    },
  ],
  apiKey: config.public.typesenseApiKey,
  connectionTimeoutSeconds: 10,
  retryIntervalSeconds: 10,
})
