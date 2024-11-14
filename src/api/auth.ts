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

// для перед todo-handleraми
export const outOfExpired = async (): Promise<boolean | undefined> => {
  const refreshTry = async () => {
    console.log('refreshTry');
    let refreshResult = false; //истек
    try {
      refreshResult = await refresh(); //console.log('refreshResult !s', refreshResult);
    } catch (error) {
      refreshResult = true;
      console.log('Ошибка обновления токена');
      router.push('/login'); //с любой ошибки выпинываем(останется false)
      throw error;
    }
    return refreshResult;
  };

  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    try {
      const tokenParts = accessToken.split('.');
      const payloadData = atob(tokenParts[1]);
      const payloadDataParsed = JSON.parse(payloadData); //обернуть в try-catch?
      const payloadDataExp = payloadDataParsed.exp;

      const now = Math.floor(Date.now() * 0.001);
      console.log('разница', payloadDataExp - now);
      if (payloadDataExp - now < 300) {
        console.log('мало! Разница:', payloadDataExp - now);
        const refreshSuccess = await refreshTry();
        if (!refreshSuccess) {
          return true; //
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error('Ошибка при проверке токена, ${error}');
      // router.push('/login');
      return true;
    }
  } else {
    try {
      const refreshSuccess = await refreshTry();

      if (!refreshSuccess) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(`ошибка: ${error}`);
      throw new Error(`${error}`);
    }
    // console.log('постараемя зарефрешить(!accessToken)');
    // refreshTry();
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

    let token = localStorage.getItem('accessToken');
    if (token) {
      //&& refreshToken?
      try {
        if (await isAccessExpired()) {
          try {
            await refresh();
            token = localStorage.getItem('accessToken');
            if (token) {
              config.headers = config.headers || {};
              config.headers['Authorization'] = `Bearer ${token}`;
            } else {
              throw new Error(
                `Не удалость получить новый accessToken после обновления `,
              );
            }
          } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            router.push('/login');
            return Promise.reject(error);
          }
        } else {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/login');
        return Promise.reject(error);
      }
    } else {
      router.push('/login');
    }
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    //возвращаем пропатченный конфиг с токеном в заголовке
    return {
      ...config,
      headers: {
        ['Authorization']: `Bearer ${token}`,
      },
    };
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      if (error.response.status === '401') {
        alert('Закончилось время пользования, авторизуйтесь заново ');
        router.push('/login');
      } else {
        console.error(error);
      }
    }
    return Promise.reject(error);
  },
);

import type {
  UserRegistration,
  AuthData,
  RefreshToken,
  Profile,
  Token,
} from '@/types/authInterfaces';

export const createUser = async (
  userData: UserRegistration,
): Promise<Profile | any> => {
  await apiClient
    .post<Profile>(`/auth/signup`, userData, {
      skipAuth: true,
    })
    .then((response) => {
      const profile = response.data;
      return profile;
    })
    .catch((error) => {
      console.error(`Ошибка регистрации${error}`);
      throw error;
    });
};

export const userAuth = async (userData: AuthData): Promise<Token | any> => {
  try {
    const response = await apiClient.post<Token>(`/auth/signin`, userData, {
      skipAuth: true,
    });

    if (response.data) {
      const data: Token = response.data; // if (error instanceof Error && error.message.trim() === '401') {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return response.data;
    } else {
      throw new Error(`Ответ сервера пуст`);
    }
  } catch (error) {
    console.error(`${error}`);
    if (
      error instanceof Error &&
      error.message === 'Request failed with status code 401'
    ) {
      alert('Неверный логин или пароль');
      throw error;
    } else {
      alert(`Ошибка входа: ${error}`);
      throw error;
    }
  }
};

export const refresh = async (): Promise<Token | any> => {
  const refreshToken: RefreshToken = localStorage.getItem('refreshToken');
  // if (!refreshToken) {throw new Error(`RefreshToken отсутствует`);}
  apiClient
    .post<Token>(`/auth/refresh`, { refreshToken }, { skipAuth: true })

    .then((response) => {
      if (response.data) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        return response.data;
        //либо reponse, либо error? третьего не дано?
      } else {
        throw new Error(`Ответ сервера ${response.status}`);
      }
    })

    .catch((error) => {
      console.error(`Ошибка обновления токена: ${error}`);
      throw error;
    }); //console.log('refreshNULLsya');
};

export const getProfile = async (): Promise<Profile | any> => {
  apiClient
    .get(`/user/profile`)
    .then((response) => {
      const profile = response;
      return profile;
    })
    .catch((error) => {
      console.log(`error trouble is ${error}`);
      throw error;
    });
};

// для index.ts + auth.interceptors
export const isAccessExpired = async (): Promise<boolean> => {
  const accessToken = localStorage.getItem('accessToken');
  const tokenParts = accessToken.split('.');
  const payloadData = atob(tokenParts[1]);
  const payloadDataParsed = JSON.parse(payloadData); //обернуть в try-catch?
  const payloadDataExp = payloadDataParsed.exp;

  const now = Math.floor(Date.now() * 0.001);
  console.log('разница:', payloadDataExp - now);
  if (payloadDataExp - now < 300) {
    console.log('мало!! Разница:', payloadDataExp - now);
    return true;
  } else {
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
