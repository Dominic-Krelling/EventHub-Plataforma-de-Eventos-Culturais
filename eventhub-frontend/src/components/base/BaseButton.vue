<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  fullWidth: {
    type: Boolean,
    default: true
  },
  variant: {
    type: String,
    default: 'primary'
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'btn',
      variant === 'primary' ? 'btn-eventhub' : `btn-${variant}`,
      { 'w-100': fullWidth }
    ]"
  >
    <span
      v-if="loading"
      class="spinner-border spinner-border-sm me-2"
      aria-hidden="true"
    ></span>

    <i
      v-else-if="icon"
      :class="['bi', `bi-${icon}`, 'me-2']"
    ></i>

    <slot></slot>
  </button>
</template>