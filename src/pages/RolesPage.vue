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
      <q-btn color="primary" label="ایجاد نقش جدید" @click="toggleForm" />
      <q-expansion-item
        v-model="showForm"
        expand-separator
        icon="add_box"
        switch-toggle-side
        dense
      >
        <q-card style="width: 400px; background-color: #ffffff">
          <q-card-section>
            <q-form @submit.prevent="editMode ? updateRole() : storeRole()">
              <div class="q-gutter-md" style="justify-items: center">
                <q-input
                  v-model="form.name"
                  label="نام نقش"
                  :rules="[(val) => !!val || 'نام نقش الزامی است']"
                  outlined
                  dense
                  ref="firstField"
                />
              </div>

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

    <!-- جدول نقش‌ها -->
    <q-card>
      <q-table :rows="roles" :columns="columns" row-key="id" flat bordered>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn
              color="primary"
              icon="edit"
              size="sm"
              round
              dense
              @click="editRole(props.row)"
              class="q-mx-xs"
            />
            <q-btn
              color="negative"
              icon="delete"
              size="sm"
              round
              dense
              @click="confirmDeleteRole(props.row)"
              class="q-mx-xs"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- دیالوگ تأیید حذف -->
    <q-dialog v-model="deleteDialog">
      <q-card class="q-pa-md" style="min-width: 350px; border-radius: 12px; font-family: Vazirmatn, serif;">
        <q-card-section class="text-center">
          <div class="text-h6 q-mb-md" style="color: #1976d2;">
            آیا مطمئن هستید که می‌خواهید این نقش را حذف کنید؟
          </div>
        </q-card-section>

        <div class="row justify-around q-gutter-sm q-mt-sm">
          <q-btn  label="لغو" color="green" v-close-popup />
          <q-btn  label="حذف" color="red" @click="performDeleteRole"/>
        </div>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const showForm = ref(false)
const successMessage = ref('')
const roles = ref([])

const form = ref({ name: '' })
const editMode = ref(false)
const selectedRoleId = ref(null)

const deleteDialog = ref(false)
const roleToDelete = ref(null)

const columns = [
  { name: 'id', label: 'شناسه', field: 'id', align: "center" },
  { name: 'name', label: 'نام نقش', field: 'name' },
  { name: "actions", label: "عملیات", field: "actions", style: "width:100px" },
]

function toggleForm() {
  showForm.value = !showForm.value
}

function cancelForm() {
  form.value = { name: '' }
  showForm.value = false
  editMode.value = false
  selectedRoleId.value = null
}

// دریافت لیست نقش‌ها
const fetchRoles = async () => {
  try {
    const res = await axios.get("/api/roles")
    roles.value = res.data
  } catch(err) {
    console.log("خطا در دریافت نقش‌ها:", err)
  }
}

// ذخیره نقش جدید
const storeRole = async () => {
  try {
    const res = await axios.post('/api/roles', form.value)
    successMessage.value = res.data.message
    cancelForm()
    fetchRoles()
  } catch (err) {
    console.log(err.response?.data?.errors || 'خطا در ثبت نقش')
  }
}

// ویرایش نقش
const editRole = (role) => {
  form.value = { ...role }
  selectedRoleId.value = role.id
  editMode.value = true
  showForm.value = true
}

// بروزرسانی نقش
const updateRole = async () => {
  try {
    const res = await axios.put(`/api/roles/${selectedRoleId.value}`, form.value)
    successMessage.value = res.data.message
    cancelForm()
    fetchRoles()
  } catch(err) {
    console.log(err.response?.data?.errors || 'خطا در بروزرسانی نقش')
  }
}

// تأیید حذف
function confirmDeleteRole(role) {
  roleToDelete.value = role.id
  deleteDialog.value = true
}

// حذف نقش
const performDeleteRole = async () => {
  try {
    await axios.delete(`/api/roles/${roleToDelete.value}`)
    fetchRoles()
  } catch(err) {
    console.log("خطا در حذف نقش:", err)
  }
  deleteDialog.value = false
  roleToDelete.value = null
}

// بارگذاری اولیه
onMounted(fetchRoles)
</script>

<style scoped>
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
  width: 250px;
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
