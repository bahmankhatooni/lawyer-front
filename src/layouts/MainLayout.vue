<template>
  <q-layout view="lHh Lpr lFf" dir="rtl" >
    <!-- هدر -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="mini = !mini" />
        <q-toolbar-title style="font-family: Vazirmatn,serif; text-align: center">سامانه مدیریت وظایف وکیل</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- منوی عمودی -->
    <q-drawer
      v-model="drawer"
      side="right"
      bordered
      :mini="mini"
      :width="200"
      :mini-width="72"
      show-if-above
      class="bg-grey-1"
      style="background: #1976d2 !important"
    >
      <div class="q-pa-sm flex items-center" style="font-family: Vazirmatn,serif; text-align: center; display: block">
        <div class="text-weight-medium text-grey-8" v-show="!mini" style="color: #ffffff !important; font-size: large" > {{name}}</div>
      </div>

      <q-separator spaced inset />

      <q-list padding separator class="menu-list">
        <!-- داشبورد -->
        <q-item
          clickable v-ripple
          to="/dashboard" exact
          class="menu-item"
          active-class="menu-active"
        >
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section v-show="!mini">داشبورد</q-item-section>
          <q-tooltip v-if="mini" style="font-family: Vazirmatn,serif;">داشبورد</q-tooltip>
        </q-item>

        <!-- لیست نقش -->
        <q-item
          v-if="roleId === 1"
          clickable v-ripple
          to="/roles"
          class="menu-item"
          active-class="menu-active"
        >
          <q-item-section avatar><q-icon name="security" /></q-item-section>
          <q-item-section v-show="!mini">نقش</q-item-section>
          <q-tooltip v-if="mini" class="tooltip-font" style="font-family: Vazirmatn,serif;">نقش</q-tooltip>
        </q-item>

        <!-- لیست وکلا -->
        <q-item
          v-if="roleId === 1"
          clickable v-ripple
          to="/lawyers"
          class="menu-item"
          active-class="menu-active"
        >
          <q-item-section avatar><q-icon name="people" /></q-item-section>
          <q-item-section v-show="!mini">وکلا</q-item-section>
          <q-tooltip v-if="mini" class="tooltip-font" style="font-family: Vazirmatn,serif;">وکلا</q-tooltip>
        </q-item>


        <!-- لیست موکلین -->
        <q-item
          v-if="roleId === 1"
          clickable v-ripple
          to="/clients"
          class="menu-item"
          active-class="menu-active"
        >
          <q-item-section avatar><q-icon name="groups" /></q-item-section>
          <q-item-section v-show="!mini" style="font-size: 16px;">موکلین</q-item-section>
          <q-tooltip v-if="mini" style="font-family: Vazirmatn,serif;">موکلین</q-tooltip>
        </q-item>

        <!-- گزارشات -->
        <q-item
          clickable v-ripple
          to="/reports"
          class="menu-item"
          active-class="menu-active"
        >
          <q-item-section avatar><q-icon name="analytics" /></q-item-section>
          <q-item-section v-show="!mini">گزارشات</q-item-section>
          <q-tooltip v-if="mini" style="font-family: Vazirmatn,serif;">گزارشات</q-tooltip>
        </q-item>


        <q-separator spaced inset />

        <!-- خروج -->
        <q-item clickable v-ripple @click="logout" class="menu-item">
          <q-item-section avatar><q-icon name="logout" /></q-item-section>
          <q-item-section v-show="!mini">خروج</q-item-section>
          <q-tooltip v-if="mini" style="font-family: Vazirmatn,serif;">خروج</q-tooltip>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- بدنه صفحات -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

const router = useRouter()
const drawer = ref(true)
const mini = ref(true)
const user = ref(null)
const user1 = JSON.parse(localStorage.getItem('user')) || {}
const roleId = user1.role_id  // استفاده در template برای v-if
const name = user1.fname+' '+user1.lname
// بارگذاری کاربر از localStorage
onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) user.value = JSON.parse(storedUser)
})

// تابع خروج امن
async function logout() {
  try {
    // 1️⃣ API logout (اختیاری)
    await api.post('/logout')

    // 2️⃣ پاک کردن اطلاعات محلی
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    user.value = null

    // 3️⃣ هدایت به login و جلوگیری از back
    router.push({ path: '/login', replace: true })
  } catch (err) {
    console.error('خطا در خروج از سیستم:', err)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    user.value = null
    router.push({ path: '/login', replace: true })
  }
}
</script>

<style scoped>
.menu-list {
  font-family: Vazirmatn,serif;
  font-size: large;

}

.menu-item {
  border-radius: 10px;
  margin: 2px 6px;
  transition: background-color .2s ease;
  background: var(--q-primary);
  color: #fff !important;
}
.menu-item:hover {
  background: rgba(0, 0, 1, 0.40);
}

.menu-active{
  background: #f44336;
}

.q-item__section--side > .q-icon{
  color: #ffffff;
}

</style>
