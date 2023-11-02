import SchemaFrom from './SchemaForm'
import NumberField from './fields/NumberField.vue'
import ObjectField from './fields/ObjectField'
import StringField from './fields/StringField.vue'
import ArrayField from './fields/ArrayField'
import SelectionWidget from './widgets/Selection'
import ThemeProvider from './widgets/theme'

export default SchemaFrom

export * from './types'

export { NumberField, ObjectField, StringField, ArrayField, SelectionWidget, ThemeProvider }
