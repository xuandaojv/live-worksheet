<template>
  <v-container class="results-page" fluid>
    <v-row>
      <v-col cols="12" md="10" class="mx-auto">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="d-flex align-center py-4 px-6">
            <span class="text-h5 font-weight-bold">Kết quả bài làm</span>
            <v-spacer />
            <v-btn color="primary" variant="tonal" @click="load" :loading="loading" prepend-icon="mdi-refresh">Tải lại</v-btn>
            <v-btn color="error" variant="outlined" class="ml-2" @click="clearAll" prepend-icon="mdi-delete-sweep">Xóa tất cả</v-btn>
          </v-card-title>

          <v-card-text class="bg-grey-lighten-4 pa-6">
            <v-alert v-if="error" type="error" border="start" class="mb-4">Lỗi: {{ error }}</v-alert>

            <v-row>
              <v-col v-for="s in submissions" :key="s.id" cols="12" sm="6" md="4" lg="3">
                <v-card class="score-card" hover>
                  <v-card-title class="d-flex justify-space-between align-start pa-4">
                    <div class="student-name">{{ s.name }}</div>
                    <div class="time-stamp">{{ formatDate(s.createdAt) }}</div>
                  </v-card-title>

                  <v-card-text class="px-4">
                    <div :class="['score-box', getScoreStatus(s.score)]">
                      <!-- <span class="score-label">Kết quả</span> -->
                      <div class="score-value">
                        <span style="font-size: 100px;">{{ s.score !== undefined ? s.score : '9' }}</span><span class="separator">/10</span>
                      </div>
                    </div>
                  </v-card-text>

                  <v-card-actions class="pa-4">
                    <v-btn variant="text" size="small" @click="toggleDetails(s.id)" class="r-btn font-weight-bold">
                      Xem chi tiết
                    </v-btn>
                    <v-spacer />
                    <v-btn color="error" class="r-btn" variant="text" size="small" @click="remove(s.id)">Xóa</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <div v-if="!submissions.length && !loading" class="text-center py-10 grey--text">
              <v-icon size="64" color="grey-lighten-1">mdi-clipboard-text-off-outline</v-icon>
              <p class="mt-2">Chưa có bài nộp nào.</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <result-detail-popup 
      v-if="isDetailPopupVisible" 
      :filledBlanks="detailedSubmission" 
      @close="isDetailPopupVisible = false"></result-detail-popup>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import submissionService from '../services/submissionService'
import ResultDetailPopup from './ResultDetailPopup.vue';

// Giả định s.score là giá trị điểm (ví dụ 9)
const getScoreStatus = (score) => {
  const val = parseFloat(score) || 0;
  if (val >= 7) return 'status-high';    // Xanh dương
  if (val >= 5) return 'status-medium';  // Cam
  return 'status-low';                  // Đỏ
}

const isDetailPopupVisible = ref(false);
const detailedSubmission = ref(null);

// ... Các logic cũ giữ nguyên ...
const submissions = ref([])
const loading = ref(false)
const error = ref(null)

const load = async () => {
  loading.value = true
  error.value = null
  try {
    submissions.value = await submissionService.list()
  } catch (e) {
    error.value = e.message || String(e)
    submissions.value = []
  } finally {
    loading.value = false
  }
}

onMounted(load)

const remove = async (id) => {
  if (!confirm('Xóa kết quả này?')) return
  try {
    await submissionService.del(id)
    await load()
  } catch (e) {
    alert('Xóa thất bại')
  }
}

const clearAll = async () => {
  if (!confirm('Xóa tất cả kết quả?')) return
  try {
    await Promise.all(submissions.value.map(s => submissionService.del(s.id)))
    await load()
  } catch (e) {
    alert('Xóa tất cả thất bại')
  }
}

const toggleDetails = (id) => {
  // Logic toggle hiện tại của bạn
  detailedSubmission.value = submissions.value.find(s => s.id === id).details;
  isDetailPopupVisible.value = true;
}

const formatDate = (ts) => {
  try {
    const ms = (typeof ts === 'number' && ts < 1e12) ? ts * 1000 : ts
    const date = new Date(ms);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch (e) {
    return String(ts)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');

.results-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.score-card {
  border-radius: 16px !important;
  overflow: hidden;
  transition: all 0.3s ease;
  background-image: url('../assets/image/11.png');
  background-size: cover;
  position: relative;
}

.student-name {
  font-weight: 800;
  font-size: 1.1rem;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: #fff;
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 20px;
  border-radius: 10px;
}

.time-stamp {
  font-size: 0.85rem;
  color: #111;
  font-family: monospace;
  background-color: #fff;
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 20px;
  border-radius: 10px;
}

/* Base Score Box */
.score-box {
  height: 120px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 0.3s ease;
}

.score-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  opacity: 0.7;
  margin-bottom: -5px;
}

.score-value {
  font-family: 'Permanent Marker', cursive;
  font-size: 3.2rem;
  line-height: 1;
  filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.1));
}

.separator {
  font-size: 2rem;
  margin: 0 4px;
  opacity: 0.5;
}

/* Các trạng thái màu sắc */
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

.r-btn{
  background-color: #fff;
}

.score-card:hover {
  transform: scale(1.03);
}
</style>