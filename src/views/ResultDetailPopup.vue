<template>
    <div class="wrapper">
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
                    <div v-for="option in availableOptions" :key="option.id" class="draggable-chip" draggable="true"
                        @dragstart="startDrag($event, option)" @touchstart="handleTouchStart($event, option)"
                        @touchmove="handleTouchMove($event)" @touchend="handleTouchEnd($event, option)">
                        <MathText :text="option.label" />
                    </div>
                </div>
            </section>
            <section class="proof-paper">
                <h3 class="proof-title">Chứng minh</h3>
                <div class="c-point" :class="getScoreStatus()" style="font-family: 'Permanent Marker', cursive;"><span style="font-size: 100px;">{{ getScore() !== undefined ? getScore() : '9' }}</span><span class="separator">/10</span></div>
                <div class="proof-content">
                    <div class="line">
                        Ta có:
                        <MathText text="\frac{BC}{B'C'} = \frac{AC}{A'C'} = k" /> nên
                        <drop-zone :status="getDropStatus('1a')" data-blank-id="1a" @dropped="handleDrop('1a', $event)"
                            :content="getBlankContent('1a')" />
                        và
                        <drop-zone :status="getDropStatus('1b')" data-blank-id="1b" @dropped="handleDrop('1b', $event)"
                            :content="getBlankContent('1b')" />
                        <span class="step-num">(1)</span>
                    </div>

                    <div class="line">
                        Áp dụng định lý Pythagore trong
                        <MathText text="\triangle ABC" /> ta có:
                        <drop-zone :status="getDropStatus('2')" data-blank-id="2" @dropped="handleDrop('2', $event)"
                            :content="getBlankContent('2')" /> <span class="step-num">(2)</span>
                    </div>

                    <div class="line">
                        Áp dụng định lý Pythagore trong
                        <MathText text="\triangle A'B'C'" /> ta có:
                        <drop-zone :status="getDropStatus('3')" data-blank-id="3" @dropped="handleDrop('3', $event)"
                            :content="getBlankContent('3')" /> <span class="step-num">(3)</span>
                    </div>

                    <div class="line">
                        Thay thế (1) vào (2) ta được:
                        <drop-zone :status="getDropStatus('4')" data-blank-id="4" @dropped="handleDrop('4', $event)"
                            :content="getBlankContent('4')" /> <span class="step-num">(4a)</span>
                    </div>

                    <div class="line hay-line">
                        Hay <drop-zone :status="getDropStatus('4b')" data-blank-id="4b" @dropped="handleDrop('4b', $event)"
                            :content="getBlankContent('4b')" /> <span class="step-num">(4b)</span>
                    </div>

                    <div class="line">
                        Suy ra <drop-zone :status="getDropStatus('5')" data-blank-id="5" @dropped="handleDrop('5', $event)"
                            :content="getBlankContent('5')" /> <span class="step-num">(5)</span>
                        nên <drop-zone :status="getDropStatus('6')" data-blank-id="6" @dropped="handleDrop('6', $event)"
                            :content="getBlankContent('6')" /> <span class="step-num">(6)</span>
                    </div>

                    <div class="line">
                        Do đó: <drop-zone :status="getDropStatus('7')" data-blank-id="7" @dropped="handleDrop('7', $event)"
                            :content="getBlankContent('7')" /> <span class="step-num">(7)</span>
                    </div>

                    <div class="line extra-padding">
                        nên theo trường hợp đồng dạng thứ nhất của tam giác thì:
                    </div>

                    <div class="line final-line">
                        <drop-zone :status="getDropStatus('8')" data-blank-id="8" @dropped="handleDrop('8', $event)"
                            :content="getBlankContent('8')" /> <span class="step-num">(8)</span>
                    </div>
                </div>

                <div class="footer-actions">
                    <button @click="closePopup" class="btn-primary">Đóng</button>
                </div>
            </section>
        </main>
    </div>
</template>
<script setup>
import DropZone from '../components/DropZone.vue';
import { defineComponent, h } from 'vue';
import katex from 'katex';

const emit = defineEmits(['close']);
const props = defineProps(['filledBlanks']);
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

const closePopup = () => {
    emit('close');
}

const getScoreStatus = () => {
    if (props.filledBlanks) {
        const val = getScore();
        if (val >= 7) return 'status-high';    // Xanh dương
        if (val >= 5) return 'status-medium';  // Cam
        return 'status-low';                  // Đỏ
    }
}

const getScore = () => {
    if (props.filledBlanks) {
        var details = JSON.parse(props.filledBlanks);
        var score = 0;
        Object.keys(details).forEach(blankId => {
            const answer = details[blankId];
            if (answer && answer.correctPos.includes(blankId.toString())) {
                score++;
            }
        });
        return score;
    }
}

// The function you asked for
const getBlankContent = (blankId) => {
    if (props.filledBlanks) {
        var details = JSON.parse(props.filledBlanks);
        if (details[blankId]) {
            return details[blankId].label;
        }
        return '....................................';
    }
    // This return value matches the visual style of your image
    return '....................................';
};

const getDropStatus = (blankId) => {
    if (props.filledBlanks) {
        var details = JSON.parse(props.filledBlanks);
        if (details[blankId]) {
            return details[blankId].correctPos.includes(blankId.toString()) ? 'correct' : 'incorrect';
        }
        return 'empty';
    }
    return 'empty';
};

const handleDrop = () => {

}
</script>
<style scoped>
.c-point{
    position: absolute;
    top: -25px;
    right: 50px;
}
.status-high {
  /* background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); */
  color: green; /* Blue */
}

.status-medium {
  /* background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); */
  color: #ea580c; /* Orange */
}

.status-low {
  /* background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); */
  color: #dc2626; /* Red */
}
.wrapper{
    position: fixed;
    top: 0;
    left: 0;
    background-color: #fff;
    height: 100vh;
    width: 100vw;
    padding: 50px;
}
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
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
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
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
    border-left: 5px solid #00b0f0;
    /* Notebook margin line */
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
</style>