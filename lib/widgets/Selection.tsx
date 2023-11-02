import { defineComponent, ref, watch, watchEffect } from 'vue'
import { type SelectionWidgetDefine, SelectionWidgetPropsDefine } from '../types'
const Selection: SelectionWidgetDefine = defineComponent({
  name: 'SelectionWidget',
  props: SelectionWidgetPropsDefine,
  setup(props) {
    const currentValueRef = ref(props.value)

    watch(currentValueRef, (newv) => {
      if (newv !== props.value) {
        props.onChange(newv)
      }
    })

    watch(
      () => props.value,
      (v) => {
        if (v !== currentValueRef.value) {
          currentValueRef.value = v
        }
      },
    )

    watchEffect(() => {
      console.log(currentValueRef.value, '------------->')
    })

    return () => {
      const { options } = props
      return (
        <select multiple={true} v-model={currentValueRef.value}>
          {options.map((op) => (
            <option value={op.value}>{op.key}</option>
          ))}
        </select>
      )
    }
  },
})

export default Selection
