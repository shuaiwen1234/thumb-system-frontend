<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { doThumb, undoThumb } from '@/api/thumb'
import { useUserStore } from '@/store/user'

/**
 * 点赞按钮（带状态 + 微动效）
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
// 点赞成功的瞬时脉冲（放大心形），100ms 后回落
const pulse = ref(false)

const displayCount = computed(() => props.thumbCount)
const displayHasThumb = computed(() => props.hasThumb)

async function toggle() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }

  const now = Date.now()
  if (now - lastClick.value < 1000 || loading.value) return
  lastClick.value = now

  loading.value = true

  const nextHasThumb = !displayHasThumb.value
  const nextCount = displayCount.value + (nextHasThumb ? 1 : -1)

  try {
    if (nextHasThumb) {
      await doThumb(props.blogId)
    } else {
      await undoThumb(props.blogId)
    }
    emit('thumb-change', {
      blogId: props.blogId,
      thumbCount: nextCount,
      hasThumb: nextHasThumb,
    })
    // 点赞成功脉冲
    if (nextHasThumb) {
      pulse.value = true
      setTimeout(() => (pulse.value = false), 120)
    }
    ElMessage.success(nextHasThumb ? '点赞成功' : '已取消点赞')
  } catch {
    // 错误提示已由 request.ts 响应拦截器统一处理，这里不再重复弹
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button
    class="thumb-btn"
    :class="{ active: displayHasThumb, pulse: pulse }"
    :disabled="loading"
    :aria-pressed="displayHasThumb"
    :aria-label="displayHasThumb ? '取消点赞' : '点赞'"
    @click.stop="toggle"
  >
    <svg
      class="icon"
      :class="{ active: displayHasThumb }"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
    <span class="count">{{ displayCount }}</span>
  </button>
</template>

<style scoped lang="scss">
.thumb-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid var(--border);
  background: var(--card-bg);
  border-radius: var(--radius-full);
  padding: 4px 12px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-sub);
  transition:
    border-color 0.2s var(--ease-out),
    color 0.2s var(--ease-out),
    background-color 0.2s var(--ease-out),
    transform 0.2s var(--ease-out);

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    border-color: var(--brand-400);
    color: var(--brand);
  }

  &.active {
    border-color: var(--love);
    background: var(--love-soft);
    color: var(--love);
  }

  .icon {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition:
      fill 0.25s var(--ease-out),
      transform 0.4s var(--ease-spring);

    &.active {
      fill: currentColor;
      transform: scale(1.1);
    }
  }

  // 点赞成功脉冲：心形瞬间放大后回落
  &.pulse .icon {
    transform: scale(1.35);
    transition: transform 0.4s var(--ease-spring);
  }

  .count {
    font-variant-numeric: tabular-nums;
  }
}
</style>