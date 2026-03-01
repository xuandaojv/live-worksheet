<template>
  <div class="app-background">
    <div class="math-activity-container">
      
      <header class="main-header">
        <div class="timer" style="display: flex; justify-content: space-between;">
          <Timer v-if="isStarted" :time="180" @time-up="handleTimeUp" />
          <music-player @start="handlePlayerStart"></music-player>
        </div>
        <div class="title-badge">BÀI LÀM</div>
        <p class="instruction-text">
          <span class="icon">✏️</span> 
          Hoàn thành bài làm bằng cách kéo các đáp án vào vị trí thích hợp
        </p>
        <div class="submit-result" v-if="isSubmit">{{ submitResult }}</div>
      </header>

      <main class="content-grid">
        <section class="sidebar">
          <div class="geometry-card">
            <div class="triangle-svg-container">
                <img src="@/assets/image/4.jpg" alt="Triangle Diagram" class="geometry-img" />
            </div>
            
            <!-- <div class="problem-box">
              <div class="row">
                <strong>GT:</strong>
                <div>
                  <MathText text="\text{Cho hình ảnh biết: }" />
                  <br>
                  <MathText :text="'\\angle CFG = \\angle CDE = 90^\\circ'" />
                </div>
              </div>
              <div class="divider"></div>
              <div class="row">
                <strong>KL:</strong>
                <div>
                  <MathText text="\text{Tìm khoảng cách từ điểm D trên} \\ \text{bờ hồ tới điểm C trên Tháp Rùa (m)}" />
                </div>
              </div>
            </div> -->
          </div>

          <div class="options-container">
              <div 
              v-for="option in availableOptions" 
              :key="option.id"
              class="draggable-chip"
              draggable="true"
              @dragstart="startDrag($event, option)"
              @touchstart="handleTouchStart($event, option)"
              @touchmove="handleTouchMove($event)"
              @touchend="handleTouchEnd($event, option)"
            >
              <MathText :text="option.label" />
            </div>
          </div>
        </section>

        <section class="proof-paper">
          <!-- <h3 class="proof-title">Bài làm</h3> -->
          
          <div class="proof-content">
            <div class="line">
              Xét hai tam giác: 
              <drop-zone data-blank-id="1a" @dropped="handleDrop('1a', $event)" :content="getBlankContent('1a')" />
              <!-- và
              <drop-zone data-blank-id="1b" @dropped="handleDrop('1b', $event)" :content="getBlankContent('1b')" /> -->
              Có: 
              <span class="step-num">(1)</span>
            </div>

            <div class="line">
              <drop-zone data-blank-id="2" @dropped="handleDrop('2', $event)" :content="getBlankContent('2')" />
              <span class="step-num">(2)</span>
            </div>

            <div class="line">
              và <drop-zone data-blank-id="3" @dropped="handleDrop('3', $event)" :content="getBlankContent('3')" /> <span class="step-num">(3)</span>
            </div>

            <div class="line">
              Suy ra: <drop-zone data-blank-id="4" @dropped="handleDrop('4', $event)" :content="getBlankContent('4')" /> <span class="step-num">(4)</span>
            </div>

            <div class="line">
              Do đó: <drop-zone data-blank-id="5" @dropped="handleDrop('5', $event)" :content="getBlankContent('5')" />(cặp cạnh tương ứng tỉ lệ) <span class="step-num">(5)</span>
            </div>

            <div class="line">
              <drop-zone data-blank-id="6" @dropped="handleDrop('6', $event)" :content="getBlankContent('6')" /> <span class="step-num">(6)</span>
            </div>

            <div class="line">
              <drop-zone data-blank-id="10" @dropped="handleDrop('10', $event)" :content="getBlankContent('10')" /> <span class="step-num">(7)</span>
            </div>

            <div class="line">
              <drop-zone data-blank-id="7" @dropped="handleDrop('7', $event)" :content="getBlankContent('7')" /> <span class="step-num">(8)</span>
            </div>

            <div class="line">
              <drop-zone data-blank-id="8" @dropped="handleDrop('8', $event)" :content="getBlankContent('8')" /> <span class="step-num">(9)</span>
            </div>

            <div class="line final-line">
              Vậy khoảng cách từ điểm F (gốc cây) trên bờ hồ tới điểm C trên Tháp Rùa: <drop-zone data-blank-id="9" @dropped="handleDrop('9', $event)" :content="getBlankContent('9')" /> <span class="step-num">(10)</span>
            </div>
          </div>

          <div class="footer-actions">
             <button @click="reset" class="btn-secondary">Làm lại</button>
             <button v-if="!isSubmitting" @click="checkAnswers" class="btn-primary">Nộp bài</button>
             <button v-else class="btn-primary disabled">Đã nộp bài</button>
          </div>
        </section>
      </main>
    </div>
    <times-up @review="() => {isSubmit = false}" :show="isSubmit" :score="submitResult"></times-up>
    <div class="app-background">
      <div 
        v-if="activeTouchOption && touchPosition.show"
        class="touch-preview"
        :style="{ 
          left: touchPosition.x + 'px', 
          top: touchPosition.y + 'px' 
        }"
      >
        <MathText :text="activeTouchOption.label" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, defineComponent, h, provide } from 'vue';
import DropZone from './components/DropZone.vue';
import katex from 'katex';
import Timer from './components/Timer.vue';
import TimesUp from './components/TimesUp.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import createSubmission from './models/submission'
import submissionService from './services/submissionService'

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

const activeTouchOption = ref(null);
const touchPosition = ref({ x: 0, y: 0, show: false });
const playerName = ref('')

const handlePlayerStart = (name) => {
  if (name && typeof name === 'string') playerName.value = name.trim()
  isStarted.value = true
}

const handleTouchStart = (event, option) => {
  activeTouchOption.value = option;
  touchPosition.value.show = false; // Chưa hiện ngay, chờ di chuyển
};

const handleTouchMove = (event) => {
  if (!activeTouchOption.value) return;
  
  const touch = event.touches[0];
  
  // Cập nhật vị trí để Preview bay theo ngón tay
  touchPosition.value = {
    x: touch.clientX,
    y: touch.clientY,
    show: true
  };

  // Ngăn chặn cuộn trang khi đang kéo để trải nghiệm mượt hơn
  if (event.cancelable) event.preventDefault();
};

const handleTouchEnd = (event) => {
  if (!activeTouchOption.value) return;

  const touch = event.changedTouches[0];
  const dropZones = document.querySelectorAll('.drop-zone');
  
  dropZones.forEach((zone) => {
    const rect = zone.getBoundingClientRect();
    if (
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom
    ) {
      const blankId = zone.getAttribute('data-blank-id');
      if (blankId) {
        handleDrop(blankId, activeTouchOption.value.id);
      }
    }
  });

  // Reset trạng thái
  activeTouchOption.value = null;
  touchPosition.value.show = false;
};

const initialOptions = [
  { id: 'a3', label: "\\angle CFG = \\angle CDE = 90^\\circ", correctPos: ['2', '3'] },
  { id: 'a6', label: "\\dfrac{CF}{CD}=\\dfrac{FG}{DE}", correctPos: ['5'] },
  { id: 'a1', label: "\\triangle CFG \\ và \\ \\triangle CDE", correctPos: ['1a', '1b'] },
  { id: 'a5', label: "\\triangle CFG \\backsim \\triangle CDE \\;(g- g_)", correctPos: ['4'] },
  // { id: 'a2', label: "\\triangle CDE", correctPos: ['1b', '1a'] },
  { id: 'a11', label: "\\triangle CDE  \\backsim \\triangle CGF \\;(g- g_)", correctPos: ['11'] },
  { id: 'a4', label: "\\angle DCE \\text{ là góc chung}", correctPos: ['3', '2'] },
  { id: 'a8', label: "11CF - 10CF = 80", correctPos: ['7'] },
  { id: 'a13', label: "11CF = 10(CF + 8)", correctPos: ['10'] },
  { id: 'a10', label: "80(m)", correctPos: ['9'] },
  { id: 'a9', label: "CF = 80", correctPos: ['8'] },
  { id: 'a12', label: "CF = 100", correctPos: ['12'] },
  { id: 'a7', label: "\\dfrac{CF}{CF+8}=\\dfrac{10}{11}", correctPos: ['6'] },
];

const availableOptions = ref(initialOptions.slice());

const currentDrag = ref(null);

provide('currentDrag', currentDrag);

const isSubmitting = ref(false);

const reset = () => {
  for (const key in filledBlanks.value) {
    filledBlanks.value[key] = null;
  }
  // restore options to initial state
  availableOptions.value = initialOptions.slice();
  isSubmitting.value = false;
};

const checkAnswers = async () => {
  isSubmitting.value = true;
  let score = 0;
  const total = 10; // Updated total after moving CF out of drop-zones
  Object.keys(filledBlanks.value).forEach(blankId => {
    const answer = filledBlanks.value[blankId];
    // Check if the current blankId is in the allowed correct positions for this answer
    if (answer && answer.correctPos.includes(blankId.toString())) {
      score++;
    }
  });
  isSubmit.value = true;
  submitResult.value = `${score}/${total}`;
  // Persist structured submission using the remote API; fallback to localStorage on failure
  const details = JSON.stringify(filledBlanks.value)
  const submission = createSubmission({ name: `name`, score: score, details })

  // Use entered player name when available, otherwise try to derive a nice name from remote count
  if (playerName.value) {
    submission.name = playerName.value
  } else {
    try {
      const existing = await submissionService.list()
      const count = Array.isArray(existing) ? existing.length : 0
      submission.name = `name ${count + 1}`
    } catch (e) {
      submission.name = `name ${Date.now()}`
    }
  }

  try {
    await submissionService.create(submission)
  } catch (e) {
    console.warn('Failed to create submission via API, falling back to localStorage', e)
  }
};

const isSubmit = ref(false);
const isStarted = ref(false);

const submitResult = ref("0/11");
// Initialize with keys but empty values (11 blanks)
const filledBlanks = ref({
  '1a': null,
  '1b': null,
  '2': null,
  '3': null,
  '4': null,
  '5': null,
  '7': null,
  '8': null,
  '9': null,
  '10': null
});

// The function you asked for
const getBlankContent = (blankId) => {
  if (filledBlanks.value[blankId]) {
    // wrap filled label with as requested
    return `${filledBlanks.value[blankId].label}`;
  }
  // This return value matches the visual style of your image
  return '....................................';
};

const handleDrop = (blankId, optionId) => {
  const option = availableOptions.value.find(o => o.id === optionId);
  if (option) {
    filledBlanks.value[blankId] = { ...option };
    // remove the option so it no longer appears in the options list
    availableOptions.value = availableOptions.value.filter(o => o.id !== optionId);
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
  .row{
      display: flex;
      column-gap: 15px;
  }
  .submit-result{
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 24px;
    color: red;
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
  /* padding: 40px 20px; */
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
  grid-template-columns: 380px 1fr;
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
  /* margin-bottom: 15px; */
}

.problem-box {
  background: #f8fafc;
  padding: 15px;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #2d3748;
  position: relative;
  ::before {
    content: "";
    position: absolute;
    top: 15px;
    left: 45px;
    width: 1px;
    height: calc(100% - 30px);
    background-color: #cbd5e0;
  }
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

.draggable-chip {
  /* Ngăn chặn menu chọn văn bản khi nhấn giữ */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  touch-action: none; /* Quan trọng: Ngăn trình duyệt cuộn trang khi kéo */
  
  cursor: grab;
  /* Thêm độ trễ nhẹ hoặc phản hồi rung nếu muốn (haptic feedback) */
}

.draggable-chip:active {
  cursor: grabbing;
  transform: scale(1.1);
  opacity: 0.8;
  background: #f0faff;
}

/* Drop zone cần có kích thước đủ lớn để dễ chạm bằng ngón tay */
.drop-zone {
  min-height: 44px; /* Kích thước tối thiểu cho touch target theo chuẩn mobile */
}
.touch-preview {
  position: fixed;
  pointer-events: none; /* Quan trọng: để ngón tay có thể "xuyên qua" nó dò DropZone */
  z-index: 10000;
  background: white;
  border: 2px solid #00b0f0;
  color: #0070c0;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 600;
  white-space: nowrap;
  
  /* Căn giữa ngón tay */
  transform: translate(-50%, -100%) scale(1.1);
  
  /* Hiệu ứng đổ bóng để tạo cảm giác đang được nhấc lên */
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  opacity: 0.9;
}

/* Thêm hiệu ứng rung cho chip gốc khi được chọn */
.draggable-chip:active {
  opacity: 0.4;
  transform: scale(0.95);
}

</style>