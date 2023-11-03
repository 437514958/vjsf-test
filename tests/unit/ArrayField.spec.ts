import { expect, describe, it } from 'vitest'
import { ArrayField, NumberField, SelectionWidget, StringField } from '../../lib'
import { mount } from '@vue/test-utils'
import TestComponent from './utils/TestComponent'
import TextWidget from '../../lib/theme-default/TextWidget'
import NumberWidget from '../../lib/theme-default/NumberWidget'
import SchemaForm from '../../lib/SchemaForm'

describe('ArrayField', () => {
  it('shoulde render multi type', () => {
    const wrapper = mount(TestComponent, {
      props: {
        schema: {
          type: 'array',
          items: [
            {
              type: 'string',
            },
            {
              type: 'number',
            },
          ],
        },
        value: [],
        onChange: () => {},
      },
    })

    const arr = wrapper.findComponent(ArrayField)
    const str = wrapper.findComponent(StringField)
    const num = wrapper.findComponent(NumberField)
    expect(arr.exists()).toBeTruthy()
    expect(num.exists()).toBeTruthy()
    expect(str.exists()).toBeTruthy()
  })

  it('shoulde render single type', () => {
    const wrapper = mount(TestComponent, {
      props: {
        schema: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        value: ['1', '2'],
        onChange: () => {},
      },
    })

    const arr = wrapper.findComponent(ArrayField)
    const strs = wrapper.findAllComponents(StringField)
    expect(strs.length).toBe(2)
    expect(strs[0].props('value')).toBe('1')
  })

  it('shoulde render select type', () => {
    const wrapper = mount(TestComponent, {
      props: {
        schema: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['1', '2', '3'],
          },
        },
        value: [],
        onChange: () => {},
      },
    })

    const arr = wrapper.findComponent(ArrayField)
    const select = arr.findComponent(SelectionWidget)

    expect(select.exists()).toBeTruthy()
  })
})
