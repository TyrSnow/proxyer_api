/**
 * ProxyController 对应的schema
 */
const ProxySchemas = {
  create: {
    body: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          required: true,
        },
        port: {
          type: 'number',
          required: true,
        },
        proxyId: {
          type: 'string',
        },
      },
    }
  }
}

export default ProxySchemas;
