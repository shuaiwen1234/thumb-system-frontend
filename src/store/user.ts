import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { USER_STORAGE_KEY, type StoredUser } from '@/utils/request'

/**
 * 用户登录态 store
 * - 持久化到 localStorage（key 与 request.ts 拦截器保持一致）
 * - request 拦截器每次请求从 localStorage 读 user 头，二者共用同一份数据
 */
export const useUserStore = defineStore('user', () => {
  const user = ref<StoredUser | null>(null)

  // 初始化：从 localStorage 恢复登录态
  const raw = localStorage.getItem(USER_STORAGE_KEY)
  if (raw) {
    try {
      user.value = JSON.parse(raw) as StoredUser
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  }

  const isLoggedIn = computed(() => user.value !== null)
  const userId = computed(() => user.value?.userId ?? null)
  const userName = computed(() => user.value?.userName ?? '')

  /** 登录成功：写入内存 + localStorage */
  function setLogin(u: StoredUser) {
    user.value = u
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u))
  }

  /** 退出登录：清空内存 + localStorage */
  function logout() {
    user.value = null
    localStorage.removeItem(USER_STORAGE_KEY)
  }

  return { user, isLoggedIn, userId, userName, setLogin, logout }
})