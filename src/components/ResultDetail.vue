<template>
  <section class="proof-paper">
    <h3 class="proof-title">Chứng minh</h3>
    
    <div class="proof-content">
      <div class="line">
        Ta có: <MathText text="\frac{BC}{B'C'} = \frac{AC}{A'C'} = k" /> nên 
        <drop-zone data-blank-id="1a" @dropped="handleDrop('1a', $event)" :content="getBlankContent('1a')" /> 
        và 
        <drop-zone data-blank-id="1b" @dropped="handleDrop('1b', $event)" :content="getBlankContent('1b')" /> 
        <span class="step-num">(1)</span>
      </div>

      <div class="line">
        Áp dụng định lý Pythagore trong <MathText text="\triangle ABC" /> ta có: 
        <drop-zone data-blank-id="2" @dropped="handleDrop('2', $event)" :content="getBlankContent('2')" /> <span class="step-num">(2)</span>
      </div>

      <div class="line">
        Áp dụng định lý Pythagore trong <MathText text="\triangle A'B'C'" /> ta có: 
        <drop-zone data-blank-id="3" @dropped="handleDrop('3', $event)" :content="getBlankContent('3')" /> <span class="step-num">(3)</span>
      </div>

      <div class="line">
        Thay thế (1) vào (2) ta được: 
        <drop-zone data-blank-id="4" @dropped="handleDrop('4', $event)" :content="getBlankContent('4')" /> <span class="step-num">(4a)</span>
      </div>

      <div class="line hay-line">
        Hay <drop-zone data-blank-id="4b" @dropped="handleDrop('4b', $event)" :content="getBlankContent('4b')" /> <span class="step-num">(4b)</span>
      </div>

      <div class="line">
        Suy ra <drop-zone data-blank-id="5" @dropped="handleDrop('5', $event)" :content="getBlankContent('5')" /> <span class="step-num">(5)</span>
        nên <drop-zone data-blank-id="6" @dropped="handleDrop('6', $event)" :content="getBlankContent('6')" /> <span class="step-num">(6)</span>
      </div>

      <div class="line">
        Do đó: <drop-zone data-blank-id="7" @dropped="handleDrop('7', $event)" :content="getBlankContent('7')" /> <span class="step-num">(7)</span>
      </div>

      <div class="line extra-padding">
        nên theo trường hợp đồng dạng thứ nhất của tam giác thì:
      </div>

      <div class="line final-line">
        <drop-zone data-blank-id="8" @dropped="handleDrop('8', $event)" :content="getBlankContent('8')" /> <span class="step-num">(8)</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import DropZone from './components/DropZone.vue';
import { defineComponent, h } from 'vue';
import katex from 'katex';
const MathText = defineComponent({
  props: ['text'],
  setup(props) {
    return () => {
      if (!props.text || props.text.includes('...')) {
        return h('span', props.text);
      }
      const html = katex.renderToString(props.text, { throwOnError: false });
      return h('span', { innerHTML: html });
    };
  }
});

const props = defineProps(['text']);

// The function you asked for
const getBlankContent = (blankId) => {
  if (filledBlanks.value[blankId]) {
    return filledBlanks.value[blankId].label;
  }
  // This return value matches the visual style of your image
  return '....................................';
};

const handleDrop = (blankId, optionId) => {
  const option = availableOptions.value.find(o => o.id === optionId);
  if (option) {
    filledBlanks.value[blankId] = { ...option };
  }
  currentDrag.value = null;
};

</script>