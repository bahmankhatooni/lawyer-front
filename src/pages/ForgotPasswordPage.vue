<template>
  <div class="q-pa-md flex flex-center" style="height: 100vh;">
    <q-card class="q-pa-lg shadow-2" style="width: 400px; max-width: 90%">
      <!-- لوگو یا عنوان بالای فرم -->
      <div class="text-h6 text-center q-mb-md" style="font-family: Vazirmatn, serif;">
        بازیابی گذرواژه
      </div>

      <q-form @submit.prevent="submitForm" class="q-gutter-md">
        <!-- نام کاربری -->
        <q-input
          v-model="form.username"
          label="نام کاربری"
          outlined
          dense
          :rules="[val => !!val || 'نام کاربری الزامی است']"
        />

        <!-- ایمیل -->
        <q-input
          v-model="form.email"
          label="ایمیل"
          type="email"
          outlined
          dense
          :rules="[val => !!val || 'ایمیل الزامی است']"
        />

        <!-- دکمه ارسال -->
        <div class="row justify-center q-mt-md">
          <q-btn
            type="submit"
            label="ارسال رمز جدید"
            color="primary"
            class="full-width"
            :loading="loading"
          />
        </div>
      </q-form>

      <!-- پیام‌ها -->
      <div v-if="message" class="q-mt-md">
        <q-banner
          dense
          rounded
          :class="isError ? 'bg-red text-white' : 'bg-green text-white'"
        >
          {{ message }}
        </q-banner>
      </div>

      <!-- لینک بازگشت -->
      <div class="text-center q-mt-md">
        <q-btn flat color="primary" label="بازگشت به ورود" to="/login" />
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'

const form = ref({
  username: '',
  email: ''
})
const loading = ref(false)
const message = ref('')
const isError = ref(false)

async function submitForm () {
  loading.value = true
  message.value = ''

  try {
    const res = await api.post('/api/forgot-password', form.value)
    message.value = res.data.message
    isError.value = false
  } catch (err) {
    message.value = err.response?.data?.message || 'خطایی رخ داد'
    isError.value = true
  } finally {
    loading.value = false
  }
}
</script>
