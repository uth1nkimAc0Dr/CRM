<template>
  <div style="width: 256px">
    <a-menu
      v-model:openKeys="state.openKeys"
      v-model:selectedKeys="state.selectedKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="state.collapsed"
      :items="items"
      @click="onMenuClick"
    ></a-menu>
    <div>
      <h1>
        {{ state.selectedKeys }}
      </h1>
    </div>
    <a-button type="primary" @click="toggleCollapsed">
      <MenuUnfoldOutlined v-if="state.collapsed" />
      <MenuFoldOutlined v-else />
    </a-button>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import { reactive } from 'vue';
import { h } from 'vue';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  // AppstoreOutlined,
} from '@ant-design/icons-vue';
// import router from '@/router';
import { defineExpose } from 'vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['newSelect']);

const state = reactive({
  collapsed: false,
  selectedKeys: ['users'],
  openKeys: ['sub1'],
  preOpenKeys: ['sub1'],
});
// import { ref } from 'vue';
// const state2 = ref('');

defineExpose({ state });

const items = reactive([
  {
    key: 'users',
    icon: () => h(PieChartOutlined),
    label: 'Пользователи',
    title: 'Option 1',
  },
  {
    key: '2',
    icon: () => h(DesktopOutlined),
    label: 'Notifications',
    title: 'Option 2',
  },
  {
    key: '3',
    icon: () => h(InboxOutlined),
    label: 'Notes',
    title: 'Option 3',
  },
  {
    key: 'todos',
    icon: () => h(InboxOutlined),
    label: 'Tasks',
    title: 'Option 4',
  },
  {
    key: 'sub1',
    icon: () => h(MailOutlined),
    label: 'Emails',
    title: 'Navigation One',
    children: [
      {
        key: '6',
        label: 'Option 6',
        title: 'Option 6',
      },
      {
        key: '7',
        label: 'Option 7',
        title: 'Option 7',
      },
      {
        key: '8',
        label: 'Option 8',
        title: 'Option 8',
      },
    ],
  },
  {
    key: '9',
    icon: () => h(InboxOutlined),
    label: 'Calendars',
    title: 'Option 9',
  },
  {
    key: '10',
    icon: () => h(InboxOutlined),
    label: 'Analytics',
    title: 'Option 10',
  },
  {
    key: '11',
    icon: () => h(InboxOutlined),
    label: 'Contacts',
    title: 'Option 11',
  },
  {
    key: '12',
    icon: () => h(InboxOutlined),
    label: 'Companies',
    title: 'Option 12',
  },
  {
    key: '13',
    icon: () => h(InboxOutlined),
    label: 'Integrations',
    title: 'Option 13',
  },
  {
    key: 'setting',
    icon: () => h(InboxOutlined),
    label: 'Settings',
    title: 'Option 14',
  },
]);
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  },
);
const toggleCollapsed = () => {
  state.collapsed = !state.collapsed;
  state.openKeys = state.collapsed ? [] : state.preOpenKeys;
  console.log('произошло');
};

const onMenuClick = () => {
  console.log('срабатывает клик');
  // state2.value = state.selectedKeys.toString();
  // console.log(state2.value);
  // console.log(state.selectedKeys);
  emit('newSelect');
};
// {key: 'sub2',icon: () => h(AppstoreOutlined),label: 'Navigation Two',title: 'Navigation Two',children: [key: '9',label: 'Option 9',title: 'Option 9', },key: '10',label: 'Option 10',title: 'Option 10',{key: 'sub3',label: 'Submenu',
//       title: 'Submenu',
//       children: [{key: '11',label: 'Option 11',title: 'Option 11',
//         },{key: '12',label: 'Option 12',title: 'Option 12',
//         },],},],},
</script>
