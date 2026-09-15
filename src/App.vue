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
        <router-link to="/" class="brand" aria-label="文的点赞系统首页">
          <span class="brand-mark">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </span>
          <span class="brand-name">文的点赞</span>
        </router-link>

        <nav class="nav-links" aria-label="主导航">
          <router-link to="/" class="nav-item" exact-active-class="is-active">首页</router-link>
          <router-link to="/publish" class="nav-item" active-class="is-active">发布</router-link>
          <router-link to="/mine" class="nav-item" active-class="is-active">我的</router-link>
        </nav>

        <div class="nav-right">
          <template v-if="userStore.isLoggedIn">
            <div class="user-chip">
              <span class="avatar">{{ (userStore.userName || 'W').slice(0, 1).toUpperCase() }}</span>
              <span class="name">{{ userStore.userName || `用户 ${userStore.userId}` }}</span>
            </div>
            <el-button link class="logout" @click="handleLogout">退出</el-button>
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
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="app-footer">
      <span>文的点赞系统 · 高并发点赞技术实践</span>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: var(--z-nav);
  background: rgba(255, 253, 248, 0.82);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid var(--border);

  .navbar-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-5);
    height: 60px;
    display: flex;
    align-items: center;
    gap: var(--space-5);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-weight: 700;
    font-size: 16px;
    color: var(--text-main);
    letter-spacing: -0.01em;
    flex-shrink: 0;

    .brand-mark {
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-sm);
      background: var(--brand);
      transition: transform 0.25s var(--ease-out);

      svg {
        width: 15px;
        height: 15px;
        fill: #fff;
      }
    }

    &:hover .brand-mark {
      transform: rotate(-8deg) scale(1.08);
    }
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    flex: 1;

    .nav-item {
      padding: 6px 14px;
      border-radius: var(--radius-full);
      font-size: 14px;
      font-weight: 500;
      color: var(--text-sub);
      transition:
        color 0.2s var(--ease-out),
        background-color 0.2s var(--ease-out);

      &:hover {
        color: var(--text-main);
        background: var(--gray-100);
      }

      &.is-active {
        color: var(--brand);
        background: var(--brand-soft);
      }
    }
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-shrink: 0;

    .user-chip {
      display: flex;
      align-items: center;
      gap: var(--space-2);

      .avatar {
        width: 28px;
        height: 28px;
        border-radius: var(--radius-full);
        background: var(--brand-soft);
        color: var(--brand);
        font-size: 12px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .name {
        font-size: 13px;
        font-weight: 500;
        color: var(--text-main);
        max-width: 90px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .logout {
      color: var(--text-faint);
      font-size: 13px;
    }
  }
}

.app-main {
  flex: 1;
}

.app-footer {
  border-top: 1px solid var(--border);
  padding: var(--space-6) var(--space-5);
  text-align: center;
  color: var(--text-faint);
  font-size: 12.5px;
}

// 移动端：导航收缩，隐藏用户名
@media (max-width: 640px) {
  .navbar-inner {
    gap: var(--space-3);
  }
  .brand-name {
    display: none;
  }
  .nav-links .nav-item {
    padding: 6px 10px;
    font-size: 13px;
  }
  .user-chip .name {
    display: none;
  }
}
</style>