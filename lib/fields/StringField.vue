<script setup lang="ts">
import { FiledPropsDefine } from '../types'

const props = defineProps(FiledPropsDefine)
const handleChange = (e: any) => {
  props.onChange(e.target.value)
}
</script>

<template>
  <div>
    <input type="text" :value="props.value" @input="handleChange" />
  </div>
</template>

<style></style>
