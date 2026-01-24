<template>
  <v-container class="results-page" fluid>
    <v-row>
      <v-col cols="12" md="8" class="mx-auto">
        <v-card>
          <v-card-title>
            <span class="text-h6">Kết quả bài làm</span>
            <v-spacer />
            <v-btn color="primary" variant="tonal" @click="load" :loading="loading">Tải lại</v-btn>
            <v-btn color="error" variant="outlined" class="ml-2" @click="clearAll">Xóa tất cả</v-btn>
          </v-card-title>

          <v-card-text>
            <v-alert v-if="error" type="error" border="start">Lỗi: {{ error }}</v-alert>

            <v-expansion-panels>
              <v-expansion-panel v-for="s in submissions" :key="s.id">
                <v-expansion-panel-title>
                  <div style="display:flex;justify-content:space-between;width:100%;">
                    <div style="font-weight: 600;">{{ s.name }}: {{ s.score }}/9</div>
                    <div class="grey--text">{{ formatDate(s.createdAt) }}</div>
                  </div>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <div v-if="parsedDetails(s)">
                    <v-list dense>
                      <v-list-item v-for="(val, key) in parsedDetails(s)" :key="key">
                        <v-list-item-content>
                          <v-list-item-title>{{ key }}</v-list-item-title>
                          <v-list-item-subtitle>
                            <template v-if="val">
                              <MathText v-if="typeof val === 'string'" :text="val" />
                              <MathText v-else-if="val.label" :text="val.label" />
                              <span v-else>{{ JSON.stringify(val) }}</span>
                            </template>
                            <span v-else class="grey--text">(empty)</span>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </div>
                  <div v-else class="grey--text">No structured details available: {{ s.details }}</div>

                  <div class="mt-3">
                    <v-btn color="error" variant="outlined" @click="remove(s.id)">Xóa</v-btn>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <div v-if="!submissions.length && !loading" class="text-center grey--text">Chưa có bài nộp nào.</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import submissionService from '../services/submissionService'
import katex from 'katex'
import { defineComponent, h } from 'vue'

const MathText = defineComponent({
  props: ['text'],
  setup(props) {
    return () => {
      if (!props.text) return h('span', props.text)
      try {
        const html = katex.renderToString(props.text, { throwOnError: false })
        return h('span', { innerHTML: html })
      } catch (e) {
        return h('span', props.text)
      }
    }
  }
})

const submissions = ref([])
const loading = ref(false)
const error = ref(null)

const load = async () => {
  loading.value = true
  error.value = null
  try {
    // mockapi returns an array of objects
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
    console.warn(e)
    alert('Xóa thất bại')
  }
}

const clearAll = async () => {
  if (!confirm('Xóa tất cả kết quả?')) return
  try {
    await Promise.all(submissions.value.map(s => submissionService.del(s.id)))
    await load()
  } catch (e) {
    console.warn(e)
    alert('Xóa tất cả thất bại')
  }
}

const parsedDetails = (s) => {
  if (!s || !s.details) return null
  try {
    return typeof s.details === 'string' ? JSON.parse(s.details) : s.details
  } catch (e) {
    return null
  }
}

const formatDate = (ts) => {
  try {
    // model uses seconds for createdAt
    const ms = (typeof ts === 'number' && ts < 1e12) ? ts * 1000 : ts
    return new Date(ms).toLocaleString()
  } catch (e) {
    return String(ts)
  }
}
</script>

<style scoped>
.results-page { padding: 20px; }
.submissions-list { list-style: none; padding: 0; }
.submissions-list li { padding: 12px 0; border-bottom: 1px solid #eee; }
.actions { margin-top: 12px; display:flex; gap:8px }
.actions-inline { margin-top:8px; display:flex; gap:8px }
.meta { color:#666; font-size:0.9rem; margin-top:6px }
.error { color: #c00 }
</style>
