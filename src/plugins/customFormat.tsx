import { CommonWidgetPropsDefine, type CustomFormat } from '../../lib/types'
import { defineComponent, computed } from 'vue'
import { withFormItem } from '../../lib/theme-default/FormItem'

const format: CustomFormat = {
  name: 'color',
  definition: {
    validate: (data) => data.match(/^#[0-9A-f]{6}/i)?.length === 1,
  },
  component: withFormItem(
    defineComponent({
      name: 'ColorWidget',
      props: CommonWidgetPropsDefine,
      setup(props) {
        const handleChange = (e: any) => {
          const value = e.target.value
          e.target.value = props.value
          props.onChange(value)
        }
        const styleRef = computed(() => {
          return {
            color: (props.options && props.options.color) || 'black',
          }
        })

        return () => (
          <input
            type="color"
            value={props.value as any}
            onInput={handleChange}
            style={styleRef.value}
          />
        )
      },
    }),
  ),
}

export default format
