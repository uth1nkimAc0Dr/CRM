<template>
  <!-- :rules="rules" -->
  <a-form
    ref="formRef"
    name="custom-validation"
    :model="formState"
    v-bind="layout"
    @finish="handleFinish"
    @finishFailed="handleFinishFailed"
  >
    <!-- @validate="handleValidate" -->
    <a-form-item
      has-feedback
      label="Имя пользователя"
      name="username"
      :rules="[
        {
          required: true,
          message: 'Введите имя пользователя',
          trigger: 'change',
        },
        {
          max: 60,
          message: 'Введите меньше 60 символов',
          trigger: 'change',
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
        { required: true, message: 'Введите логин', trigger: 'change' },
        { min: 2, message: 'Введите больше 1 символа', trigger: 'change' },
        { max: 60, message: 'Введите меньше 60 символов', trigger: 'change' },
      ]"
    >
      <a-input v-model:value="formState.login" autocomplete="off" />
    </a-form-item>

    <a-form-item
      has-feedback
      label="Пароль"
      name="password"
      :rules="[
        { min: 6, message: 'Больше 5 символов!' },
        { validator: validatePass, trigger: 'change' },
        // это не велосипед?
      ]"
    >
      <a-input
        v-model:value="formState.password"
        type="password"
        autocomplete="off"
      />
    </a-form-item>

    <!-- name="checkPass" -->
    <a-form-item
      has-feedback
      label="Подтвердите"
      :rules="[{ validator: validatePass2, trigger: 'change' }]"
    >
      <a-input v-model:value="checkPass" type="password" autocomplete="off" />
    </a-form-item>

    <a-form-item
      has-feedback
      label="Почта"
      name="email"
      :rules="[
        { required: true, message: `Введите почту`, trigger: 'change' },
        { type: 'email', trigger: 'change', message: `Введите реальную почту` },
      ]"
    >
      <a-input v-model:value="formState.email" autocomplete="off" />
    </a-form-item>

    <a-form-item
      has-feedback
      label="Phone"
      name="phoneNumber"
      :rules="[
        {
          required: true,
          message: `Введите номер телефона`,
          trigger: 'change',
        },
        {
          pattern: /\+[0-999]{1}[0-9]{3}[0-9]{3}[0-9]{2}[0-9]{2}/,
          message: `Введите в формате: +xxxxxxxxxxx`,
          trigger: 'change',
        },
      ]"
    >
      <a-input v-model:value="formState.phoneNumber" />
    </a-form-item>

    <!-- :wrapper-col="{ span: 14, offset: 4 }" -->
    <a-form-item>
      <a-button
        type="primary"
        html-type="submit"
        @click="
          () => {
            createProfileHandler;
          }
        "
      >
        <!-- @click="() => console.log(`@click happened`)" -->
        Submit
      </a-button>
      <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
      <button
        @click="() => createProfileHandler()"
        style="margin: 20px; padding: 20px"
      >
        CLICK
      </button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { FormInstance } from 'ant-design-vue';
import { createProfile } from '@/api/auth';

interface FormState {
  username: string;
  login: string;
  password: string;
  email: string;
  phoneNumber: string;
}
// checkPass: string;
const checkPass = ref<string>();

const formRef = ref<FormInstance>();

const formState = reactive<FormState>({
  username: '',
  login: '',
  password: '',
  email: '',
  phoneNumber: '',
});
// checkPass: '',

const validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('Введите пароль');
  } else {
    if (checkPass.value !== '' && checkPass.value === formState.password) {
      formRef?.value.validate('checkPass.value');
      // console.log('CheckPass не равно пустота епта');
      console.log('Все совпало');
      return Promise.reject('Все совпало'); //сообщение выведется после клика
      //я не дал default value, so TS extends:"мб и undefined?"(когда знач не задано)
      //formRef!.value - "хоть это и мб null или undefined, оно не будет, if it does let if fail
      //formRef?.value - "TS, call da method only if значение не является ни null, ни undefined
    }
    return Promise.resolve();
  }
};

const validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('Введите снова пароль');
  } else if (value !== formState.password) {
    return Promise.reject('Не совпадают!');
  } else {
    return Promise.resolve('');
  }
};

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

interface ProfileInterface {
  login: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
}

const Profile1 = reactive<ProfileInterface>({
  login: 'asdfloginaaq',
  username: 'usernameq',
  password: 'stasdf100q',
  email: 'asdf125q@gmail.com',
  phoneNumber: '+19995550102',
});

const createProfileHandler = async () => {
  try {
    await createProfile(formState);
  } catch (error) {
    alert(`Ошибка при создании задачи: ${error}`);
  }
};

const handleFinish = (values: FormState) => {
  console.log(values, formState);
};
const handleFinishFailed = (errors: any) => {
  console.log(errors);
  console.log('сработал хэндлФинишФейлд');
};

const resetForm = () => {
  formRef?.value.resetFields();
};
// handleValidate выводит результат каждого поля после его заполнения
// const handleValidate = (...args: any) => {
//   console.log(`handleValidate: ${args}`);
// };

// interface PhoneInputFormItemProps {
//   skipValidityCheck?: boolean;
//   errorMessage?: string;
//   // Recognise local phone numbers in country
//   // default: US
//   countryCode?: string;
// }

// interface PhoneInputProps {}

// const rules: Record<string, Rule[]> = {
//   // name: [{ required: true, message: 'Введите имя пользователя' }],
//   password: [{ required: true, validator: validatePass, trigger: 'change' }],
//   checkPass: [{ validator: validatePass2, trigger: 'change' }],
//   age: [{ validator: checkAge, trigger: 'change' }],
// };

// <a-form-item label="Age" name="age" class="input-container">
//   <a-input v-model:value="formState.age" />
// </a-form-item>

// const checkAge = async (_rule: Rule, value: number) => {
//   if (!value) {
//     return Promise.reject('Please input the age');
//   }
//   if (!Number.isInteger(value)) {
//     return Promise.reject('Please input digits');
//   } else {
//     if (value < 18) {
//       return Promise.reject('Age must be greater than 18');
//     } else {
//       return Promise.resolve();
//     }
//   }
// };
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

    <div class="create-account">
      <router-link to="/register">
        Not Registered Yet? Create an account</router-link
      >
    </div>
  </div>
</template>

<script lang="ts" setup></script> -->

<!-- <style lang="scss" scoped>
// input {
//   max-width: 100%;
// }

.auth-layout {
  margin: 0 auto;
  max-width: 420px;
  text-align: center;

  .remember-forgot {
    display: flex;
    // column надо сделать
    justify-content: space-around;
  }
  .login-button {
    max-width: 100%;
    max-height: 50px;
  }
  .login-1 {
    border: 1px solid blueviolet;
    display: flex;
    flex-direction: column;
    gap: 36px;
  }
  .login-2 {
    gap: 3px;
    display: flex;
    flex-direction: column;
    // стоит ли добавлять flex, wrap и тд ради гап, если можно просто margin-bottom
    .login-title {
      all: unset;
      font-size: 36px;
    }
    .login-title-description {
      all: unset;
    }
  }
  .create-account {
    margin-top: 317px;
  }
  .data-input {
    width: 100%;
  }
}
</style> -->
