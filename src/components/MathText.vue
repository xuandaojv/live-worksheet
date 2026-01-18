<template>
  <span v-html="htmlContent"></span>
</template>

<script setup>
import { computed } from 'vue';
import katex from 'katex';

const props = defineProps(['text']);

const htmlContent = computed(() => {
  if (!props.text) return '';
  try {
    return katex.renderToString(props.text, {
      throwOnError: false,
      displayMode: false // false để hiển thị trên cùng một dòng (inline)
    });
  } catch (e) {
    return props.text;
  }
});
</script>