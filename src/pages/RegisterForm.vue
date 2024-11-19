<template>
  <a-form
    ref="formRef"
    name="custom-validation"
    :model="formState"
    v-bind="layout"
    @finish="handleSubmitProfile"
    @finishFailed="handleFinishFailed"
  >
    <a-form-item
      has-feedback
      label="Имя пользователя"
      name="username"
      :rules="[
        {
          required: true,
          min: 1,
          message: 'Введите имя пользователя',
          trigger: 'blur',
        },
        {
          max: 60,
          message: 'Введите меньше 60 символов',
          trigger: 'change',
        },
        {
          pattern: /^[a-zA-Zа-яА-Я]{0,90}$/gm,
          trigger: 'blur',
          message: 'Символы русского/латинского алфавита!',
        },
      ]"
    >
      <a-input v-model:value="formState.username" autocomplete="off" />
    </a-form-item>

    <a-form-item
      has-feedback
      label="Логин"
      name="login"
      :rules="[
        { required: true, message: 'Введите логин', trigger: 'blur' },
        { min: 2, message: 'Введите больше 1 символа', trigger: 'blur' },
        { max: 60, message: 'Введите меньше 60 символов', trigger: 'blur' },
        {
          pattern: /^[a-zA-Z]{0,90}$/gm,
          trigger: 'blur',
          message: 'Символы латинского алфавита!',
        },
      ]"
    >
      <a-input v-model:value="formState.login" autocomplete="off" />
    </a-form-item>

    <a-form-item
      has-feedback
      label="Пароль"
      name="pass"
      :rules="[
        { min: 6, message: 'Больше 5 символов!' },
        { validator: validatePass, trigger: 'blur' },
        // это не велосипед?
      ]"
    >
      <a-input
        v-model:value="formState.pass"
        type="password"
        autocomplete="off"
      />
    </a-form-item>

    <a-form-item
      has-feedback
      name="checkPass"
      label="Подтвердите"
      :rules="[{ validator: validatePass2, trigger: 'blur' }]"
    >
      <a-input
        v-model:value="formState.checkPass"
        type="password"
        autocomplete="off"
      />
    </a-form-item>

    <a-form-item
      has-feedback
      label="Почта"
      name="email"
      :rules="[
        { required: true, message: `Введите почту`, trigger: 'blur' },
        {
          // pattern: /[a-z0-9]+@[a-z0-9]+.[a-z]+/gm,
          pattern: /^[a-z0-9]+@[a-z0-9]+.[a-z]+$/gm,
          trigger: 'blur',
          message: `Введите реальную почту`,
        },
      ]"
    >
      <a-input v-model:value="formState.email" autocomplete="off" />
    </a-form-item>

    <a-form-item
      has-feedback
      label="Phone"
      name="phone"
      :rules="[
        {
          required: false,
          message: `Введите номер телефона`,
          trigger: 'change',
        },
        {
          // pattern: /\+[0-999]{1}[0-9]{3}[0-9]{3}[0-9]{2}[0-9]{2}/,
          pattern: /^\+[0-999]{1}[0-9]{3}[0-9]{3}[0-9]{2}[0-9]{2}$/gm,
          message: `Введите в формате: +xxxxxxxxxxx`,
          trigger: 'change',
        },
      ]"
    >
      <a-input v-model:value="formState.phone" />
    </a-form-item>

    <a-form-item>
      <div>
        <div>
          <a-button type="primary" html-type="submit">
            Создать аккаунт
          </a-button>

          <a-button style="margin-left: 10px" @click="resetForm">
            Очистить все поля
          </a-button>
        </div>

        <a-button style="margin: 20px auto; height: 50px">
          <router-link to="/login">
            <p>У меня есть аккаунт.</p>
            <p>Войти</p>
          </router-link>
        </a-button>
      </div>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { FormInstance } from 'ant-design-vue';
import { createUser } from '@/api/auth';
import type { UserRegistration } from '@/types/authInterfaces';

interface FormState {
  username: string;
  login: string;
  pass: string;
  checkPass: string;
  email: string;
  phone: string;
}

const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  username: '',
  login: '',
  pass: '',
  checkPass: '',
  email: '',
  phone: '',
});

// вызывается после Создать аккаунт(сработает, если валидация пропустит)
const handleSubmitProfile = async (values: FormState) => {
  console.log(values, formState);
  console.log('handle');
  const newObj: UserRegistration = {
    login: formState.login,
    username: formState.username,
    password: formState.pass,
    email: formState.email,
    phoneNumber: formState.phone,
  };

  try {
    await createUser(newObj);
    alert('Регистрация прошла успешно. Пройдите на страницу входа');
  } catch (error) {
    if (error instanceof Error && error.message === '409') {
      alert('Такой логин или почта уже существует');
    } else {
      alert(`Ошибка при создании профиля: ${error}`);
    }
  }
};

const validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('Введите пароль');
  } else {
    if (formState.checkPass !== '') {
      formRef?.value.validateFields('checkPass');
      //я не дал default value, so TS extends:"мб и undefined?"(когда знач не задано)
      //formRef!.value - "хоть это и мб null или undefined, оно не будет, if it does let if fail
      //formRef?.value - "TS, call da mёethod only if значение не является ни null, ни undefined
    }
    return Promise.resolve();
  }
};

const validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('Введите снова пароль');
  } else if (value !== formState.pass) {
    return Promise.reject('Не совпадают!');
  } else {
    return Promise.resolve('');
  }
};

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

const handleFinishFailed = (errors: any) => {
  console.log(errors);
};

const resetForm = () => {
  formRef?.value.resetFields();
};
</script>

<!-- <template>
  <div class="auth-layout">
    <div>Symbol</div>
    <div class="login-1">
      <div class="login-2">
        <h1 class="login-title">Register new Account</h1>
        <p class="login-title-description">
          See what is going on with your business
          </p>
      </div>

      <div>
        <div>
          <div>
            <div>Имя пользователя</div>
            <input class="data-input" type="text" placeholder="mail@abc.com" />
          </div>
          
          <div>
            <div>Логин</div>
            <input
              class="data-input"
              type="text"
              placeholder="****************"
            />
          </div>

          <div>
            <div>Пароль</div>
            <input
              class="data-input"
              type="text"
              placeholder="****************"
            />
          </div>
          <div>Remember Me</div>
          <div>
            <router-link to="/forgot">Forgot Password?</router-link>
          </div>
        </div>

        <div class="login-button">
          <button class="login">Login</button>
        </div>
      </div>

      <div class="content"></div>
    </div>


  </div>
</template>

<script lang="ts" setup></script> -->
