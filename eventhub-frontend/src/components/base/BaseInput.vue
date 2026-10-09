<script setup>
import { computed } from 'vue'

const model = defineModel({
  type: [String, Number],
  default: ''
})

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: String,
    default: 'off'
  },
  maxlength: {
    type: Number,
    default: undefined
  },
  rows: {
    type: Number,
    default: 4
  }
})

const isTextarea = computed(
  () => props.type === 'textarea'
)
</script>

<template>
  <div class="mb-3">
    <label
      :for="id"
      class="form-label fw-semibold"
    >
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <textarea
      v-if="isTextarea"
      :id="id"
      :name="id"
      v-model="model"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :maxlength="maxlength"
      :rows="rows"
      :class="['form-control', { 'is-invalid': error }]"
    ></textarea>

    <input
      v-else
      :id="id"
      :name="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      :maxlength="maxlength"
      :class="['form-control', { 'is-invalid': error }]"
    />

    <div v-if="error" class="invalid-feedback d-block">
      {{ error }}
    </div>

    <slot name="help"></slot>
  </div>
</template>