<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { doThumb, undoThumb } from '@/api/thumb'
import { useUserStore } from '@/store/user'

/**
 * 点赞按钮（带状态）
 * - 未登录：点击提示登录并跳转 /login
 * - 已登录：乐观更新 + 失败回滚，1 秒防抖
 */
const props = defineProps<{
  blogId: number
  thumbCount: number
  hasThumb: boolean
}>()

const emit = defineEmits<{
  (e: 'thumb-change', payload: { blogId: number; thumbCount: number; hasThumb: boolean }): void
}>()

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const lastClick = ref(0)

// 本地乐观状态（props 为准，内部不另存副本，状态回滚由父组件通过 props 下发）
const displayCount = computed(() => props.thumbCount)
const displayHasThumb = computed(() => props.hasThumb)

async function toggle() {
  // 未登录拦截
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }

  // 1 秒防抖
  const now = Date.now()
  if (now - lastClick.value < 1000 || loading.value) return
  lastClick.value = now

  loading.value = true

  const nextHasThumb = !displayHasThumb.value
  const nextCount = displayCount.value + (nextHasThumb ? 1 : -1)

  try {
    // 调真实接口
    if (nextHasThumb) {
      await doThumb(props.blogId)
    } else {
      await undoThumb(props.blogId)
    }
    // 成功后通知父组件同步（含列表/详情全局状态）
    emit('thumb-change', {
      blogId: props.blogId,
      thumbCount: nextCount,
      hasThumb: nextHasThumb,
    })
    ElMessage.success(nextHasThumb ? '点赞成功' : '已取消点赞')
  } catch {
    // 失败：不改变状态（乐观更新在父组件侧提交，此处直接放弃）
    ElMessage.error('操作失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button
    class="thumb-btn"
    :class="{ active: displayHasThumb }"
    :disabled="loading"
    @click.stop="toggle"
  >
    <span class="icon" :class="{ 'bump': displayHasThumb }">{{ displayHasThumb ? '❤️' : '🤍' }}</span>
    <span class="count">{{ displayCount }}</span>
  </button>
</template>

<style scoped lang="scss">
.thumb-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--border);
  background: var(--card-bg);
  border-radius: 999px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-sub);
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    border-color: var(--brand);
    color: var(--brand);
  }

  &.active {
    border-color: #f43f5e;
    background: #fff1f2;
    color: #f43f5e;
  }

  .icon {
    font-size: 15px;
    line-height: 1;
    transition: transform 0.2s ease;

    &.bump {
      animation: bump 0.3s ease;
    }
  }
}

@keyframes bump {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
}
</style>