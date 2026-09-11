<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { BlogVO } from '@/types'
import ThumbButton from './ThumbButton.vue'

const props = defineProps<{
  blog: BlogVO
  /** 列表中的序号，用于入场 stagger（0 起） */
  index?: number
}>()

const router = useRouter()

/** 入场延迟：每个卡片错开 60ms，形成瀑布式出现 */
const delayStyle = computed(() => ({
  animationDelay: `${(props.index ?? 0) * 60}ms`,
}))

/** 摘要：content 前 80 字 */
const summary = computed(() => {
  const c = props.blog.content ?? ''
  return c.length > 80 ? c.slice(0, 80) + '…' : c
})

/** 封面：无图用占位 */
const cover = computed(() => props.blog.coverImg || '')

function goDetail() {
  router.push(`/blog/${props.blog.id}`)
}
</script>

<template>
  <div class="blog-card" :style="delayStyle" @click="goDetail">
    <div class="cover-wrap">
      <template v-if="cover">
        <img class="cover" :src="cover" :alt="blog.title" loading="lazy" />
      </template>
      <template v-else>
        <div class="cover cover-placeholder">
          <el-icon :size="36"><Picture /></el-icon>
        </div>
      </template>
    </div>

    <div class="body">
      <h3 class="title">{{ blog.title }}</h3>
      <p class="summary">{{ summary }}</p>

      <div class="meta">
        <span class="time">{{ blog.createTime?.replace('T', ' ').slice(0, 16) }}</span>
        <ThumbButton
          :blog-id="blog.id"
          :thumb-count="blog.thumbCount"
          :has-thumb="blog.hasThumb"
          @click.stop
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.blog-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  animation: card-in 0.5s var(--ease-out) both;
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.25s var(--ease-out),
    box-shadow 0.25s var(--ease-out),
    border-color 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: #d9ddeb;
  }

  .cover-wrap {
    aspect-ratio: 16 / 9;
    background: var(--cover-bg);
    overflow: hidden;
  }

  .cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s var(--ease-out);
  }

  // 封面缓慢 zoom（进入详情前的微妙预告，克制到 6%）
  &:hover .cover {
    transform: scale(1.06);
  }

  .cover-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-faint);
  }

  .body {
    padding: 16px;
  }

  .title {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-main);
    letter-spacing: -0.01em;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.2s ease;
  }

  &:hover .title {
    color: var(--brand);
  }

  .summary {
    margin: 0 0 12px;
    font-size: 13px;
    color: var(--text-sub);
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 42px;
  }

  .meta {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .time {
      font-size: 12px;
      color: var(--text-faint);
    }
  }
}
</style>