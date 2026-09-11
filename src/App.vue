<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

async function handleLogout() {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '退出',
      cancelButtonText: '取消',
      type: 'warning',
    })
    userStore.logout()
    router.push('/')
  } catch {
    // 用户取消，不处理
  }
}
</script>

<template>
  <div class="app-shell">
    <header class="navbar">
      <div class="navbar-inner">
        <router-link to="/" class="logo">
          <svg class="logo-mark" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
            />
          </svg>
          <span>文的点赞系统</span>
        </router-link>

        <nav class="nav-links">
          <router-link to="/" class="nav-item">首页</router-link>
          <router-link to="/publish" class="nav-item">发布博客</router-link>
          <router-link to="/mine" class="nav-item">我的博客</router-link>
        </nav>

        <div class="nav-right">
          <template v-if="userStore.isLoggedIn">
            <span class="current-user">
              {{ userStore.userName || `用户 ${userStore.userId}` }}
            </span>
            <el-button link type="danger" @click="handleLogout">退出</el-button>
          </template>
          <template v-else>
            <el-button
              type="primary"
              size="small"
              round
              @click="router.push({ path: '/login', query: { redirect: route.fullPath } })"
            >
              登录
            </el-button>
          </template>
        </div>
      </div>
    </header>

    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  // 毛玻璃材质：偏淡紫的半透明，与雾面背景融合（而非刺眼纯白）
  background: rgba(250, 250, 255, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(99, 102, 241, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;

  .navbar-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    height: 64px;
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    font-size: 18px;
    color: var(--brand);
    letter-spacing: -0.02em;

    .logo-mark {
      width: 22px;
      height: 22px;
      fill: var(--brand);
      flex-shrink: 0;
      transition: transform 0.25s var(--ease-out);
    }

    &:hover .logo-mark {
      transform: rotate(-12deg) scale(1.1);
    }
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;

    .nav-item {
      color: var(--text-sub);
      font-size: 14px;
      font-weight: 500;
      padding: 7px 16px;
      border-radius: 999px;
      transition:
        color 0.2s ease,
        background-color 0.2s ease;
      &:hover {
        color: var(--brand);
        background: var(--brand-soft);
      }
      // 当前路由高亮（Vue Router 默认给命中的 router-link 加 .router-link-exact-active）
      &.router-link-exact-active {
        background: var(--brand);
        color: #fff;
      }
    }
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 12px;

    .current-user {
      font-size: 14px;
      color: var(--text-main);
      font-weight: 500;
    }
  }
}

.app-main {
  flex: 1;
}
</style>