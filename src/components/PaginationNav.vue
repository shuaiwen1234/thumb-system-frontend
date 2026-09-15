<script setup lang="ts">
import { computed } from 'vue'

/**
 * 页码分页导航（适配「无 total」的后端分页）
 * - page：当前页
 * - maxReached：已探索到的最大页码（决定渲染多少页号）
 * - hasNext：是否还有下一页（当前页满额时 true）
 * - 点击页号 / 上一页 / 下一页触发 change
 */
const props = defineProps<{
  page: number
  maxReached: number
  hasNext: boolean
}>()

const emit = defineEmits<{
  (e: 'change', page: number): void
}>()

// 渲染 1..maxReached 的页号
const pages = computed(() => {
  const arr: number[] = []
  for (let i = 1; i <= props.maxReached; i++) arr.push(i)
  return arr
})

function go(p: number) {
  if (p === props.page) return
  emit('change', p)
}
</script>

<template>
  <nav class="pager" aria-label="分页导航">
    <button
      class="pg-btn nav"
      :disabled="page <= 1"
      @click="go(page - 1)"
    >
      上一页
    </button>

    <button
      v-for="p in pages"
      :key="p"
      class="pg-btn num"
      :class="{ active: p === page }"
      :aria-current="p === page ? 'page' : undefined"
      @click="go(p)"
    >
      {{ p }}
    </button>

    <button
      class="pg-btn nav"
      :disabled="!hasNext"
      @click="go(page + 1)"
    >
      下一页
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-8);
  flex-wrap: wrap;
}

.pg-btn {
  min-width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  border: 1px solid var(--border);
  background: var(--card-bg);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-sub);
  cursor: pointer;
  transition:
    border-color 0.2s var(--ease-out),
    color 0.2s var(--ease-out),
    background-color 0.2s var(--ease-out);

  &:hover:not(:disabled) {
    border-color: var(--brand-400);
    color: var(--brand);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &.nav {
    padding: 0 14px;
  }

  &.num.active {
    background: var(--brand);
    border-color: var(--brand);
    color: #fff;
  }
}
</style>