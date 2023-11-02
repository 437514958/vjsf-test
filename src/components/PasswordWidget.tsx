import { type DefineComponent, defineComponent } from 'vue'
import { CommonWidgetPropsDefine } from '../../lib/types'
import { withFormItem } from '../../lib/theme-default/FormItem'
const PasswordWidget: DefineComponent<typeof CommonWidgetPropsDefine> = withFormItem(
  defineComponent({
    name: 'PasswordWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: any) => {
        const value = e.target.value
        e.target.value = props.value
        props.onChange(value)
      }
      return () => <input type="password" value={props.value as any} onInput={handleChange} />
    },
  }),
)

export default PasswordWidget
