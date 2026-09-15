<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBlogList } from '@/api/blog'
import type { BlogVO } from '@/types'
import BlogCard from '@/components/BlogCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const list = ref<BlogVO[]>([])
const loading = ref(true)
const error = ref(false)

async function fetchList() {
  loading.value = true
  error.value = false
  try {
    const res = await getBlogList()
    list.value = res.data ?? []
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

function handleThumbChange(payload: { blogId: number; thumbCount: number; hasThumb: boolean }) {
  const target = list.value.find((b) => b.id === payload.blogId)
  if (target) {
    target.thumbCount = payload.thumbCount
    target.hasThumb = payload.hasThumb
  }
}

onMounted(fetchList)
</script>

<template>
  <div class="home">
    <!-- 页头：建立视觉焦点 -->
    <section class="hero">
      <div class="hero-inner">
        <p class="hero-eyebrow">THUMB SYSTEM</p>
        <h1 class="hero-title">发现值得点赞的内容</h1>
        <p class="hero-sub">一个高并发点赞系统的实践场，阅读技术思考，点下你的赞。</p>
      </div>
    </section>

    <div class="page-container">
      <!-- 加载骨架 -->
      <div v-if="loading" class="grid">
        <SkeletonCard v-for="i in 6" :key="i" />
      </div>

      <!-- 错误态 -->
      <EmptyState
        v-else-if="error"
        icon="WarningFilled"
        title="加载失败"
        desc="后端可能未就绪，或接口暂时不可用。"
      >
        <template #action>
          <el-button type="primary" @click="fetchList">重试</el-button>
        </template>
      </EmptyState>

      <!-- 空态 -->
      <EmptyState
        v-else-if="list.length === 0"
        icon="Document"
        title="还没有内容"
        desc="第一篇博客正在路上，先来发布点什么吧。"
      >
        <template #action>
          <el-button type="primary" @click="$router.push('/publish')">去发布</el-button>
        </template>
      </EmptyState>

      <!-- 列表 -->
      <div v-else class="grid">
        <BlogCard
          v-for="(blog, i) in list"
          :key="blog.id"
          :blog="blog"
          :index="i"
          @thumb-change="handleThumbChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  // hero 独立撑满宽，负 margin 压到导航下形成视觉焦点
  .hero {
    border-bottom: 1px solid var(--border);
    background:
      radial-gradient(800px 300px at 20% 0%, rgba(194, 65, 12, 0.12), transparent 70%),
      var(--gray-50);

    .hero-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-12) var(--space-5) var(--space-10);
    }

    .hero-eyebrow {
      margin: 0 0 var(--space-3);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.14em;
      color: var(--brand);
      text-transform: uppercase;
    }

    .hero-title {
      margin: 0 0 var(--space-3);
      font-size: 34px;
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.15;
      color: var(--text-main);
      text-wrap: balance;
    }

    .hero-sub {
      margin: 0;
      font-size: 15px;
      color: var(--text-sub);
      max-width: 48ch;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-5);
  }
}

@media (max-width: 640px) {
  .hero-inner {
    padding-top: var(--space-8) !important;
    padding-bottom: var(--space-8) !important;
  }
  .hero-title {
    font-size: 26px !important;
  }
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>