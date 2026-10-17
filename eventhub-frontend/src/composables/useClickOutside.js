import { onBeforeUnmount, onMounted } from 'vue';

export function useClickOutside(target, callback) {
  const onPointerDown = (event) => {
    const element = target.value;
    if (element && !element.contains(event.target)) callback(event);
  };

  onMounted(() => document.addEventListener('pointerdown', onPointerDown));
  onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown));
}
