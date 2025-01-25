import axios, { AxiosHeaders } from 'axios';
import router from '@/router';
import type { InternalAxiosRequestConfig } from 'axios';
import type { CustomAxiosRequestConfig } from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
}
// import { useAuthStore } from '@/stores/authStore';
// const store = useAuthStore();
const BASE_URL = 'https://easydev.club/api/v1';

// перед todo-handleraми + index.ts
export const outOfExpired = async (): Promise<boolean | undefined> => {
  if (localStorage.getItem('refreshToken') !== null) {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        if (isAccessExpired()) {
          console.log('акцес есть');
          // когда код падал 401, в этом месте он лежал
          const refreshSuccess = await refresh();
          console.log('asdf;');
          if (!refreshSuccess) {
            console.log('вернулся isAcsExp = false');
            router.push('/login');
            throw new Error(`Ошибка обновления токена: ${Error}`);
          }
        } else {
          console.log('access не истек, не обновляем');
        }
      } catch (error) {
        console.error(`Ошибка при обновлении токена, ${error}`);
        return true;
      }
    } else {
      console.log('акцеса нет');
      try {
        const refreshSuccess = await refresh();
        console.log('вернулся isAcsExp = false');
        if (!refreshSuccess) {
          router.push('/login');
          throw new Error(`Ошибка обновления токена: ${Error}`);
        }
      } catch (error) {
        //console.error(`ошиб обновления: ${error}`)-этого не надо, если внутри refresh уже есть console.error?
        throw new Error(`${Error}`);
      }
    }
  } else {
    router.push(`/login`);
    return false;
  }
};

const apiClient = axios.create({
  // validateStatus: (status) => status < 500,
  baseURL: BASE_URL,
  headers: new AxiosHeaders({
    'Content-Type': 'application/json',
  }),
});

apiClient.interceptors.request.use(
  async (config) => {
    if (config.skipAuth) {
      return config;
    }
    if (localStorage.getItem('refreshToken')) {
      console.log('работает интерсептор');
      let token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = isAccessExpired();
          console.log('isAccessExpired:', response);
          if (response) {
            // access истек
            if (await refresh()) {
              token = localStorage.getItem('accessToken');
              if (token) {
                console.log('с токеном все норм', token);
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${token}`;
              } else {
                console.log('с токеном все neнорм', token);
                throw new Error(
                  `Не удалость получить новый accessToken после обновления `,
                );
              }
            } else {
              throw new Error(`Рефреш токен отсутствует`);
            }
            // } catch (error) {
            //   localStorage.clear();
            //   router.push('/login');
            //   return Promise.reject(error);
            // }
          } else {
            console.log('Аксес не истек');
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        } catch (error) {
          localStorage.clear();
          router.push('/login');
          return Promise.reject(error);
        }
      } else {
        //если нету аксеса
        try {
          const refreshSuccess = await refresh();
          if (!refreshSuccess) {
            router.push('/login');
            throw new Error(`Ошибка обновления токена: ${Error}`);
          }
        } catch (error) {
          //console.error(`ошиб обновления: ${error}`)-этого не надо, если внутри refresh уже есть console.error?
          return Promise.reject(new Error(`RefreshОтсутствует`));
        }
      }
      //возвращаем пропатченный конфиг с токеном в заголовке
      return {
        ...config,
        headers: {
          ['Authorization']: `Bearer ${token}`,
        },
      };
    } else {
      console.log('Refresh нету, запрос не будет выполнен');
      return Promise.reject(new Error(`RefreshОтсутствует`));
    }
  },
  (error) => Promise.reject(error),
);

// apiClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     if (error.response) {
//       console.log(error.status);
//       if (error.status === 401) {
//         alert('Закончилось время пользования,я response! ');
//         // router.push('/login');
//       } else {
//         console.error(error);
//       }
//     }
//     return Promise.reject(error);
//   },
// );
// зачем обрабатывать тут, если можно на запросе(ошибки 401 разные для разных функций)

import type {
  UserRegistration,
  AuthData,
  Profile,
  Token,
} from '@/types/authInterfaces';

export const createUser = async (
  userData: UserRegistration,
): Promise<Profile | any> => {
  try {
    const response = await apiClient.post<Profile>(`/auth/signup`, userData, {
      skipAuth: true,
    });
    const profile = response.data;
    return profile;
  } catch (error) {
    console.error(`Ошибка регистрации ${error}`);
    throw error;
  }
};

export const userAuth = async (userData: AuthData): Promise<Token | any> => {
  try {
    const response = await apiClient.post<Token>(`/auth/signin`, userData, {
      skipAuth: true,
    });
    const data: Token = response.data; // if (error instanceof Error && error.message.trim() === '401') {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return response.data;
  } catch (error) {
    console.error(`${error}`);
    if (
      error instanceof Error &&
      error.message === 'Request failed with status code 401'
    ) {
      alert('Неверный логин или пароль!');
      throw error;
    } else {
      alert(`Ошибка входа: ${error}`);
      throw error;
    }
  }
};

export const refresh = async (): Promise<boolean> => {
  console.log('зовется рефреш');
  if (localStorage.getItem('refreshToken') !== null) {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      const response = await apiClient.post<Token>(
        `/auth/refresh`,
        { refreshToken },
        { skipAuth: true },
      );

      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('accessToken', response.data.accessToken);
      console.log('обновлен');
      return true;
    } catch (error) {
      console.error(`Ошибка обновления токена: ${error}`);
      return false;
      // здесь был throw error
    }
  } else {
    return false;
    // Рефреш токен не найден в localStorage
  }
};

export const getProfile = async (): Promise<Profile | any> => {
  try {
    const response = await apiClient.get(`/user/profile`);
    const profile = response.data;
    return profile;
  } catch (error: any) {
    console.error(`Ошибка получения профиля: ${error}`);
    throw error;
  }
};

// для index.ts + auth.interceptors
export const isAccessExpired = (): boolean => {
  const accessToken = localStorage.getItem('accessToken');
  const tokenParts = accessToken.split('.');
  const payloadData = atob(tokenParts[1]);
  const payloadDataParsed = JSON.parse(payloadData); //обернуть в try-catch?
  const payloadDataExp = payloadDataParsed.exp;

  const now = Math.floor(Date.now() * 0.001);
  if (payloadDataExp - now < 300) {
    console.log('isAcExp: истекает! Осталось:', payloadDataExp - now);
    return true;
  } else {
    console.log('Еще не истекает. Pазница:', payloadDataExp - now);
    return false;
  }
};

// try {
//   const accessToken = localStorage.getItem('accessToken');
//   // почему не await?
//   if (!accessToken) {
//     throw new Error(`С токеном проблемы`);
//   }
//   const response = await apiClient.get(`/user/profile`);
//   // headers: {Authorization: `Bearer ${accessToken}`}

// новая версия
// apiClient.interceptors.response.use(
//   async(
//     (response) => {
//       const { status } = response;

//       if (status === 401) {
//         const accessToken = localStorage.getItem('accessToken');
//         if (accessToken) {
//           const _response = await.apiClient({
//             headers: {
//               common: {['Authorization']: `Bearer ${accessToken}`},
//             },
//           });
//           return _response;
//         } else {
//           // разлог
//           // роутер-кик?
//           // router.push('/login');
//         }
//       }
//       return response;
//     },
//     (error: any) => Promise.reject(error),
//   ),
// );

// try {
//   const response = await apiClient.post(`/auth/refresh`, refreshToken);
//   const data: Token = response.data;
//   localStorage.setItem('refreshToken', data.refreshToken);
//   localStorage.setItem('accessToken', data.accessToken);
//   if (!response.data) {
//     throw new Error(`${response.status}`);
//   }
// } catch (error) {
//   console.log(`${error}`);
//   throw error;
// }
