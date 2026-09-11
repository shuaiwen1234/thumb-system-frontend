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
          <span class="logo-mark">👍</span>
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
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;

  .navbar-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    height: 60px;
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

    .logo-mark {
      font-size: 22px;
    }
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;

    .nav-item {
      color: var(--text-sub);
      font-size: 14px;
      padding: 6px 16px;
      border-radius: 999px;
      transition: all 0.2s ease;
      &:hover {
        color: var(--brand);
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