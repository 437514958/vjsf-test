import Ajv, { type ErrorObject } from 'ajv'
import i18n from 'ajv-i18n'
import type { Schema } from './types'
import toPath from 'lodash.topath'
import { isObject } from './utils'
interface TransformedErrorObject {
  name: string
  property: string
  message: string | undefined
  params: Record<string, any>
  schemaPath: string
}

export type ErrorSchema = { [level: string]: ErrorSchema } & { __errors?: string[] }

function transformErrors(errors: ErrorObject[] | null | undefined): TransformedErrorObject[] {
  if (errors === null || errors === undefined) return []

  return errors.map(({ message, instancePath, keyword, params, schemaPath }) => {
    return {
      name: keyword,
      property: `${instancePath}`,
      message,
      params,
      schemaPath,
    }
  })
}

function toErrorSchema(errors: TransformedErrorObject[]) {
  if (errors.length < 1) return {}

  return errors.reduce((errorSchema, error) => {
    const { property, message } = error
    const path = toPath(property)
    let parent = errorSchema
    if (path.length > 0 && path[0] === '') {
      path.splice(0, 1)
    }
    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        ;(parent as any)[segment] = {}
      }
      parent = parent[segment]
    }

    if (Array.isArray(parent.__errors)) {
      parent.__errors = parent.__errors.concat(message || '')
    } else {
      if (message) {
        parent.__errors = [message]
      }
    }
    return errorSchema
  }, {} as ErrorSchema)
}

export async function validateFormData(
  validator: Ajv,
  formData: any,
  schema: Schema,
  locale = 'zh',
  customValidate?: (data: any, erros: any) => void,
) {
  let validationError = null
  try {
    validator.validate(schema, formData)
  } catch (err) {
    validationError = err
  }
  ;(i18n as any)[locale](validator.errors)
  let errors = transformErrors(validator.errors)
  if (validationError) {
    errors = [...errors, { message: (validationError as any).message } as TransformedErrorObject]
  }

  const errorSchema = toErrorSchema(errors)

  if (!customValidate) {
    return {
      errors,
      errorSchema,
      valid: errors.length === 0,
    }
  }
  const proxy = createErrorProxy()
  await customValidate(formData, proxy)

  const newErroSchema = mergeObjects(errorSchema, proxy, true)
  console.log('aaaaaaaaa', formData.pass1)
  return {
    errors,
    errorSchema: newErroSchema,
    valid: errors.length === 0,
  }
}

function createErrorProxy() {
  const raw = {}
  return new Proxy(raw, {
    get(target, key, receiver) {
      if (key === 'addError') {
        return (msg: string) => {
          const __errors = Reflect.get(target, '__errors', receiver)
          if (__errors && Array.isArray(__errors)) {
            __errors.push(msg)
          } else {
            ;(target as any).__errors = [msg]
          }
        }
      }
      const res = Reflect.get(target, key, receiver)
      if (res === undefined) {
        const p: any = createErrorProxy()
        ;(target as any)[key] = p
        return p
      }
      return res
    },
  })
}

export function mergeObjects(obj1: any, obj2: any, concatArrays: boolean = false) {
  const acc = Object.assign({}, obj1)
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1 ? obj1[key] : {},
      right = obj2[key]
    if (obj1 && obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeObjects(left, right, concatArrays)
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(right)
    } else {
      acc[key] = right
    }
    return acc
  }, acc)
}
