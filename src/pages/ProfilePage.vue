<template>
  <q-page padding>
    <!-- پیام موفقیت یا خطا -->
    <q-banner v-if="successMessage" class="bg-green text-white q-mb-md">
      {{ successMessage }}
    </q-banner>
    <q-banner v-if="errorMessage" class="bg-red text-white q-mb-md">
      {{ errorMessage }}
    </q-banner>

    <q-card class="q-pa-md shadow-2 rounded-borders" style="max-width: 600px; margin: auto;">
      <q-card-section>
        <div class="text-h6 text-center">پروفایل کاربر</div>
      </q-card-section>

      <q-separator spaced />

      <q-card-section>
        <q-form @submit.prevent="updateProfile" class="q-gutter-md">
          <div class="row items-center q-gutter-md q-mt-md justify-around">
          <!-- فیلد ایمیل -->
          <q-input
            v-model="form.email"
            type="email"
            label="ایمیل"
            outlined
            dense
          />

          <!-- فیلد شماره همراه -->
          <q-input
            v-model="form.phone"
            type="text"
            label="شماره همراه"
            outlined
            dense
          />
          </div>
          <q-separator spaced />

          <!-- فیلد رمز عبور -->
          <q-input
            v-model="form.password"
            type="password"
            label="رمز عبور جدید"
            outlined
            dense
          />

          <!-- فیلد تکرار رمز عبور -->
          <q-input
            v-model="form.password_confirmation"
            type="password"
            label="تکرار رمز عبور"
            outlined
            dense
            :rules="[val => val === form.password || 'رمزها مطابقت ندارند']"
          />

          <q-separator spaced />

          <!-- آپلود تصویر -->
          <div class="text-subtitle1 q-mb-sm">تصویر پروفایل</div>
          <div class="row items-center q-gutter-md">
            <q-avatar size="100px">
              <img v-if="previewImage" :src="previewImage" alt="profile" />
              <q-icon v-else name="person" size="100px" />
            </q-avatar>

            <q-uploader
              label="انتخاب تصویر"
              accept="image/*"
              auto-upload="false"
              :factory="fakeUploadFactory"
              @added="onFileAdded"
              style="max-width: 250px;"
            />
          </div>

          <!-- دکمه ذخیره -->
          <div class="text-center q-mt-lg">
            <q-btn type="submit" color="primary" label="ذخیره تغییرات" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'

const user = JSON.parse(localStorage.getItem('user')) || {}
const form = ref({
  email: user.email || '',
  phone: user.phone || '',
  password: '',
  password_confirmation: '',
  profile_image: null
})

const previewImage = ref(user.profile_image || null)
const successMessage = ref('')
const errorMessage = ref('')

function onFileAdded(files) {
  if (files && files.length > 0) {
    form.value.profile_image = files[0]
    previewImage.value = URL.createObjectURL(files[0])
  }
}

function fakeUploadFactory() {
  return { url: '', method: 'POST' }
}

async function updateProfile() {
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('email', form.value.email)
    formData.append('phone', form.value.phone)

    if (form.value.password) {
      formData.append('password', form.value.password)
      formData.append('password_confirmation', form.value.password_confirmation)
    }

    if (form.value.profile_image) {
      formData.append('profile_image', form.value.profile_image)
    }

    const res = await api.post(`/api/users/${user.id}/update-profile`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    localStorage.setItem('user', JSON.stringify(res.data.user))
    previewImage.value = res.data.user.profile_image
    successMessage.value = 'تغییرات با موفقیت انجام شد'
  } catch (err) {
    console.error(err)
    errorMessage.value = 'بروزرسانی با مشکل مواجه شد'
  }
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>
