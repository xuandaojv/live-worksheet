<template>
  <div 
    class="drop-zone" 
    :class="{ 'has-content': content !== '....................................' }"
    @dragover.prevent
    @drop="onDrop"
    @touchend.prevent="onTouchEnd"
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
import { inject } from 'vue';
import katex from 'katex';
const props = defineProps(['content']);
const emit = defineEmits(['dropped']);

const currentDrag = inject('currentDrag', null);

const renderMath = (text) => {
  return katex.renderToString(text, { throwOnError: false });
};

const onDrop = (e) => {
  const id = e.dataTransfer.getData('optionId');
  emit('dropped', id);
};

const onTouchEnd = () => {
  if (currentDrag && currentDrag.value) {
    emit('dropped', currentDrag.value);
  }
};
</script>