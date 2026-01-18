<template>
  <div class="app-background">
    <div class="math-activity-container">
      
      <header class="main-header">
        <div class="timer" style="display: flex; justify-content: space-between;">
          <Timer v-if="isStarted" :time="120" @time-up="handleTimeUp" />
          <music-player @start="isStarted = true"></music-player>
        </div>
        <div class="title-badge">TẬP SUY LUẬN</div>
        <p class="instruction-text">
          <span class="icon">✏️</span> 
          Hoàn thành phần chứng minh bằng cách kéo các đáp án vào vị trí thích hợp
        </p>
        <div class="submit-result" v-if="isSubmit">{{ submitResult }}</div>
      </header>

      <main class="content-grid">
        <section class="sidebar">
          <div class="geometry-card">
            <div class="triangle-svg-container">
                <img src="@/assets/image/2.png" alt="Triangle Diagram" class="geometry-img" />
            </div>
            
            <div class="problem-box">
              <div class="row">
                <strong>GT:</strong> 
                <MathText text="\triangle ABC, \triangle A'B'C'; \frac{BC}{B'C'} = \frac{AC}{A'C'}" />
              </div>
              <div class="divider"></div>
              <div class="row">
                <strong>KL:</strong> 
                <MathText text="\triangle ABC \sim \triangle A'B'C'" />
              </div>
            </div>
          </div>

          <div class="options-container">
              <div 
                v-for="option in availableOptions" 
                :key="option.id"
                class="draggable-chip"
                draggable="true"
                @dragstart="startDrag($event, option)"
                @dragend="endDrag"
                @touchstart.prevent="startTouch(option)"
              >
                <MathText :text="option.label" />
              </div>
          </div>
        </section>

        <section class="proof-paper">
          <h3 class="proof-title">Chứng minh</h3>
          
          <div class="proof-content">
            <div class="line">
              Ta có: <MathText text="\frac{BC}{B'C'} = \frac{AC}{A'C'} = k" /> nên 
              <drop-zone @dropped="handleDrop('1a', $event)" :content="getBlankContent('1a')" /> 
              và 
              <drop-zone @dropped="handleDrop('1b', $event)" :content="getBlankContent('1b')" /> 
              <span class="step-num">(1)</span>
            </div>

            <div class="line">
              Áp dụng định lý Pythagore trong <MathText text="\triangle ABC" /> ta có: 
              <drop-zone @dropped="handleDrop('2', $event)" :content="getBlankContent('2')" /> <span class="step-num">(2)</span>
            </div>

            <div class="line">
              Áp dụng định lý Pythagore trong <MathText text="\triangle A'B'C'" /> ta có: 
              <drop-zone @dropped="handleDrop('3', $event)" :content="getBlankContent('3')" /> <span class="step-num">(3)</span>
            </div>

            <div class="line">
              Thay thế (1) vào (2) ta được: 
              <drop-zone @dropped="handleDrop('4', $event)" :content="getBlankContent('4')" /> <span class="step-num">(4)</span>
            </div>

            <div class="line hay-line">
              Hay <MathText text="AB^2 = k^2(B'C'^2 - A'C'^2)" />.
            </div>

            <div class="line">
              Suy ra <drop-zone @dropped="handleDrop('5', $event)" :content="getBlankContent('5')" /> <span class="step-num">(5)</span>
              nên <drop-zone @dropped="handleDrop('6', $event)" :content="getBlankContent('6')" /> <span class="step-num">(6)</span>
            </div>

            <div class="line">
              Do đó: <drop-zone @dropped="handleDrop('7', $event)" :content="getBlankContent('7')" /> <span class="step-num">(7)</span>
            </div>

            <div class="line extra-padding">
              nên theo trường hợp đồng dạng thứ nhất của tam giác thì:
            </div>

            <div class="line final-line">
              <drop-zone @dropped="handleDrop('8', $event)" :content="getBlankContent('8')" /> <span class="step-num">(8)</span>
            </div>
          </div>

          <div class="footer-actions">
             <button @click="reset" class="btn-secondary">Làm lại</button>
             <button @click="checkAnswers" class="btn-primary">Kiểm tra kết quả</button>
          </div>
        </section>
      </main>
    </div>
    <times-up @review="() => {isSubmit = false}" :show="isSubmit" :score="submitResult"></times-up>
  </div>
</template>
<script setup>
import { ref, defineComponent, h, provide } from 'vue';
import DropZone from './components/DropZone.vue';
import katex from 'katex';
import Timer from './components/Timer.vue';
import TimesUp from './components/TimesUp.vue';
import MusicPlayer from './components/MusicPlayer.vue';

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

const availableOptions = ref([
  { id: 'a2', label: "AC = k \\cdot A'C'", correctPos: ['1b','1a'] },
  { id: 'a9', label: "\\triangle ABC \\sim \\triangle A'B'C'", correctPos: ['8'] },
  { id: 'a1', label: "BC = k \\cdot B'C'", correctPos: ['1a', '1b'] },
  { id: 'a7', label: "AB = k \\cdot A'B'", correctPos: ['6'] },
  { id: 'a4', label: "A'B'^2 = B'C'^2 - A'C'^2", correctPos: ['3'] },
  { id: 'a5', label: "AB^2 = (k \\cdot B'C')^2 - (k \\cdot A'C')^2", correctPos: ['4'] },
  { id: 'a8', label: "\\frac{AB}{A'B'} = \\frac{AC}{A'C'} = \\frac{BC}{B'C'} = k", correctPos: ['7'] },
  { id: 'a3', label: "AB^2 = BC^2 - AC^2", correctPos: ['2'] },
  { id: 'a6', label: "AB^2 = k^2 \\cdot A'B'^2", correctPos: ['5'] },
]);

const currentDrag = ref(null);

provide('currentDrag', currentDrag);

const reset = () => {
  for (const key in filledBlanks.value) {
    filledBlanks.value[key] = null;
  }
};

const checkAnswers = () => {
  let score = 0;
  const total = 9; // Total number of blanks (including 1.5)
  Object.keys(filledBlanks.value).forEach(blankId => {
    const answer = filledBlanks.value[blankId];
    // Check if the current blankId is in the allowed correct positions for this answer
    if (answer && answer.correctPos.includes(blankId.toString())) {
      score++;
    }
  });
  isSubmit.value = true;
  submitResult.value = `${score}/${total}`;
};

const isSubmit = ref(false);
const isStarted = ref(false);

const submitResult = ref("0/9");
// Initialize with keys but empty values
const filledBlanks = ref({
  '1a': null,
  '1b': null,
  '2': null,
  '3': null,
  '4': null,
  '5': null,
  '6': null,
  '7': null,
  '8': null
});

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

const startDrag = (event, option) => {
  event.dataTransfer.setData('optionId', option.id);
  currentDrag.value = option.id;
};

const endDrag = () => {
  currentDrag.value = null;
};

const startTouch = (option) => {
  currentDrag.value = option.id;
};
</script>

<style scoped>
  .submit-result{
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 24px;
    color: green;
    font-weight: 700;
  }
/* 1. Global Background (Soft Blue/Grey with Math Grid) */
.app-background {
  min-height: 100vh;
  background-color: #f0f4f8;
  background-image: radial-gradient(#d1d9e6 1px, transparent 1px);
  background-size: 30px 30px; /* Creates a subtle math-grid effect */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

/* 2. Main Container */
.math-activity-container {
  width: 100%;
  max-width: 1100px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  padding: 30px;
  border: 1px solid #ffffff;
}

/* 3. Header Styling */
.main-header {
  text-align: center;
  margin-bottom: 40px;
}

.title-badge {
  display: inline-block;
  background: #0070c0;
  color: white;
  padding: 8px 24px;
  border-radius: 50px;
  font-weight: 800;
  letter-spacing: 1px;
  box-shadow: 0 4px 10px rgba(0, 112, 192, 0.3);
}

.instruction-text {
  margin-top: 15px;
  color: #4a5568;
  font-size: 1.1rem;
}

/* 4. Layout Grid */
.content-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 30px;
}

/* 5. Geometry Sidebar */
.geometry-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
  border: 1px solid #e2e8f0;
}

.geometry-img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 15px;
}

.problem-box {
  background: #f8fafc;
  padding: 15px;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #2d3748;
}

.divider {
  height: 1px;
  background: #cbd5e0;
  margin: 10px 0;
}

/* 6. Draggable Options (Chips) */
.options-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 25px;
}

.draggable-chip {
  background: white;
  border: 2px solid #00b0f0;
  color: #0070c0;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: grab;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(0, 176, 240, 0.1);
}

.draggable-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 176, 240, 0.2);
  background: #f0faff;
}

.draggable-chip:active {
  cursor: grabbing;
}

/* 7. Proof Paper (Notebook Look) */
.proof-paper {
  background: white;
  border-radius: 16px;
  padding: 40px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  border-left: 5px solid #00b0f0; /* Notebook margin line */
}

.proof-title {
  text-decoration: underline;
  text-underline-offset: 8px;
  margin-bottom: 30px;
  color: #1a202c;
}

.line {
  margin-bottom: 20px;
  line-height: 1.8;
  color: #4a5568;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.step-num {
  color: #a0aec0;
  font-weight: normal;
  margin-left: auto;
}

.hay-line {
  font-style: italic;
  color: #718096;
}

/* 8. Buttons */
.footer-actions {
  margin-top: 40px;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.btn-primary {
  background: #0070c0;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-secondary {
  background: #edf2f7;
  color: #4a5568;
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover { opacity: 0.9; }
/* Responsive: adapt layout for narrower screens and mobile */
@media (max-width: 1080px) {
  .math-activity-container {
    padding: 22px;
    max-width: 100%;
  }

  .content-grid {
    grid-template-columns: 300px 1fr;
    gap: 20px;
  }

  .proof-paper {
    padding: 28px;
  }
}

@media (max-width: 720px) {
  .app-background {
    padding: 16px 12px;
    align-items: flex-start;
  }

  .math-activity-container {
    padding: 14px;
    border-radius: 12px;
    box-shadow: none;
  }

  .main-header {
    margin-bottom: 20px;
  }

  .title-badge {
    padding: 6px 14px;
    font-size: 0.95rem;
  }

  .instruction-text {
    font-size: 0.95rem;
    margin-top: 10px;
  }

  .content-grid {
    display: block;
  }

  .sidebar {
    margin-bottom: 18px;
  }

  .geometry-img {
    width: 100%;
    max-height: 220px;
    object-fit: contain;
  }

  .options-container {
    justify-content: center;
    gap: 10px;
  }

  .draggable-chip {
    padding: 8px 12px;
    font-size: 0.85rem;
  }

  .proof-paper {
    padding: 18px;
    border-left-width: 4px;
  }

  .proof-title { margin-bottom: 18px; }

  .line { margin-bottom: 14px; line-height: 1.6; }

  .step-num { margin-left: 8px; order: 2; }

  .footer-actions {
    margin-top: 20px;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
  }

  .btn-primary, .btn-secondary {
    width: 100%;
    padding: 10px 16px;
  }

  .submit-result{
    font-size: 18px;
    top: 10px;
    right: 10px;
  }
}

</style>