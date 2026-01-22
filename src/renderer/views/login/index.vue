<template>
  <div class="login-page">
    <div class="phone-login" :class="setAnimationClass('animate__fadeInDown')">
      <div class="bg"></div>
      <div class="content">
        <!-- Tab导航 -->
        <div class="login-tabs" :class="setAnimationClass('animate__fadeInUp')">
          <div
            v-for="tab in loginTabs"
            :key="tab.key"
            class="tab-item"
            :class="{ active: activeMode === tab.key }"
            @click="switchToMode(tab.key)"
          >
            {{ tab.label }}
          </div>
        </div>

        <!-- 登录内容区域 -->
        <div class="login-content">
          <!-- 过渡动画包装器 -->
          <transition
            name="login-content"
            mode="out-in"
            enter-active-class="animate__animated animate__fadeIn"
            leave-active-class="animate__animated animate__fadeOut"
          >
            <!-- 二维码登录组件 -->
            <div v-if="activeMode === LoginMode.QR && !isTransitioning" key="qr" class="phone">
              <qr-login @login-success="handleLoginSuccess" @login-error="handleLoginError" />
            </div>

            <!-- 手机号登录 -->
            <div
              v-else-if="activeMode === LoginMode.PHONE && !isTransitioning"
              key="phone"
              class="phone"
            >
              <div class="login-title">{{ t('login.title.phone') }}</div>
              <div class="phone-page">
                <input
                  v-model="phone"
                  class="phone-input"
                  type="text"
                  :placeholder="t('login.placeholder.phone')"
                />
                <input
                  v-model="password"
                  class="phone-input"
                  type="password"
                  :placeholder="t('login.placeholder.password')"
                />
              </div>
              <div class="text">{{ t('login.phoneTip') }}</div>
              <n-button class="btn-login" @click="loginPhone()">{{
                t('login.button.login')
              }}</n-button>
            </div>

            <!-- UID登录组件 -->
            <div
              v-else-if="activeMode === LoginMode.UID && !isTransitioning"
              key="uid"
              class="phone"
            >
              <uid-login @login-success="handleLoginSuccess" @login-error="handleLoginError" />
            </div>

            <!-- Cookie登录组件 -->
            <div
              v-else-if="activeMode === LoginMode.COOKIE && !isTransitioning"
              key="token"
              class="phone"
            >
              <cookie-login @login-success="handleLoginSuccess" @login-error="handleLoginError" />
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { loginByCellphone } from '@/api/login';
import CookieLogin from '@/components/login/CookieLogin.vue';
import QrLogin from '@/components/login/QrLogin.vue';
import UidLogin from '@/components/login/UidLogin.vue';
import { useUserStore } from '@/store/modules/user';
import { setAnimationClass } from '@/utils';

defineOptions({
  name: 'Login'
});

// 登录模式枚举
enum LoginMode {
  QR = 'qr',
  PHONE = 'phone',
  UID = 'uid',
  COOKIE = 'cookie'
}

const { t } = useI18n();
const message = useMessage();
const router = useRouter();
const userStore = useUserStore();

// 当前激活的登录模式
const activeMode = ref<LoginMode>(LoginMode.COOKIE);
// 用于控制内容切换动画
const isTransitioning = ref(false);

// 登录选项配置
const loginTabs = computed(() => [
  { key: LoginMode.COOKIE, label: t('login.title.cookie') },
  { key: LoginMode.UID, label: t('login.title.uid') },
  { key: LoginMode.QR, label: t('login.title.qr') }
]);

// 手机号登录
const phone = ref('');
const password = ref('');
const loginPhone = async () => {
  try {
    if (!phone.value.trim()) {
      message.error(t('login.message.phoneRequired'));
      return;
    }
    if (!password.value.trim()) {
      message.error(t('login.message.passwordRequired'));
      return;
    }

    const { data } = await loginByCellphone(phone.value, password.value);
    if (data.code === 200) {
      message.success(t('login.message.loginSuccess'));
      userStore.setUser(data.profile);
      localStorage.setItem('token', data.cookie);
      setTimeout(() => {
        router.push('/user');
      }, 1000);
    } else {
      message.error(t('login.message.phoneLoginFailed'));
    }
  } catch (error) {
    message.error(t('login.message.phoneLoginFailed'));
    console.error(t('login.message.loginFailed') + ':', error);
  }
};

// 切换登录模式（带动画效果）
const switchToMode = (mode: LoginMode) => {
  if (mode === activeMode.value) return;

  isTransitioning.value = true;
  setTimeout(() => {
    activeMode.value = mode;
    setTimeout(() => {
      isTransitioning.value = false;
    }, 50);
  }, 150);
};

// 通用登录成功处理
const handleLoginSuccess = (userProfile: any, loginType: string) => {
  // 更新 userStore（这会同时更新 store 状态和 localStorage 中的用户数据）
  userStore.setUser(userProfile);

  // 设置登录类型到 userStore 和 localStorage
  userStore.setLoginType(loginType as any);

  // 设置其他相关状态
  const token = loginType !== 'uid' ? localStorage.getItem('token') : undefined;

  if (token) {
    localStorage.setItem('token', token);
  }

  if (loginType === 'uid') {
    localStorage.setItem('uidLogin', 'true');
  }

  setTimeout(() => {
    router.push('/user');
  }, 1000);
};

// 通用登录错误处理
const handleLoginError = (error: string) => {
  console.error(t('login.message.loginFailed') + ':', error);
};
</script>

<style lang="scss" scoped>
.login-page {
  @apply flex flex-col items-center justify-center;
  @apply bg-light dark:bg-black;
  background-image: radial-gradient(
      circle at 20% 20%,
      rgba(59, 130, 246, 0.08),
      transparent 40%
    ),
    radial-gradient(circle at 80% 0%, rgba(14, 165, 233, 0.08), transparent 45%);
}

.login-title {
  @apply text-xl font-semibold mb-5 text-gray-900 dark:text-gray-100;
}

.text {
  @apply mt-4 text-gray-600 dark:text-gray-400 text-xs;
}

.phone-login {
  width: 350px;
  height: 550px; /* 恢复原来的高度 */
  @apply rounded-3xl bg-white/85 dark:bg-dark-100/85 relative overflow-hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation-duration: 0.8s;

  .bg {
    display: none;
  }

  .content {
    @apply absolute w-full h-full p-4 flex flex-col items-center justify-center text-center;

    .login-tabs {
      @apply flex mb-6 bg-gray-100/80 dark:bg-dark-200/80 rounded-xl p-1;
      width: 320px;
      animation-duration: 0.6s;
      animation-delay: 0.2s;

      .tab-item {
        @apply flex-1 py-2 px-3 text-sm text-gray-600 dark:text-gray-300 text-center cursor-pointer rounded-lg transition-all duration-200;
        @apply hover:bg-gray-200/70 dark:hover:bg-dark-300/70;

        &.active {
          @apply bg-white dark:bg-dark-300 text-gray-900 dark:text-white font-medium;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
        }
      }
    }

    .login-content {
      @apply flex-1 flex items-center justify-center;
      min-height: 300px;
    }

    .phone {
      animation-duration: 0.5s;
      width: 100%;
      max-width: 300px;

      &-page {
        @apply bg-white/80 dark:bg-dark-200/80;
        width: 250px;
        @apply rounded-2xl overflow-hidden border border-gray-200/60 dark:border-gray-700/60;
        margin: 0 auto;
      }

      &-input {
        height: 40px;
        @apply w-full px-4 outline-none;
        @apply text-gray-900 dark:text-white bg-transparent;
        @apply border-b border-gray-200/70 dark:border-gray-700/70;
        @apply placeholder-gray-500 dark:placeholder-gray-400;
        transition: all 0.3s ease;

        &:focus {
          @apply border-blue-500;
        }
      }
    }

    .btn-login {
      width: 250px;
      height: 40px;
      @apply mt-8 text-white rounded-xl;
      @apply bg-blue-600 hover:bg-blue-700 transition-all duration-300;

      &:hover {
        box-shadow: 0 8px 16px rgba(37, 99, 235, 0.35);
      }
    }
  }
}

/* 登录内容切换动画 */
.login-content-enter-active,
.login-content-leave-active {
  animation-duration: 0.3s;
}

.login-content-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.login-content-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.mobile {
  .login-page {
    @apply pt-0;
  }

  .phone-login {
    width: 90vw;
    max-width: 350px;
    height: 500px;
  }
}
</style>
