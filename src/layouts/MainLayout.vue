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
        <div class="text-weight-medium text-grey-8" v-show="!mini" style="color: #f44336 !important; font-size: large" >نام وکیل</div>
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

        <!-- لیست موکلین -->
        <q-item
          clickable v-ripple
          to="/clients"
          class="menu-item"
          active-class="menu-active"
        >
          <q-item-section avatar><q-icon name="groups" /></q-item-section>
          <q-item-section v-show="!mini" style="font-size: 16px;">لیست موکلین</q-item-section>
          <q-tooltip v-if="mini" style="font-family: Vazirmatn,serif;">لیست موکلین</q-tooltip>
        </q-item>

        <!-- لیست وکلا -->
        <q-item
          clickable v-ripple
          to="/lawyers"
          class="menu-item"
          active-class="menu-active"
        >
          <q-item-section avatar><q-icon name="groups" /></q-item-section>
          <q-item-section v-show="!mini">لیست وکلا</q-item-section>
          <q-tooltip v-if="mini" class="tooltip-font" style="font-family: Vazirmatn,serif;">لیست وکلا</q-tooltip>
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

        <!-- home -->
        <q-item
          clickable v-ripple
          to="/home"
          class="menu-item"
          active-class="menu-active"
        >
          <q-item-section avatar><q-icon name="analytics" /></q-item-section>
          <q-item-section v-show="!mini">خانه</q-item-section>
          <q-tooltip v-if="mini" style="font-family: Vazirmatn,serif;">خانه</q-tooltip>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import { useAuthStore } from 'stores/auth'
const router = useRouter()
// const auth = useAuthStore()
const drawer = ref(true)
// منوی جمع‌وجور؛ اگر خواستی باز باشه مقدار false کن
const mini = ref(true)

function logout () {
  // لاجیک خروج خودت رو صدا بزن
  // مثلا پاک کردن توکن و ریدایرکت:
  // authStore.logout();
  // auth.logout()   ;       // وضعیت لاگین رو پاک می‌کنه
  router.push('/login') ; // هدایت به صفحه لاگین
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
