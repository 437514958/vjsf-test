const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const ajv = new Ajv({ allErrors: true }) // options can be passed, e.g. {allErrors: true}
require('ajv-errors')(ajv)
// 格式定义
addFormats(ajv)
ajv.addFormat('test', (data) => {
  console.log(data, '---------')
  return data === 'haha'
})
// 关键词定义
ajv.addKeyword({
  keyword: 'test',
  macro: () => {
    return { minLength: 10 }
  },
  // validate: function func(schema, data) {
  //   func.errors = [
  //     {
  //       instancePath: '/age',
  //       schemaPath: '#/properties/age/test',
  //       keyword: 'test',
  //       params: {},
  //       message: '2131校验"',
  //     },
  //   ]
  //   return schema === data
  // },
})

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 10,
      // test: 10,
      errorMessage: {
        type: '1111',
        minLength: '2222',
      },
    },
    age: {
      type: 'number',
    },
    pets: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    isWorker: {
      type: 'boolean',
    },
  },
}

const validate = ajv.compile(schema)
const valid = validate({
  name: 22,
  age: 7,
  pets: ['mimi', 'mama'],
  isWorker: true,
})
if (!valid) {
  console.log(validate.errors)
}
