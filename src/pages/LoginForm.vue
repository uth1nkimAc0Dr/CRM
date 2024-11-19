<template>
  <div>
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="handleSignIn"
      @finishFailed="onFinishFailed"
      class="login-form"
    >
      <!-- @finish="onFinish" -->
      <a-form-item
        label="Login"
        name="login"
        :rules="[
          {
            required: true,
            message: 'Введите имя пользователя',
          },
        ]"
        class="input-container"
      >
        <a-input v-model:value="formState.login" />
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[
          { required: true, message: 'Введите пароль' },
          {
            min: 6,
            message: `Пароль не может быть короче 6 символов`,
          },
        ]"
        class="input-container"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <div class="remember-forget">
        <!-- :wrapper-col="{ offset: 8, span: 16 }" -->
        <a-form-item name="remember">
          <a-checkbox>
            <!-- <a-checkbox v-model:checked="formState.remember"> -->
            Remember me
          </a-checkbox>
        </a-form-item>
        <router-link to="/forgot">Forgot password?</router-link>
      </div>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Submit(signIn)</a-button>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <div class="signin-footer">
          <p>Don't registered Yet?</p>
          <p><router-link to="/register"> Create an account </router-link></p>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { userAuth } from '@/api/auth';
// import { ref } from 'vue';
// import type { Token } from '@/types/authInterfaces';
import router from '@/router';

interface FormState {
  login: string;
  password: string;
}

// кнопка войти
const handleSignIn = async (values: any) => {
  try {
    const entered = await userAuth(formState);
    if (entered) {
      router.push('/todos');
    }
  } catch (error) {
    console.error(`Ошибка авторизации ${error}`);
    throw error;
  }
  console.log('Success:', values);
};

const formState = reactive<FormState>({
  login: '',
  password: '',
});
// remember: true,

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>

<style scoped>
.signin-footer {
  display: flex;
}
div {
  text-align: center;
}
.login-form {
  margin: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  /* /* margin: 0 auto; */
}
.remember-forget {
  display: flex;
  justify-content: space-between;
}
/* .input-container {
  width: 50%;
  margin: 15px;
} */
/* .remember-forgot {
  display: flex !important;
  flex-direction: row !important;
  justify-content: flex-start !important;
} */
</style>
