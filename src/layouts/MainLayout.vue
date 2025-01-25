<template>
  <a-layout style="display: flex; flex-direction: row">
    <SideBarv ref="child" @newSelect="goToComponent" />
    <div class="Header-Content">
      <a-layout-header class="layout-header">
        <h1>
          <!-- Header and Child's value is {{ child?.value.state.selectedKeys[0] }} -->
        </h1>
      </a-layout-header>

      <a-layout-content> <router-view></router-view> </a-layout-content>
    </div>
  </a-layout>
</template>

<script lang="ts" setup>
import SideBarv from '@/components/SideBarv.vue';
import { ref, watch } from 'vue';
import router from '@/router';

// watch(
//   () => child.value.state.selectedKeys[0],
//   () => {
//     if (!parseFloat(child.value?.state.selectedKeys[0])) {
//       router.push(`/${child.value.state.selectedKeys[0]}`);

//       console.log('push');
//     }
//   },
// );

const child = ref(null);
const currentSelection = ref('');

watch(
  () => child.value?.state.selectedKeys[0], // Явно указываем зависимость
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      if (!parseFloat(child.value.state.selectedKeys[0])) {
        currentSelection.value = newVal; // Обновляем выбор
        console.log('Navigating to:', newVal);
        router.push(`/${newVal}`); // Перенаправляем пользователя
      }
    }
  },
);

const goToComponent = () => {
  console.log('go TO & ', child.value.state.selectedKeys[0]);
  // почему неправильно работает
};
//   childValue.value = child.value.state2;
//   let StringRoute = childValue.value;
//   console.log('stringRoute is', StringRoute);
//   if (parseFloat(StringRoute)) {
//     console.log('число ебаное');
//   } else {
//     console.log('не число, поэтому пушим');
//     router.push(`/${StringRoute}`);
//   }
</script>

<style scoped>
.Header-Content {
  width: 100%;
  display: flex;
  flex-direction: column;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}

.layout-header {
  background: #fff;
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
</style>

<!-- <template>
  <div class="main-layout">
    <SideBar />
    <div class="right">
      <div>
        <div>
          <h1>Header</h1>
          <div class="separator"></div>
        </div>

        <div>
          <router-view></router-view>
        </div>
      </div>
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
</style> -->
