<template>
  <q-page class="q-pa-md" dir="rtl">
    <!--  فرم ثبت وکیل -->
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
    <div class="q-pa-md">
      <q-btn color="primary" label="ثبت نام وکیل جدید" @click="toggleForm" />
      <q-expansion-item
        v-model="showForm"
        expand-separator
        icon="person_add"
        switch-toggle-side
        dense

      >
        <q-card>
          <q-card-section>
            <q-form @submit="registerLawyer">
              <div class="q-gutter-md">
                <q-input v-model="form.firstName" label="نام" outlined dense />
                <q-input v-model="form.lastName" label="نام خانوادگی" outlined dense />
                <q-input v-model="form.phone" label="تلفن" outlined dense />
              </div>

              <div class="q-mt-md">
                <q-btn label="ذخیره" type="submit" color="primary" />
                <q-btn label="انصراف" flat @click="showForm = false" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>
    <!-- جدول -->
<!--    <q-card-section >-->
<!--      <div class="text-h5" style="text-align: center; color: rgb(25 118 210);">لیست وکلا</div>-->
<!--    </q-card-section>-->
    <q-card>

        <q-table
          :rows="lawyers"
          :columns="columns"
          row-key="id"
          flat
          bordered
        />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
const showForm = ref(false)
const successMessage = ref('')
const form = ref({
  firstName: '',
  lastName: '',
  phone: ''
})
const lawyers = ref([
  { id: 1, firstName: 'علی', lastName: 'رضایی', phone: '09123456789' },
  { id: 2, firstName: 'مهدی', lastName: 'کاظمی', phone: '09121234567' }
])

const columns = [
  { name: 'firstName', label: 'نام', field: 'firstName', sortable: true },
  { name: 'lastName', label: 'نام خانوادگی', field: 'lastName', sortable: true },
  { name: 'phone', label: 'تلفن', field: 'phone', sortable: true }
]
ref(false)
ref({ firstName: '', lastName: '', phone: '' })
ref(null)
function toggleForm() {
  showForm.value = !showForm.value
}

function registerLawyer() {
  successMessage.value = 'ثبت‌ نام با موفقیت انجام شد'
  // اینجا میتونی axios ارسال کنی به API لاراول
  showForm.value = false
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

</script>
<style>
.q-expansion-item__content > .q-card{
  border-radius: 10px;
  font-family: Vazirmatn,serif;
  display: inline-block;
}
.q-pa-md{
  border-radius: 10px;
  font-family: Vazirmatn,serif;
  text-align: center;
  background-color: rgb(187, 222, 251);
}
.q-table th.sortable{
  font-family: Vazirmatn,serif;
  font-size: larger;
  text-align: center;
  background: #bbdefb57;
}
.q-table tbody td{
  font-family: Vazirmatn,serif;
  text-align: center;
}
.q-table__container > div:last-child{
  direction: ltr;
  font-family: Vazirmatn,serif;
  background: #bbdefb57;
}
.q-field--outlined .q-field__control{
  width: 230px;

}
.q-card{
  border: solid;
  border-color: #1976d2;
  font-family: Vazirmatn,serif;
}
.q-item__section--side > .q-icon{
  color: #1976d2;
}

</style>
