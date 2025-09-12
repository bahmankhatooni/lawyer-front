<template>
  <q-page class="q-pa-md" dir="rtl">

    <!-- نمایش پیام موفقیت -->
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

    <!-- دکمه نمایش فرم -->
    <div class="q-pa-md">
      <q-btn color="primary" label="ثبت نام موکل جدید" @click="toggleForm" />
      <q-expansion-item
        v-model="showForm"
        expand-separator
        icon="person_add"
        switch-toggle-side
        dense
      >
        <q-card>
          <q-card-section>
            <q-form @submit.prevent="editMode ? updateClient() : storeClient()">
              <div class="q-gutter-md">

                <!-- ردیف اول فرم -->
                <div class="row items-center q-gutter-md">
                  <q-input
                    v-model="form.fname"
                    label="نام"
                    :rules="[(val) => !!val || 'نام الزامی است']"
                    outlined
                    dense
                    ref="firstField"
                  />
                  <q-input
                    v-model="form.lname"
                    label="نام خانوادگی"
                    :rules="[(val) => !!val || 'نام خانوادگی الزامی است']"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="form.national_code"
                    label="کد ملی"
                    mask="##########"
                    :rules="[val => !val || /^[0-9]{10}$/.test(val) || 'کد ملی باید ۱۰ رقم باشد']"
                    outlined
                    dense
                  />
                </div>

                <!-- ردیف دوم فرم -->
                <div class="row items-center q-gutter-md">
                  <q-input
                    v-model="form.phone"
                    label="تلفن"
                    mask="###########"
                    :rules="[val => !val || /^09[0-9]{9}$/.test(val) || 'شماره موبایل باید ۱۱ رقم و با 09 شروع شود']"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="form.email"
                    label="ایمیل"
                    :rules="[val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'ایمیل معتبر وارد کنید']"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="form.address"
                    label="آدرس"
                    :rules="(val) => val.length <= 100 || 'آدرس نباید بیشتر از ۱۰۰ کاراکتر باشد'"
                    outlined
                    dense
                  />
                </div>

              </div>

              <!-- دکمه‌های فرم -->
              <div class="q-mt-md">
                <q-btn
                  :label="editMode ? 'ویرایش' : 'ذخیره'"
                  :color="editMode ? 'secondary' : 'primary'"
                  type="submit"
                />
                <q-btn label="انصراف" flat @click="cancelForm" />
              </div>

            </q-form>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>

    <!-- جدول مشتریان -->
    <q-card>
      <q-table :rows="clients" :columns="columns" row-key="id" flat bordered>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn
              color="primary"
              icon="edit"
              size="sm"
              round
              dense
              @click="editClient(props.row)"
              class="q-mx-xs"
            />
            <q-btn
              color="negative"
              icon="delete"
              size="sm"
              round
              dense
              @click="confirmDeleteClient(props.row)"
              class="q-mx-xs"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- دیالوگ تأیید حذف -->
    <q-dialog v-model="deleteDialog">
      <q-card class="q-pa-md" style="min-width: 350px; border-radius: 12px; font-family: Vazirmatn, serif;">

        <!-- متن دیالوگ -->
        <q-card-section class="text-center">
          <div class="text-h6 q-mb-md" style="color: #1976d2;">
            آیا مطمئن هستید که می‌خواهید این رکورد را حذف کنید؟
          </div>
        </q-card-section>

        <!-- دکمه‌ها در یک ردیف افقی کنار هم با رنگ‌های دلخواه -->
        <div class="row justify-around q-gutter-sm q-mt-sm">
          <!-- دکمه لغو سمت راست -->
          <q-btn  label="لغو" color="green" v-close-popup />
          <!-- دکمه حذف سمت چپ -->
          <q-btn  label="حذف" color="red" @click="performDeleteClient"/>
        </div>

      </q-card>
    </q-dialog>



  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";


// کنترل نمایش فرم
const showForm = ref(false)

// پیام موفقیت
const successMessage = ref('')

// لیست مشتریان
const clients = ref([])

// فرم ثبت و ویرایش
const form = ref({
  fname: '', lname: '', national_code: '', phone: '', address: '', email: ''
})

// ستون‌های جدول
const columns = [
  { name: 'fname', label: 'نام', field: 'fname', align: "center" },
  { name: 'lname', label: 'نام خانوادگی', field: 'lname' },
  { name: 'national_code', label: 'کد ملی', field: 'national_code' },
  { name: 'phone', label: 'تلفن', field: 'phone' },
  { name: 'address', label: 'آدرس', field: 'address'},
  { name: 'email', label: 'ایمیل', field: 'email'},
  { name: "actions", label: "عملیات", field: "actions", style: "width:100px" },
]

// حالت ویرایش یا ثبت
const editMode = ref(false)
const selectedClientId = ref(null)

// دیالوگ حذف
const deleteDialog = ref(false)
const clientToDelete = ref(null)

// نمایش/پنهان کردن فرم
function toggleForm() {
  showForm.value = !showForm.value
}

// پاک کردن فرم و خروج از حالت ویرایش
function cancelForm() {
  form.value = { fname: '', lname: '', national_code: '', phone: '', address: '', email: '' }
  showForm.value = false
  editMode.value = false
  selectedClientId.value = null
}

// گرفتن لیست مشتریان از سرور
const fetchClients = async () => {
  try {
    const res = await axios.get("/api/clients")
    clients.value = res.data
  } catch(err) {
    console.log("خطا در دریافت لیست مشتریان:", err)
  }
}

// ذخیره مشتری جدید
const storeClient = async () => {
  try {
    const res = await axios.post('/api/store-client', form.value)
    successMessage.value = res.data.message
    cancelForm()
    fetchClients()
  } catch (err) {
    console.log(err.response?.data?.errors || 'خطا در ثبت')
  }
}

// ویرایش رکورد موجود
const editClient = (client) => {
  form.value = { ...client } // پر کردن فرم با داده رکورد
  selectedClientId.value = client.id
  editMode.value = true
  showForm.value = true
}

// آپدیت رکورد
const updateClient = async () => {
  try {
    const res = await axios.put(`/api/update-client/${selectedClientId.value}`, form.value)
    successMessage.value = res.data.message
    cancelForm()
    fetchClients()
  } catch(err) {
    console.log(err.response?.data?.errors || 'خطا در بروزرسانی')
  }
}

// باز کردن دیالوگ حذف
function confirmDeleteClient(client) {
  clientToDelete.value = client.id
  deleteDialog.value = true
}

// حذف رکورد بعد از تأیید
const performDeleteClient = async () => {
  try {
    await axios.delete(`/api/delete-client/${clientToDelete.value}`)
    fetchClients()  // بروزرسانی جدول
  } catch(err) {
    console.log("خطا در حذف:", err)
  }
  deleteDialog.value = false
  clientToDelete.value = null
}

// بارگذاری اولیه داده‌ها
onMounted(fetchClients)
</script>

<style>
.q-expansion-item__content > .q-card {
  border-radius: 10px;
  font-family: Vazirmatn, serif;
  display: inline-block;
}
.q-pa-md {
  border-radius: 10px;
  font-family: Vazirmatn, serif;
  text-align: center;
  background-color: rgb(187, 222, 251);
}
.q-table th {
  font-family: Vazirmatn, serif;
  font-size: larger;
  text-align: center;
  background: #bbdefb57;
}
.q-table tbody td {
  font-family: Vazirmatn, serif;
  text-align: center;
}
.q-table__container > div:last-child {
  direction: ltr;
  font-family: Vazirmatn, serif;
  background: #bbdefb57;
}
.q-field--outlined .q-field__control {
  width: 230px;
}
.q-card {
  border: solid;
  border-color: #1976d2;
  font-family: Vazirmatn, serif;
}
.q-item__section--side > .q-icon {
  color: #1976d2;
}
</style>
