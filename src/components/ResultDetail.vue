<template>
  <section class="proof-paper">
    <h3 class="proof-title">Chứng minh</h3>

    <div class="proof-content">
      <div class="line">
        Xét hai tam giác vuông: <span class="filled">△CFG</span> và <span class="filled">△CDE</span>
      </div>

      <div class="line">
        Có: <span class="filled">\(\angle CFG = \angle CDE = 90^\circ\)</span>
      </div>

      <div class="line">
        Và: <span class="filled">\(\angle DEC\) là góc chung</span>
      </div>

      <div class="line">
        Suy ra: <span class="filled">△CFG ∽ △CDE (g - g_)</span>
      </div>

      <div class="line">
        Do đó: <span class="filled">\(\dfrac{CF}{CD} = \dfrac{FG}{DF}\)</span>
      </div>

      <div class="line">
        Đặt <span class="filled">CF = x (x&gt;0) (m)</span>, suy ra: <span class="filled">\(\dfrac{x}{x+20} = \dfrac{40}{50}\)</span>
      </div>

      <div class="line">
        <span class="filled">50x - 40x = 800</span>
      </div>

      <div class="line">
        <span class="filled">x = 80 (TMĐK)</span>
      </div>

      <div class="line final-line">
        Vậy khoảng cách từ điểm D tới Tháp Rùa: <span class="filled">80 + 20 = 100 (m)</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineComponent, h } from 'vue';
import katex from 'katex';

const MathText = defineComponent({
  props: ['text'],
  setup(props) {
    return () => {
      if (!props.text) return h('span', props.text);
      // Try to render LaTeX; if it fails, render plain text
      try {
        const html = katex.renderToString(props.text, { throwOnError: false });
        return h('span', { innerHTML: html });
      } catch (e) {
        return h('span', props.text);
      }
    };
  }
});
</script>

<style scoped>
.filled {
  background: #fff7ed;
  border: 1px dashed #f59e0b;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 700;
  color: #92400e;
}
</style>