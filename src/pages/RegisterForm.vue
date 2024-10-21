<template>
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

      <div class="content">
        <!-- <router-view></router-view> -->
        <!-- <router-link to="/login">Залогиниться</router-link> -->
      </div>
    </div>

    <div class="create-account">
      <router-link to="/register">
        Not Registered Yet? Create an account</router-link
      >
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
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
</style>
