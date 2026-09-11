<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { BlogVO } from '@/types'
import ThumbButton from './ThumbButton.vue'

const props = defineProps<{
  blog: BlogVO
}>()

const router = useRouter()

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
  <div class="blog-card" @click="goDetail">
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
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .cover-wrap {
    aspect-ratio: 16 / 9;
    background: var(--cover-bg);
  }

  .cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .cover-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-faint);
  }

  .body {
    padding: 14px;
  }

  .title {
    margin: 0 0 8px;
    font-size: 16px;
    color: var(--text-main);
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
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