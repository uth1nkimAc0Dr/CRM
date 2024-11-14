<template>
  <div class="profile">
    <h1>Settings</h1>
    <button style="margin: 15px" @click="isAccessExpired()">
      isAccessExpired
    </button>

    <button style="margin: 15px" @click="getProfile()">gepProfile</button>
  </div>
</template>

<style scoped lang="scss">
.profile {
  text-align: center;
}
</style>

<script lang="ts">
import { getProfile, isAccessExpired } from '@/api/auth';

export default {
  name: 'UserSetting',
  setup() {
    return {
      isAccessExpired,
      getProfile,
    };
  },
};
</script>
