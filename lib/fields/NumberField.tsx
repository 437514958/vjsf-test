import { FiledPropsDefine, CommonWidgetNames } from '../types'
import { defineComponent } from 'vue'
import { getWidget } from '../widgets/theme'

export default defineComponent({
  name: 'NumberField',
  props: FiledPropsDefine,
  setup(props) {
    const NumberWidgetRef = getWidget(CommonWidgetNames.NumberWidget)
    const handleChange = (v: string) => {
      const num = Number(v)
      if (Number.isNaN(num)) {
        props.onChange(undefined)
      } else {
        props.onChange(num)
      }
    }
    return () => {
      const NumberWidget = NumberWidgetRef.value
      const { rootSchema, errorSchema, ...rest } = props
      rest.onChange = handleChange
      return <NumberWidget {...rest} error={errorSchema.__errors} />
    }
  },
})
