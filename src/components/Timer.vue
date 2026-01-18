<template>
  <div class="timer-display" :class="{ 'warning': timeLeft < 60, 'danger': timeLeft === 0 }">
    <div class="timer-icon">⏱️</div>
    <div class="time-numbers">
      {{ formattedTime }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  time: {
    type: Number,
    required: true,
    default: 0
  }
});

const emit = defineEmits(['time-up']);

// Trạng thái thời gian còn lại (giây)
const timeLeft = ref(props.time);
let timerInterval = null;

// Chuyển đổi giây thành định dạng HH:MM:SS
const formattedTime = computed(() => {
  const hours = Math.floor(timeLeft.value / 3600);
  const minutes = Math.floor((timeLeft.value % 3600) / 60);
  const seconds = timeLeft.value % 60;

  return [hours, minutes, seconds]
    .map(v => v < 10 ? "0" + v : v)
    .filter((v, i) => v !== "00" || i > 0) // Giữ lại phút giây, chỉ hiện giờ nếu > 0
    .join(":");
});

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timerInterval);
      emit('time-up'); // Thông báo khi hết giờ
    }
  }, 1000);
};

// Theo dõi nếu prop time thay đổi từ bên ngoài (ví dụ khi reset bài tập)
watch(() => props.time, (newVal) => {
  timeLeft.value = newVal;
  startTimer();
});

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.timer-display {
  display: inline-flex;
  align-items: center;
  background: #ffffff;
  padding: 8px 20px;
  border-radius: 50px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  font-size: 1.5rem;
  color: #2d3748;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.timer-icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

/* Hiệu ứng khi còn dưới 1 phút */
.timer-display.warning {
  color: #d97706;
  border-color: #fbbf24;
  animation: pulse 1s infinite;
}

/* Hiệu ứng khi hết giờ */
.timer-display.danger {
  color: #dc2626;
  border-color: #f87171;
  animation: none;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>