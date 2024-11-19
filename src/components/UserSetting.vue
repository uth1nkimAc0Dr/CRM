<template>
  <div class="profile">
    <div>
      <h1>Хотите выйти?</h1>

      <div class="logout">
        <button class="logout-button" @click="logOut()">Log Out</button>
      </div>
    </div>

    <div class="userDate">
      <h1>userDate:</h1>
      <div class="content">
        <div>Id: {{ store.user.id }}</div>
        <div>Username: {{ store.user.username }}</div>
        <div>Email: {{ store.user.email }}</div>
        <div>Date: {{ store.user.date }}</div>
        <div>isBlocked: {{ store.user.isBlocked }}</div>
        <div>isAdmin: {{ store.user.isAdmin }}</div>
        <div>phoneNumber: {{ store.user.phoneNumber }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.logout {
  margin: 5px;
  .logout-button {
    margin: 5px;
    padding: 10px;
  }
}
.profile {
  text-align: center;
}
.userDate {
  margin: 30px 300px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid;
}
.content {
  max-width: 500px;
}
.content > div {
  margin: 5px;
  display: flex;
  flex-direction: row;
}
</style>

<script lang="ts" setup>
import { onMounted } from 'vue';
import router from '@/router';
import { useAuthStore } from '@/stores/authStore';
const store = useAuthStore();

const logOut = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  router.push('/login');
};

onMounted(() => {
  store.loadProfile();
});
</script>
