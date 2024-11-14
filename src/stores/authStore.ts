// имя почта
// userProfileData можно хранить
// reactive переманная можно хранить, которые буду в другом месте юзать
// функция стейт забивает, а мы уже в саму компоненту данные из стора хватаем

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('authStore', () => {
  const refreshToken = ref<string>('');
  return { refreshToken };
});
