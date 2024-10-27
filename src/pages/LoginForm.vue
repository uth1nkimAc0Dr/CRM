<template>
  <div>
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      class="login-form"
    >
      <a-form-item
        label="Username"
        name="username"
        :rules="[
          {
            required: true,
            message: 'Введите имя пользователя',
          },
        ]"
        class="input-container"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <!-- <a-form-item label="GangNumbers"></a-form-item> -->

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

      <div style="display: flex; justify-content: space-between">
        <!-- :wrapper-col="{ offset: 8, span: 16 }" -->
        <a-form-item name="remember" class="remember-forgot">
          <a-checkbox v-model:checked="formState.remember">
            Remember me
          </a-checkbox>
        </a-form-item>
        <router-link to="/forgot">Forgot password?</router-link>
      </div>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <div style="display: flex">
          <p>Don't registered Yet?</p>
          <p><router-link to="/register"> Create an account </router-link></p>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
});

const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>

<style scoped>
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
