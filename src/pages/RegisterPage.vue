<template>
  <q-page class="flex flex-center q-pa-md bg-blue-2" style="height: 100vh; background: #f5f5f5;" dir="rtl">
    <q-card class="q-pa-lg" style="width: 450px; max-width: 95vw;">
      <q-card-section>
        <!-- QBanner برای پیام موفقیت -->
        <q-banner
          v-if="successMessage"
          class="bg-positive text-white q-mb-md"
          dense
          rounded
          inline-actions
        >
          {{ successMessage }}
          <template v-slot:action>
            <q-btn flat icon="close" @click="successMessage = ''" />
          </template>
        </q-banner>
      </q-card-section>
      <q-card-section>
        <div class="text-h6 text-center q-mb-md" style="color: forestgreen">فرم ثبت‌ نام</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="formRef">

          <!-- دو ستون برای نام و نام خانوادگی -->
          <div class="row q-gutter-md row-reverse">
            <div class="col">
              <q-input
                v-model="fname"
                label="نام"
                outlined dense
                :rules="[val => !!val || 'نام الزامی است']"
              >
              </q-input>
            </div>

            <div class="col">
              <q-input
                v-model="lname"
                label="نام خانوادگی"
                outlined dense
                :rules="[val => !!val || 'نام خانوادگی الزامی است']"
              >
              </q-input>
            </div>
          </div>

          <!-- دو ستون برای کد ملی و موبایل -->
          <div class="row q-gutter-md q-mt-md row-reverse">
            <div class="col">
              <q-input
                v-model="nationalcode"
                label="کد ملی"
                outlined dense
                :rules="[val => /^\d{10}$/.test(val) || 'کد ملی باید 10 رقم باشد']"
              >
              </q-input>
            </div>

            <div class="col">
              <q-input
                v-model="mobile"
                label="موبایل"
                outlined dense
                :rules="[val => /^09\d{9}$/.test(val) || 'شماره موبایل نامعتبر است']"
              >
              </q-input>
            </div>
          </div>

          <!-- فیلد آدرس -->
          <q-input
            v-model="address"
            label="آدرس"
            type="textarea"
            outlined dense
            class="q-mt-md"

          >
          </q-input>

          <!-- دکمه ثبت‌نام سمت راست -->
          <div class="row justify-end q-mt-md">
            <q-btn label="ثبت‌نام"  type="submit" class="q-mr-sm" style="background: forestgreen; color: white" />
          </div>

        </q-form>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const fname = ref('')
const lname = ref('')
const nationalcode = ref('')
const mobile = ref('')
const address = ref('')
const successMessage = ref('')
const formRef = ref(null)
const router = useRouter()

function submitForm() {
  // اعتبارسنجی فرم
  formRef.value.validate().then((valid) => {
    if (!valid) return

    // نمایش اطلاعات ثبت‌نام
    console.log({
      fname: fname.value,
      lname: lname.value,
      nationalcode: nationalcode.value,
      mobile: mobile.value,
      address: address.value
    })

    // نمایش پیام موفقیت‌آمیز با QBanner

    successMessage.value = 'ثبت‌ نام با موفقیت انجام شد'

    // ریست فرم
    fname.value = ''
    lname.value = ''
    nationalcode.value = ''
    mobile.value = ''
    address.value = ''
    // بعد از 2 ثانیه ریدایرکت به داشبورد
    setTimeout(() => {
      successMessage.value = ''
      router.push('/register')
    }, 2000)
  })
}
</script>
<style>
.q-mt-md{
  font-family: Vazirmatn,serif;
}
.bg-positive{
  font-family: Vazirmatn,serif;
}
.q-field--outlined .q-field__control{
  width: auto;
}
</style>
