import { defineComponent, computed } from 'vue'
import { FiledPropsDefine, CommonWidgetNames } from '../types'
import { getWidget } from '../widgets/theme'

export default defineComponent({
  name: 'StringField',
  props: FiledPropsDefine,
  setup(props) {
    const handleChange = (v: string) => {
      props.onChange(v)
    }
    const TextWidgetRef = computed(() => {
      const widgetRef = getWidget(CommonWidgetNames.TextWidget, props)
      return widgetRef.value
    })
    const widgetOptionsRef = computed(() => {
      const { widget, properties, items, ...rest } = props.uiSchema
      return rest
    })
    return () => {
      const { rootSchema, errorSchema, ...rest } = props
      rest.onChange = handleChange
      const TextWidget = TextWidgetRef.value
      return <TextWidget {...rest} error={errorSchema.__errors} options={widgetOptionsRef.value} />
    }
  },
})
