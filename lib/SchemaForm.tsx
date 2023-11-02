import {
  type PropType,
  defineComponent,
  provide,
  type Ref,
  watch,
  shallowRef,
  watchEffect,
  ref,
  computed,
} from 'vue'
import {
  type CommonWidgetDefine,
  type CustomFormat,
  type CustomKeyword,
  type Schema,
  type UISchema,
} from './types'
import SchemaItem from './SchemaItem'
import { SchemaFormContextKey } from './context'
import Ajv, { type Options } from 'ajv'
import { validateFormData, type ErrorSchema } from './validator'
interface ContextRef {
  doValidate: () => Promise<{
    errors: any[]
    valid: boolean
  }>
}

const defaultAjvOptions: Options = {
  allErrors: true,
  jsPropertySyntax: true,
}

export default defineComponent({
  name: 'SchemaForm',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    value: {
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
    contextRef: {
      type: Object as PropType<Ref<ContextRef> | undefined>,
    },
    ajvOptions: {
      type: Object as PropType<Options>,
    },
    locale: {
      type: String,
      default: 'zh',
    },
    customValidate: {
      type: Function as PropType<(data: any, erros: any) => void>,
    },
    uiSchema: {
      type: Object as PropType<UISchema>,
    },
    customFormats: {
      type: [Array, Object] as PropType<CustomFormat[] | CustomFormat>,
    },
    customKeywords: {
      type: [Array, Object] as PropType<CustomKeyword[] | CustomKeyword>,
    },
  },
  setup(props) {
    const handleChange = (v: any) => {
      props.onChange(v)
    }
    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({})
    const validatorRef: Ref<Ajv> = shallowRef() as any
    watchEffect(() => {
      validatorRef.value = new Ajv({ ...defaultAjvOptions, ...props.ajvOptions })
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats]
        customFormats.forEach((format) => {
          validatorRef.value.addFormat(format.name, format.definition)
        })
      }
      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords]
        customKeywords.forEach((keyword) => {
          validatorRef.value.addKeyword(keyword.name, keyword.definition as any)
        })
      }
    })
    const validatorResolveRef = ref()
    const validateIndex = ref(0)
    watch(
      () => props.value,
      () => {
        if (validatorResolveRef.value) {
          doValidate()
        }
      },
      { deep: true },
    )
    async function doValidate() {
      const index = (validateIndex.value += 1)
      const result = await validateFormData(
        validatorRef.value,
        props.value,
        props.schema,
        props.locale,
        props.customValidate,
      )
      if (index != validateIndex.value) return
      errorSchemaRef.value = result.errorSchema
      validatorResolveRef.value(result)
      validatorResolveRef.value = undefined
    }
    watch(
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            doValidate() {
              return new Promise((resolve) => {
                validatorResolveRef.value = resolve
                doValidate()
              })
            },
          }
        }
      },
      {
        immediate: true,
      },
    )
    const formatMapRef = computed(() => {
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats]
        return customFormats.reduce(
          (result, format) => {
            result[format.name] = format.component
            return result
          },
          {} as { [key: string]: CommonWidgetDefine },
        )
      } else {
        return {}
      }
    })

    const transformSchemaRef = computed(() => {
      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords]
        return (schema: Schema) => {
          let newSchema = schema
          customKeywords.forEach((keyword) => {
            if ((newSchema as any)[keyword.name]) {
              newSchema = keyword.transformSchema(schema)
            }
          })
          return newSchema
        }
      } else {
        return (s: Schema) => s
      }
    })
    const context = {
      SchemaItem,
      formatMapRef,
      transformSchemaRef,
    }
    provide(SchemaFormContextKey, context)

    return () => {
      const { schema, value, uiSchema } = props
      return (
        <SchemaItem
          schema={schema}
          rootSchema={schema}
          onChange={handleChange}
          value={value}
          style="display: flex"
          errorSchema={errorSchemaRef.value || {}}
          uiSchema={uiSchema || {}}
        />
      )
    }
  },
})
