<template>
  <q-page class="q-pa-md" dir="rtl">
    <!-- نمایش پیام موفقیت -->
    <q-banner
      v-if="Message"
      :class="messageClass"

      dense
      rounded
      inline-actions
    >
      {{ Message }}
      <template v-slot:action>
        <q-btn flat icon="close" @click="Message = ''" />
      </template>
    </q-banner>

    <!-- دکمه نمایش فرم -->
    <div class="q-pa-md">
      <q-btn color="primary" label="ثبت کاربر جدید" @click="toggleForm" />
      <q-expansion-item
        v-model="showForm"
        expand-separator
        icon="person_add"
        switch-toggle-side
        dense
      >
        <q-card>
          <q-card-section>
            <q-form @submit.prevent="editMode ? updateUser() : storeUser()">
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
                    v-model="form.username"
                    label="نام کاربری"
                    :rules="[(val) => !!val || 'نام کاربری الزامی است']"
                    outlined
                    dense
                  />
                </div>

                <!-- ردیف دوم فرم -->
                <div class="row items-center q-gutter-md q-mt-md">
                  <div class="col">
                    <q-select
                      v-model.number="form.role_id"
                      :options="roles"
                      option-label="label"
                      option-value="value"
                      emit-value
                      map-options
                      outlined
                      dense
                      label="نقش"
                    />
                  </div>
                  <div class="col">
                    <q-input v-model="form.password" label="پسورد" type="password" outlined dense />
                  </div>
                  <div class="col">
                    <q-input
                      v-model="form.email"
                      label="ایمیل"
                      :rules="[
                        (val) =>
                          !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'ایمیل معتبر وارد کنید',
                      ]"
                      outlined
                      dense
                      style="margin-top: 16px"
                    />
                  </div>
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

    <!-- جدول کاربران -->
    <q-card>
      <q-table :rows="users" :columns="columns" row-key="id" flat bordered>
        <template v-slot:body-cell-role_id="props">
          <q-td :props="props">
            {{ getRoleLabel(props.row.role_id) }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn
              color="primary"
              icon="edit"
              size="sm"
              round
              dense
              @click="editUser(props.row)"
              class="q-mx-xs"
            />
            <q-btn
              color="negative"
              icon="delete"
              size="sm"
              round
              dense
              @click="confirmDeleteUser(props.row)"
              class="q-mx-xs"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- دیالوگ تأیید حذف -->
    <q-dialog v-model="deleteDialog">
      <q-card
        class="q-pa-md"
        style="min-width: 350px; border-radius: 12px; font-family: Vazirmatn, serif"
      >
        <q-card-section class="text-center">
          <div class="text-h6 q-mb-md" style="color: #1976d2">
            آیا مطمئن هستید که این رکورد را حذف کنید؟
          </div>
        </q-card-section>

        <div class="row justify-around q-gutter-sm q-mt-sm">
          <q-btn label="لغو" color="green" v-close-popup />
          <q-btn label="حذف" color="red" @click="performDeleteUser" />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// فرم و وضعیت‌ها
const showForm = ref(false)
const Message = ref('')
const editMode = ref(false)
const selectedUserId = ref(null)
const deleteDialog = ref(false)
const userToDelete = ref(null)
const messageClass = ref('bg-positive text-white')
// نقش‌ها
const roles = [
  { label: 'مدیر سیستم', value: 1 },
  { label: 'رئیس مرکز', value: 2 },
  { label: 'وکیل', value: 3 },
]
// فرم
const form = ref({
  fname: '',
  lname: '',
  username: '',
  email: '',
  password: '',
  role_id: 1,
})

const selectedRoleLabel = ref('مدیر سیستم')

// const updateRoleLabel = (id) => {
//   const role = roles.find(r => r.value === id);
//   selectedRoleLabel.value = role ? role.label : '';
// };

// جدول
const users = ref([])
const columns = [
  { name: 'fname', label: 'نام', field: 'fname', align: 'center' },
  { name: 'lname', label: 'نام خانوادگی', field: 'lname' },
  { name: 'username', label: 'نام کاربری', field: 'username' },
  { name: 'email', label: 'ایمیل', field: 'email' },
  { name: 'role_id', label: 'نقش', field: 'role_id' },
  { name: 'actions', label: 'عملیات', field: 'actions', style: 'width:100px' },
]

// نمایش متن نقش
const getRoleLabel = (id) => {
  const role = roles.find((r) => r.value === id)
  return role ? role.label : ''
}

// نمایش/پنهان کردن فرم
function toggleForm() {
  showForm.value = !showForm.value
}

// پاک کردن فرم و خروج از ویرایش
function cancelForm() {
  form.value = { fname: '', lname: '', username: '', email: '', password: '', role_id: 1 }
  selectedUserId.value = null
  editMode.value = false
  showForm.value = false
  selectedRoleLabel.value = 'مدیر سیستم'
}

// گرفتن لیست کاربران
const fetchUsers = async () => {
  try {
    const res = await axios.get('/api/users')
    users.value = res.data
  } catch (err) {
    console.log(err)
  }
}

// ذخیره کاربر جدید
const storeUser = async () => {
  try {
    const res = await axios.post('/api/store-user', form.value)
    Message.value = res.data.message
    cancelForm()
    fetchUsers()
  } catch (err) {
    if (err.response && err.response.status === 422) {
      const errors = err.response.data.errors
      Message.value = Object.values(errors).flat().join('\n')
      messageClass.value = 'bg-negative text-white'
    } else if (err.response && err.response.status === 500) {
      Message.value = 'خطا در سرور، اطلاعات بررسی شود'
      messageClass.value = 'bg-negative text-white'
      console.log(err.response.data)
    } else console.log(err)
  }
}

// ویرایش کاربر
const editUser = (user) => {
  form.value = {
    fname: user.fname,
    lname: user.lname,
    username: user.username,
    email: user.email,
    password: '',
    role_id: Number(user.role_id), // چون v-model.number داریم، حتما عدد میشه
  }
  selectedUserId.value = user.id
  editMode.value = true
  showForm.value = true
}

// بروزرسانی کاربر
const updateUser = async () => {
  try {
    const res = await axios.put(`/api/update-user/${selectedUserId.value}`, form.value)
    Message.value = res.data.message
    cancelForm()
    fetchUsers()
  } catch(err) {
    if(err.response && err.response.status === 422){
      const errors = err.response.data.errors
      let message
      message.value = Object.values(errors).flat().join('\n')
      messageClass.value = 'bg-success text-white'
    } else if(err.response && err.response.status === 500){
      let message
      message.value = 'خطا در سرور، اطلاعات بررسی شود'
      messageClass.value = 'bg-success text-white'
      console.log(err.response.data)
    } else console.log(err)
  }
}

// حذف
const confirmDeleteUser = (user) => {
  userToDelete.value = user.id
  deleteDialog.value = true
}

const performDeleteUser = async () => {
  try {
    await axios.delete(`/api/delete-user/${userToDelete.value}`)
    fetchUsers()
  } catch (err) {
    console.log(err)
  }
  deleteDialog.value = false
  userToDelete.value = null
}
// بعد از ۳ ثانیه پاک بشه
setTimeout(() => {
  Message.value = ''
}, 3000)
// بارگذاری اولیه
onMounted(fetchUsers)
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
