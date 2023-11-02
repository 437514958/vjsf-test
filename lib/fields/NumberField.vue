<script setup lang="ts">
import { FiledPropsDefine } from '../types'

const props = defineProps(FiledPropsDefine)
const handleChange = (e: any) => {
  const value = e.target.value
  const num = Number(value)
  if (Number.isNaN(num)) {
    props.onChange(undefined)
  } else {
    props.onChange(num)
  }
}
</script>

<template>
  <div>
    <input type="number" :value="props.value" @input="handleChange" />
  </div>
</template>

<style></style>
