<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { BlogVO } from '@/types'
import ThumbButton from './ThumbButton.vue'

const props = defineProps<{
  blog: BlogVO
  /** 列表序号，用于入场 stagger（0 起） */
  index?: number
}>()

const emit = defineEmits<{
  (e: 'thumb-change', payload: { blogId: number; thumbCount: number; hasThumb: boolean }): void
}>()

const router = useRouter()

const delayStyle = computed(() => ({
  animationDelay: `${(props.index ?? 0) * 50}ms`,
}))

/** 摘要：content 截取首段，去换行，再截 80 字 */
const summary = computed(() => {
  const c = (props.blog.content ?? '').replace(/\s+/g, ' ').trim()
  return c.length > 80 ? c.slice(0, 80) + '…' : c
})

const cover = computed(() => props.blog.coverImg || '')

/** 发布时间（友好格式） */
const timeText = computed(() => {
  const t = props.blog.createTime
  if (!t) return ''
  return t.replace('T', ' ').slice(0, 16)
})

function goDetail() {
  router.push(`/blog/${props.blog.id}`)
}
</script>

<template>
  <article class="blog-card" :style="delayStyle" tabindex="0" @click="goDetail" @keyup.enter="goDetail">
    <!-- 封面：无图用干净的占位（规则几何纹，非 emoji） -->
    <div class="cover-wrap">
      <img v-if="cover" class="cover" :src="cover" :alt="blog.title" loading="lazy" />
      <div v-else class="cover cover-fallback">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13zM8 9.5A1.5 1.5 0 1 0 8 6.5a1.5 1.5 0 0 0 0 3zm11 8.5l-4.5-4.5L8 20h10.5a.5.5 0 0 0 .5-.5V18z"
          />
        </svg>
      </div>
    </div>

    <div class="body">
      <h3 class="title">{{ blog.title }}</h3>
      <p class="summary">{{ summary }}</p>

      <footer class="meta">
        <time class="time" :datetime="blog.createTime">{{ timeText }}</time>
        <ThumbButton
          :blog-id="blog.id"
          :thumb-count="blog.thumbCount"
          :has-thumb="blog.hasThumb"
          @click.stop
          @thumb-change="emit('thumb-change', $event)"
        />
      </footer>
    </div>
  </article>
</template>

<style scoped lang="scss">
.blog-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  animation: card-in 0.5s var(--ease-out) both;
  box-shadow: var(--shadow-xs);
  transition:
    transform 0.25s var(--ease-out),
    box-shadow 0.25s var(--ease-out),
    border-color 0.25s var(--ease-out);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--gray-300);
  }

  &:focus-visible {
    outline: 2px solid var(--brand-400);
    outline-offset: 2px;
  }

  .cover-wrap {
    aspect-ratio: 16 / 9;
    background: var(--gray-100);
    overflow: hidden;
  }

  .cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s var(--ease-out);
  }

  &:hover .cover {
    transform: scale(1.05);
  }

  .cover-fallback {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 40px;
      height: 40px;
      fill: var(--gray-300);
    }
  }

  .body {
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
  }

  .title {
    margin: 0 0 var(--space-2);
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--text-main);
    letter-spacing: -0.01em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 44px;
    transition: color 0.2s var(--ease-out);
    text-wrap: balance;
  }

  &:hover .title {
    color: var(--brand);
  }

  .summary {
    margin: 0 0 var(--space-4);
    font-size: 13.5px;
    color: var(--text-sub);
    line-height: 1.7;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 46px;
  }

  .meta {
    margin-top: auto;
    padding-top: var(--space-3);
    border-top: 1px solid var(--gray-100);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);

    .time {
      font-size: 12px;
      color: var(--text-faint);
    }
  }
}
</style>