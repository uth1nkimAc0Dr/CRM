<template>
  <div class="main-layout">
    <SideBar />
    <div class="right">
      <!-- <Header /> -->
      <!-- <Content /> -->
      <div>
        <div>
          <h1>Header</h1>
          <div class="separator"></div>
        </div>
      </div>
      <router-view></router-view>
      <!-- <div>
        <div>Content</div>
        <div>Tasks</div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import SideBar from '@/components/SideBar.vue';
import { onMounted } from 'vue';
// const loadToDo = () => {
//   currentPage.value = ToDoPage;
//   alert('Заэмиттили Таски в Сайдбаре');
// };
// const loadProfile = () => {
//   currentPage.value = UserSetting;
//   // alert('Заэмиттили Сеттингс(Профиль) в Сайдбаре');
// };
// const currentPage = ref<any>(UserSetting);
onMounted(() => {});
</script>

<style scoped lang="scss">
.main-layout {
  display: flex;
  flex-direction: row;

  .right {
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
  }

  .separator {
    width: 100%;
    border-bottom: solid 2px black;
  }
}
</style>
