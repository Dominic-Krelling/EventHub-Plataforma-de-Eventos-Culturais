<script setup>
import { useToast } from '../composables/useToast'

const { toasts, remove } = useToast()

const icons = {
  success: 'bi-check-circle-fill',
  error: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill'
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
          :role="toast.type === 'error' ? 'alert' : 'status'"
          @click="remove(toast.id)"
        >
          <i class="bi" :class="icons[toast.type]"></i>
          <span class="toast-message">{{ toast.message }}</span>
          <button
            type="button"
            class="toast-close"
            aria-label="Fechar aviso"
            @click.stop="remove(toast.id)"
          >
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 4000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(380px, calc(100vw - 32px));
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #fff;
  color: #242333;
  border-left: 5px solid #6c4ab6;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
  pointer-events: auto;
  cursor: pointer;
}

.toast--success { border-left-color: #2e7d32; }
.toast--success i { color: #2e7d32; }
.toast--error { border-left-color: #c62828; }
.toast--error i { color: #c62828; }
.toast--info i { color: #6c4ab6; }

.toast-message {
  flex: 1;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.toast-close {
  border: 0;
  background: transparent;
  font-size: 1.3rem;
  line-height: 1;
  color: #777;
  cursor: pointer;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active { transition: none; }
}
</style>