<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  wide: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="form-card-wrapper">
    <div
      class="form-card card shadow-sm"
      :class="{ 'form-card-wide': wide }"
    >
      <div class="card-body p-4">
        <div class="text-center mb-4">
          <i
            v-if="icon"
            :class="['bi', `bi-${icon}`, 'form-card-icon']"
          ></i>

          <h1 class="eventhub-brand fw-bold mt-2">
            {{ title }}
          </h1>

          <p v-if="subtitle" class="text-muted mb-0">
            {{ subtitle }}
          </p>
        </div>

        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-card-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 30px 0;
}

.form-card {
  width: 100%;
  max-width: 460px;
  border: none;
  border-radius: 16px;
}

.form-card-wide {
  max-width: 760px;
}

.form-card-icon {
  font-size: 2.4rem;
  color: #6c4ab6;
}
</style>