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
      <div class="logo">
        <svg class="mark" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
          />
        </svg>
        <h1>文的点赞系统</h1>
      </div>
      <p class="sub">输入用户 ID 登录（无密码，后端按请求头 user 识别身份）</p>

      <el-input
        v-model="userIdInput"
        placeholder="请输入用户 ID，例如 1"
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
        登 录
      </el-button>

      <div class="tip">
        还没有账号？任意数字 ID 均可尝试登录（用户需已存在于后端）
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 40px 32px;
  text-align: center;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;

    .mark {
      width: 28px;
      height: 28px;
      fill: var(--brand);
    }
    h1 {
      margin: 0;
      font-size: 22px;
      color: var(--brand);
    }
  }

  .sub {
    margin: 0 0 28px;
    font-size: 13px;
    color: var(--text-sub);
  }

  .input-prefix {
    color: var(--text-faint);
    font-size: 13px;
  }

  .login-btn {
    width: 100%;
    margin-top: 20px;
  }

  .tip {
    margin-top: 16px;
    font-size: 12px;
    color: var(--text-faint);
  }
}
</style>