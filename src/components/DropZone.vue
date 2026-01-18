<template>
  <div 
    class="drop-zone" 
    :class="{ 'has-content': content !== '....................................' }"
    @dragover.prevent
    @drop="onDrop"
  >
    <template v-if="content.includes('...')">
      {{ content }}
    </template>
    <template v-else>
      <div v-html="renderMath(content)"></div>
    </template>
  </div>
</template>

<script setup>
import katex from 'katex';
const props = defineProps(['content']);
const emit = defineEmits(['dropped']);

const renderMath = (text) => {
  return katex.renderToString(text, { throwOnError: false });
};

const onDrop = (e) => {
  const id = e.dataTransfer.getData('optionId');
  emit('dropped', id);
};
</script>