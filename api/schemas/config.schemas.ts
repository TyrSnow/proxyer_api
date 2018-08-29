/**
 * ConfigController 对应的schema
 */
const configSchemas = {
  create: {
    body: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          required: true,
        },
        value: {
          type: 'string',
          required: true,
        },
      }
    }
  },
};

export default configSchemas;
