<template>
  <q-page class="q-pa-md" dir="rtl">
    <!-- پیام موفقیت/خطا -->
    <q-banner v-if="Message" :class="messageClass" dense rounded inline-actions>
      {{ Message }}
      <template v-slot:action>
        <q-btn flat icon="close" @click="Message = ''" />
      </template>
    </q-banner>

    <!-- دکمه نمایش فرم -->
    <div class="q-pa-md">
      <q-btn color="primary" label="ثبت پرونده جدید" @click="toggleForm" />
      <q-expansion-item v-model="showForm" expand-separator icon="folder+" switch-toggle-side dense>
        <q-card>
          <q-card-section>
            <q-form @submit.prevent="editMode ? updateFile() : storeFile()">
              <div class="q-gutter-md">

                <!-- ردیف اول: عنوان، وضعیت، موکل -->
                <div class="row items-center q-gutter-md">
                  <div class="col">
                    <q-input
                      v-model="form.title"
                      label="عنوان پرونده"
                      :rules="[val => !!val || 'عنوان پرونده الزامی است']"
                      outlined dense
                      style="margin-top: 20px"
                    />
                  </div>

                  <div class="col">
                    <q-select
                      v-model="form.status"
                      :options="statuses"
                      option-label="label"
                      option-value="value"
                      emit-value map-options
                      outlined dense
                      label="وضعیت پرونده"
                    />
                  </div>

                  <div class="col">
                    <q-select
                      v-model="form.client_id"
                      :options="clients"
                      option-label="full_name"
                      option-value="id"
                      emit-value map-options
                      outlined dense
                      label="موکل"
                    />
                  </div>
                </div>

                <!-- ردیف دوم: توضیحات -->
                <div class="row q-mt-md">
                  <div class="col">
                    <q-input
                      v-model="form.description"
                      label="توضیحات"
                      type="textarea"
                      autogrow
                      outlined dense
                    />
                  </div>
                </div>

              </div>

              <!-- دکمه‌ها -->
              <div class="q-mt-md">
                <q-btn :label="editMode ? 'ویرایش' : 'ذخیره'" :color="editMode ? 'secondary' : 'primary'" type="submit"/>
                <q-btn label="انصراف" flat @click="cancelForm" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>

    <!-- جدول پرونده‌ها -->
    <q-card>
      <q-table :rows="files" :columns="columns" row-key="id" flat bordered>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">{{ getStatusLabel(props.row.status) }}</q-td>
        </template>

        <template v-slot:body-cell-client_id="props">
          <q-td :props="props">{{ getClientName(props.row.client_id) }}</q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn color="primary" icon="edit" size="sm" round dense @click="editFile(props.row)" class="q-mx-xs"/>
            <q-btn color="negative" icon="delete" size="sm" round dense @click="confirmDeleteFile(props.row)" class="q-mx-xs"/>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- دیالوگ حذف -->
    <q-dialog v-model="deleteDialog">
      <q-card class="q-pa-md" style="min-width: 350px; border-radius: 12px; font-family: Vazirmatn, serif">
        <q-card-section class="text-center">
          <div class="text-h6 q-mb-md" style="color: #1976d2">
            آیا مطمئن هستید که این رکورد را حذف کنید؟
          </div>
        </q-card-section>

        <div class="row justify-around q-gutter-sm q-mt-sm">
          <q-btn label="لغو" color="green" v-close-popup />
          <q-btn label="حذف" color="red" @click="performDeleteFile" />
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
const selectedFileId = ref(null)
const deleteDialog = ref(false)
const fileToDelete = ref(null)
const messageClass = ref('bg-positive text-white')

// فرم و لیست‌ها
const statuses = [
  { label: 'جاری', value: 'open' },
  { label: 'مختومه', value: 'closed' }
]

const clients = ref([])

const form = ref({
  title: '',
  description: '',
  status: '',
  client_id: null,
  lawyer_id: null, // خودکار توسط لاگین وکیل
})

// جدول پرونده‌ها
const files = ref([])
const columns = [
  { name: 'title', label: 'عنوان پرونده', field: 'title', align: 'center' },
  { name: 'status', label: 'وضعیت', field: 'status', align: 'center' },
  { name: 'client_id', label: 'موکل', field: 'client_id', align: 'center' },
  { name: 'actions', label: 'عملیات', field: 'actions', style: 'width:100px' }
]

// توابع
const getStatusLabel = (val) => statuses.find(s => s.value === val)?.label || ''
const getClientName = (id) => {
  const client = clients.value.find(c => c.id === id)
  return client ? client.full_name : ''
}

function toggleForm() { showForm.value = !showForm.value }
function cancelForm() {
  form.value = { title:'', description:'', status:'', client_id:null, lawyer_id:null }
  editMode.value = false
  selectedFileId.value = null
  showForm.value = false
}

// گرفتن لیست موکلین
const fetchClients = async () => {
  try { const res = await axios.get('/api/get-clients'); clients.value = res.data }
  catch(err){ console.log(err) }
}

// گرفتن پرونده‌ها
const fetchFiles = async () => {
  try { const res = await axios.get('/api/files'); files.value = res.data }
  catch(err){ console.log(err) }
}

// ذخیره پرونده
const storeFile = async () => {
  try {
    form.value.lawyer_id = 1 // اینجا باید آی‌دی وکیل لاگین شده رو قرار بدی
    const res = await axios.post('/api/files', form.value)
    Message.value = res.data.message
    cancelForm()
    fetchFiles()
  } catch(err){ handleError(err) }
}

// ویرایش پرونده
const editFile = (file) => {
  form.value = {
    title: file.title,
    description: file.description,
    status: file.status,
    client_id: file.client_id,
    lawyer_id: file.lawyer_id
  }
  selectedFileId.value = file.id
  editMode.value = true
  showForm.value = true
}

// بروزرسانی پرونده
const updateFile = async () => {
  try {
    const res = await axios.put(`/api/files/${selectedFileId.value}`, form.value)
    Message.value = res.data.message
    cancelForm()
    fetchFiles()
  } catch(err){ handleError(err) }
}

// حذف پرونده
const confirmDeleteFile = (file) => { fileToDelete.value = file.id; deleteDialog.value = true }
const performDeleteFile = async () => {
  try { await axios.delete(`/api/files/${fileToDelete.value}`); fetchFiles() }
  catch(err){ console.log(err) }
  deleteDialog.value = false
  fileToDelete.value = null
}

const handleError = (err) => {
  if(err.response && err.response.status === 422){
    Message.value = Object.values(err.response.data.errors).flat().join('\n')
    messageClass.value = 'bg-negative text-white'
  } else if(err.response && err.response.status === 500){
    Message.value = 'خطا در سرور، اطلاعات بررسی شود'
    messageClass.value = 'bg-negative text-white'
    console.log(err.response.data)
  } else console.log(err)
}

// بارگذاری اولیه
onMounted(()=>{
  fetchClients()
  fetchFiles()
})
</script>

<style>
.q-expansion-item__content > .q-card { border-radius: 10px; font-family: Vazirmatn, serif; display: inline-block; }
.q-pa-md { border-radius: 10px; font-family: Vazirmatn, serif; text-align: center; background-color: rgb(187, 222, 251); }
.q-table th { font-family: Vazirmatn, serif; font-size: larger; text-align: center; background: #bbdefb57; }
.q-table tbody td { font-family: Vazirmatn, serif; text-align: center; }
.q-table__container > div:last-child { direction: ltr; font-family: Vazirmatn, serif; background: #bbdefb57; }
.q-field--outlined .q-field__control { width: 230px; }
.q-card { border: solid; border-color: #1976d2; font-family: Vazirmatn, serif; }
.q-item__section--side > .q-icon { color: #1976d2; }
.q-item__section--main{
  font-family: Vazirmatn,serif; font-size: larger; text-align: center;
}
</style>
