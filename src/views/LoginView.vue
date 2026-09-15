<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/user'
import { useUserStore } from '@/store/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const userIdInput = ref('')
const loading = ref(false)

async function handleLogin() {
  const userId = Number(userIdInput.value.trim())
  if (!userIdInput.value.trim() || !Number.isInteger(userId) || userId <= 0) {
    ElMessage.warning('请输入正确的用户 ID（纯数字）')
    return
  }

  loading.value = true
  try {
    const res = await login(userId)
    if (res.data) {
      userStore.setLogin(res.data)
      ElMessage.success(`登录成功，欢迎 ${res.data.userName || userId}`)
      const redirect = (route.query.redirect as string) || '/'
      router.push(redirect)
    }
  } catch {
    // 错误提示已在拦截器统一处理
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-brand">
        <span class="mark">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </span>
        <div class="brand-text">
          <h1>文的点赞系统</h1>
          <p>高并发点赞技术实践</p>
        </div>
      </div>

      <el-input
        v-model="userIdInput"
        placeholder="输入用户 ID 登录，例如 1"
        size="large"
        clearable
        @keyup.enter="handleLogin"
      >
        <template #prefix>
          <span class="input-prefix">ID</span>
        </template>
      </el-input>

      <el-button
        type="primary"
        size="large"
        class="login-btn"
        :loading="loading"
        @click="handleLogin"
      >
        登录
      </el-button>

      <p class="tip">无密码登录，后端按请求头 user 识别身份（用户需已存在）</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  padding: var(--space-6);
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-8);
  box-shadow: var(--shadow-md);
  animation: fade-up 0.5s var(--ease-out) both;

  .login-brand {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    margin-bottom: var(--space-8);

    .mark {
      width: 46px;
      height: 46px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      background: var(--brand);

      svg {
        width: 24px;
        height: 24px;
        fill: #fff;
      }
    }

    .brand-text {
      h1 {
        margin: 0 0 2px;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: var(--text-main);
      }
      p {
        margin: 0;
        font-size: 12.5px;
        color: var(--text-sub);
      }
    }
  }

  .input-prefix {
    color: var(--text-faint);
    font-size: 13px;
    font-weight: 600;
  }

  .login-btn {
    width: 100%;
    margin-top: var(--space-5);
  }

  .tip {
    margin: var(--space-4) 0 0;
    font-size: 12px;
    color: var(--text-faint);
    text-align: center;
    line-height: 1.6;
  }
}

@media (max-width: 640px) {
  .login-card {
    padding: var(--space-8) var(--space-5);
  }
}
</style>