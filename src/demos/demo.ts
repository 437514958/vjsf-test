import PasswordWidget from '../components/PasswordWidget'

export default {
  name: 'Demo',
  schema: {
    type: 'object',
    properties: {
      pass1: {
        type: 'string',
        test: false,
        title: 'password',
      },
      pass2: {
        type: 'string',
        minLength: 10,
        title: 'retry password',
      },
      color: {
        type: 'string',
        title: 'Input Color',
        format: 'color',
      },
    },
  },
  async customValidate(data: any, errors: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (data.pass1 != data.pass2) {
          errors.pass2.addError('密码必须相同')
        }
        resolve('')
      }, 2000)
    })
  },
  uiSchema: {
    properties: {
      pass1: {
        widget: PasswordWidget,
      },
      pass2: {
        color: 'red',
      },
    },
  },
  default: 1,
}
