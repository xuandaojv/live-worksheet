<template>
  <Transition name="fade">
    <div v-if="show" class="popup-overlay">
      <div class="popup-content">
        <div class="icon-circle">
          <span class="clock-icon">⏰</span>
        </div>
        
        <h2>Hết giờ mất rồi!</h2>
        <p>Thời gian làm bài tập của bạn đã kết thúc. Đừng lo lắng, hãy kiểm tra lại những gì bạn đã làm được nhé.</p>
        
        <div class="stats-summary" v-if="score !== null">
          Bạn đã hoàn thành: <strong style="font-weight: 700; color: green;">{{ score }}</strong> vị trí
        </div>

        <div class="actions">
          <!-- <button @click="$emit('retry')" class="btn-retry">Thử lại</button> -->
          <button @click="$emit('review')" class="btn-review">Đóng</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  score: [Number, String]
});

defineEmits(['retry', 'review']);
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 40px;
  border-radius: 24px;
  width: 90%;
  max-width: 450px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.icon-circle {
  width: 80px;
  height: 80px;
  background: #fff5f5;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;
  font-size: 40px;
  animation: shake 0.5s infinite;
}

h2 {
  color: #e53e3e;
  margin-bottom: 15px;
  font-size: 1.8rem;
}

p {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 25px;
}

.stats-summary {
  background: #f7fafc;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 25px;
  border: 1px solid #edf2f7;
}

.actions {
  display: flex;
  gap: 15px;
}

button {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-retry {
  background: #edf2f7;
  color: #4a5568;
}

.btn-review {
  background: #0070c0;
  color: white;
}

button:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

/* Animations */
@keyframes shake {
  0% { transform: rotate(0); }
  25% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
  100% { transform: rotate(0); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>