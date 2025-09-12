<template>
  <div class="q-pa-md flex flex-center " style="height: 100vh; " >
    <q-card class="q-pa-lg" style="width: 350px">
      <q-card-section>
        <div class="text-h6">ورود به سامانه</div>
      </q-card-section>
      <!-- پیام خطا -->
      <q-banner style="border-radius: 10px; text-align: center"
        v-if="errorMessage"
        class="bg-red text-white q-mb-md"
        rounded
        dense
      >
        {{ errorMessage }}
      </q-banner>
      <q-card-section>
        <q-input v-model="username" label="نام کاربری" outlined dense />
        <q-input v-model="password" type="password" label="کلمه عبور" outlined dense class="q-mt-md" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="ورود" @click="login" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')

const login = async () => {
  errorMessage.value = '' // پاک کردن خطا قبل از لاگین

  try {
    const res = await api.post('/api/login', {
      username: username.value,
      password: password.value
    })

    localStorage.setItem('user', JSON.stringify(res.data.user))
    localStorage.setItem('token', res.data.token)

    router.push('/dashboard')
  } catch (err) {
    if (err.response && err.response.data) {
      // پیام خطای لاراول
      if (err.response.data.errors) {
        // ولیدیشن خطا
        const firstError = Object.values(err.response.data.errors)[0][0]
        errorMessage.value = firstError
      } else if (err.response.data.message) {
        errorMessage.value = err.response.data.message
      }
    } else {
      errorMessage.value = 'خطا در ارتباط با سرور'
    }
  }
}
</script>
<style>
.q-pa-md{
  background: linear-gradient(135deg, #cbe9ff 0%, #e6f2ff 100%);
}
.q-card{
  border: solid;
  border-color: #1976d2;
  font-family: Vazirmatn,serif;
}
.text-h6{
  font-family: Vazirmatn,serif;
  text-align: center;
}
.q-btn, .q-input{
  font-family: Vazirmatn,serif;
}
.bg-blue-2{
background: linear-gradient(359deg, #1976d2, #f0f8ff);
}
.q-card__actions .q-btn--rectangle{
  padding: 0 127px;
}
.q-field--dense .q-field__control, .q-field--dense .q-field__marginal{
  direction: rtl;
}
</style>
