<script setup lang="ts">
/**
 * 通用空态 / 提示态组件
 * - 用于"无数据"、"加载失败"等非内容态
 * - icon 传 Element Plus 图标组件名，title/desc 为文案，action 插槽放按钮
 */
defineProps<{
  icon?: string
  title?: string
  desc?: string
}>()
</script>

<template>
  <div class="empty-state">
    <div v-if="icon" class="empty-icon">
      <el-icon :size="44"><component :is="icon" /></el-icon>
    </div>
    <h3 v-if="title" class="empty-title">{{ title }}</h3>
    <p v-if="desc" class="empty-desc">{{ desc }}</p>
    <div v-if="$slots.action" class="empty-action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-12) var(--space-4);
  animation: fade-up 0.4s var(--ease-out) both;

  .empty-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-xl);
    background: var(--gray-100);
    color: var(--gray-400);
    margin-bottom: var(--space-5);
  }

  .empty-title {
    margin: 0 0 var(--space-2);
    font-size: 17px;
    font-weight: 600;
    color: var(--gray-700);
    letter-spacing: -0.01em;
  }

  .empty-desc {
    margin: 0 0 var(--space-5);
    font-size: 14px;
    color: var(--gray-400);
    max-width: 36ch;
    line-height: 1.7;
  }

  .empty-action {
    display: flex;
    gap: var(--space-3);
  }
}
</style>