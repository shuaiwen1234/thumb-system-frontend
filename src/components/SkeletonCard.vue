<script setup lang="ts">
/**
 * 博客卡片骨架屏：贴合 BlogCard 的最终布局形状
 * （封面 16:9 + 标题行 + 摘要两行 + meta 行）
 */
</script>

<template>
  <div class="skeleton-card">
    <el-skeleton animated>
      <template #template>
        <div class="sk-cover">
          <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
        </div>
        <div class="sk-body">
          <el-skeleton-item variant="h3" style="width: 72%" />
          <el-skeleton-item variant="text" style="margin-top: 12px; width: 100%" />
          <el-skeleton-item variant="text" style="margin-top: 8px; width: 60%" />
          <div class="sk-meta">
            <el-skeleton-item variant="text" style="width: 90px; height: 14px" />
            <el-skeleton-item variant="circle" style="width: 28px; height: 28px" />
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped lang="scss">
.skeleton-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;

  .sk-cover {
    aspect-ratio: 16 / 9;
  }

  .sk-body {
    padding: var(--space-5);

    .sk-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: var(--space-4);
    }
  }
}
</style>