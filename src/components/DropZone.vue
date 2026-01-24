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
      <div class="c-dropped" :class="'status-' + status" v-html="renderMath(content)"></div>
    </template>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import katex from 'katex';
const props = defineProps(['content', 'status']);
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
<style scoped>
.drop-zone {
  line-height: 44px;
}
::v-deep(.c-dropped .katex) {
  border-bottom: dashed 1px #019940;
}

::v-deep(.status-correct .katex) {
  border: solid 1px #019940;
  padding: 4px;
  border-radius: 8px;
  
}

.status-correct::after {
  content: '✓';
  color: #019940;
  font-weight: bold;
  margin-left: 6px;
}

::v-deep(.status-incorrect .katex) {
  border: solid 1px red;
  padding: 4px;
  border-radius: 8px;
}

.status-incorrect::after {
  content: '✗';
  color: red;
  font-weight: bold;
  margin-left: 6px;
}
</style>