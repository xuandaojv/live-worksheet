<template>
  <div class="music-player-card" :class="{ 'is-playing': isPlaying }">
    <div class="player-info">
      <div class="disc" :class="{ 'rotate': isPlaying }">
        <span class="music-icon">🎵</span>
      </div>
      <div class="track-details">
        <span class="track-name">Sound track</span>
        <span class="status-text">{{ isPlaying ? 'Đang phát...' : 'Đang tạm dừng' }}</span>
      </div>
    </div>

    <div class="controls">
      <button @click="togglePlay" class="control-btn play-btn">
        <span v-if="!isPlaying">▶️</span>
        <span v-else>⏸️</span>
      </button>

      <div class="volume-container">
        <span class="volume-icon">🔈</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1" 
          v-model="volume" 
          @input="updateVolume"
          class="volume-slider"
        />
      </div>
    </div>

    <audio 
      ref="audioRef" 
      loop
      @play="isPlaying = true"
      @pause="isPlaying = false"
    >
      <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" type="audio/mpeg">
    </audio>
    <div v-if="!isStarted" class="start-overlay">
      <div class="start-content">
        <button style="padding: 20px 40px; background-color: #0370bc; color: #fff; font-weight: 700; border: solid 2px #fff; cursor: pointer; outline: none; border-radius: 8px;" class="start-button" @click="handleStart">Bắt đầu làm bài</button>
      </div>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['start']);
const isPlaying = ref(false);
const isStarted = ref(false);
const volume = ref(0.5);
const audioRef = ref(null);

const togglePlay = () => {
  if (isPlaying.value) {
    audioRef.value.pause();
  } else {
    audioRef.value.play();
  }
};

const handleStart = () => {
  isStarted.value = true;
  audioRef.value.play();
    emit('start');
};

const updateVolume = () => {
  audioRef.value.volume = volume.value;
};

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value;
  }
});
</script>

<style scoped>
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
.start-content{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: pulse 1s infinite;
}
.start-overlay{
    position: fixed;
    top: 0;
    left: 0;
    background-color: #11111190;
    backdrop-filter: blur(5px);
    height: 100%;
    width: 100%;
    z-index: 10;
}
.music-player-card {
  background: white;
  border-radius: 50px;
  padding: 10px 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 10px 25px rgba(0, 112, 192, 0.1);
  border: 1px solid #e2e8f0;
  width: fit-content;
  transition: all 0.3s ease;
}

.music-player-card.is-playing {
  border-color: #00b0f0;
  box-shadow: 0 10px 25px rgba(0, 176, 240, 0.2);
}

.player-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.disc {
  width: 40px;
  height: 40px;
  background: #f0f4f8;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  border: 2px solid #cbd5e0;
}

.disc.rotate {
  animation: spin 3s linear infinite;
  border-color: #00b0f0;
}

.track-details {
  display: flex;
  flex-direction: column;
}

.track-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #2d3748;
}

.status-text {
  font-size: 0.7rem;
  color: #a0aec0;
}

.controls {
  display: flex;
  align-items: center;
  gap: 15px;
  border-left: 1px solid #edf2f7;
  padding-left: 15px;
}

.control-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.control-btn:hover {
  transform: scale(1.1);
}

.volume-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-slider {
  width: 60px;
  cursor: pointer;
  accent-color: #00b0f0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>