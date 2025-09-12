<template>
  <div class="q-pa-md">
    <q-input
      v-model="inputValue"
      label="یه مقدار وارد کن"
      outlined
      class="q-mb-md"
    />

    <q-btn label="ارسال به Laravel" color="primary" @click="sendToLaravel" />
    <q-btn label="تست خطای 404" color="negative" class="q-ml-md" @click="testError" />
    <q-btn label="گرفتن لیست کارها" color="secondary" class="q-ml-md" @click="getTasks" />

    <q-list bordered class="q-mt-md" v-if="tasks.length">
      <q-item v-for="task in tasks" :key="task.id">
        <q-item-section>{{ task.title }}</q-item-section>
      </q-item>
    </q-list>
    <div v-if="responseMessage" class="q-mt-md">
      پاسخ لاراول: {{ responseMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const inputValue = ref('')
const responseMessage = ref('')
const tasks = ref([])

const getTasks = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/tasks')
    tasks.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const sendToLaravel = async () => {
  try {
    const res = await axios.post('http://127.0.0.1:8000/api/echo', {
      name: inputValue.value
    })
    responseMessage.value = res.data.message
  } catch (error) {
    console.error(error)
  }
}

const testError = async () => {
  try {
    await axios.get('http://127.0.0.1:8000/api/not-found') // این روت وجود نداره
  } catch (error) {
    console.error("خطا دریافت شد:", error.response?.status, error.response?.data)
    responseMessage.value = `خطا: ${error.response?.status}`
  }
}

</script>
