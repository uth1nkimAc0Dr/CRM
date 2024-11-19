// имя почта
// userProfileData можно хранить
// reactive переманная можно хранить, которые буду в другом месте юзать
// функция стейт забивает, а мы уже в саму компоненту данные из стора хватаем

import { defineStore } from 'pinia';
import { reactive } from 'vue';
import type { Profile } from '@/types/authInterfaces';
import { getProfile } from '@/api/auth';

export const useAuthStore = defineStore('authStore', () => {
  const user = reactive<Profile>({});
  //reactive - {} is not assignable
  //если ref, то мучиться с value и valueOf

  const loadProfile = async () => {
    try {
      const response = await getProfile();
      Object.assign(user, response);
    } catch (error) {
      console.error(`ошибка загрузки профиля ${error}`);
    }
  };

  return { user, loadProfile };
});
