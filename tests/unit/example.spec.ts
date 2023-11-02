import { expect, describe, it } from 'vitest'
import JsonSchemaForm, { NumberField } from '../../lib'
import { mount } from '@vue/test-utils'

describe('JsonSchemaForm', () => {
  it('should render correct number field', async () => {
    let value = ''
    const wrapper = mount(JsonSchemaForm, {
      props: {
        schema: {
          type: 'number',
        },
        value: value,
        onChange: (v) => {
          value = v
        },
      },
    })
    const numberField = wrapper.findComponent(NumberField)
    expect(numberField.exists()).toBeTruthy()
    // await numberField.props('onChange')('123')
    const input = numberField.find('input')
    console.log(input)
    input.element.value = '123'
    input.trigger('input')
    expect(value).toBe(123)
  })
})
