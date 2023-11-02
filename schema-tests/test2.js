const Ajv = require('ajv').default
const ajv = new Ajv({ allErrors: true })
// Ajv option allErrors is required
require('ajv-errors')(ajv /*, {singleError: true} */)
const schema = {
  type: 'object',
  required: ['foo'],
  properties: {
    foo: { type: 'integer' },
  },
  additionalProperties: false,
  errorMessage: 'should be an object with an integer property foo only',
}

const validate = ajv.compile(schema)
console.log(validate({ foo: 2 })) // false
console.log('------', validate.errors) // processed errors
