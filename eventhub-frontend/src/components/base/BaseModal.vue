<script setup>
import { onBeforeUnmount, onMounted } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  busy: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

function close() {
  if (!props.busy) emit('update:modelValue', false);
}

function onKeydown(event) {
  if (event.key === 'Escape' && props.modelValue) close();
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-backdrop" @click.self="close">
      <section class="modal-panel" role="dialog" aria-modal="true" :aria-label="title">
        <header class="modal-header">
          <h2>{{ title }}</h2>
          <button type="button" aria-label="Fechar" :disabled="busy" @click="close">×</button>
        </header>
        <div class="modal-content">
          <slot />
        </div>
        <footer class="modal-footer">
          <slot name="footer" :close="close" :busy="busy">
            <button type="button" :disabled="busy" @click="close">Cancelar</button>
            <button type="button" :disabled="busy" @click="$emit('confirm')">
              {{ busy ? 'Aguarde...' : 'Confirmar' }}
            </button>
          </slot>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop{position:fixed;inset:0;z-index:3000;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(15,18,30,.62)}
.modal-panel{width:min(100%,520px);max-height:90vh;overflow:auto;background:#fff;color:#242333;border-radius:14px;box-shadow:0 18px 60px rgba(0,0,0,.25)}
.modal-header,.modal-footer{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 1.25rem}
.modal-header{border-bottom:1px solid #e8e7ee}
.modal-header h2{margin:0;font-size:1.15rem}
.modal-header button{border:0;background:transparent;font-size:1.6rem;cursor:pointer}
.modal-content{padding:1.25rem}
.modal-footer{justify-content:flex-end;border-top:1px solid #e8e7ee}
.modal-footer button{padding:.6rem 1rem;border:0;border-radius:8px;cursor:pointer}
.modal-footer button:last-child{background:#6c4ab6;color:#fff}
</style>
