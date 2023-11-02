import { defineComponent, computed } from 'vue'
import { SchemaTypes, FiledPropsDefine } from './types'
import StringField from './fields/StringField'
import NumberField from './fields/NumberField'
import ObjectField from './fields/ObjectField'
import ArrayField from './fields/ArrayField'
import { retrieveSchema } from './utils'
import { useVJSFContext } from './context'

export default defineComponent({
  name: 'SchemaItem',
  props: FiledPropsDefine,
  setup(props) {
    const formContext = useVJSFContext()
    const retrievedSchemaRef = computed(() => {
      const { schema, rootSchema, value } = props
      return formContext.transformSchemaRef.value(retrieveSchema(schema, rootSchema, value))
    })

    return () => {
      const { schema } = props
      const retrievedSchema = retrievedSchemaRef.value
      // todo 未指定type需要进行猜测

      const type = schema.type
      let Component: any
      switch (type) {
        case SchemaTypes.STRING: {
          Component = StringField
          break
        }
        case SchemaTypes.NUMBER: {
          Component = NumberField
          break
        }
        case SchemaTypes.OBJECT: {
          Component = ObjectField
          break
        }
        case SchemaTypes.ARRAY: {
          Component = ArrayField
          break
        }
        default: {
          console.warn(`${type} is not supported`)
        }
      }
      return <Component {...props} schema={retrievedSchema} />
    }
  },
})
