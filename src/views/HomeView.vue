<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBlogList } from '@/api/blog'
import type { BlogVO } from '@/types'
import BlogCard from '@/components/BlogCard.vue'

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
  <div class="page-container">
    <h2 class="page-title">精选博客</h2>

    <!-- 加载骨架 -->
    <div v-if="loading" class="grid">
      <el-skeleton v-for="i in 6" :key="i" animated class="skeleton-card">
        <template #template>
          <el-skeleton-item variant="image" class="skeleton-cover" />
          <div class="skeleton-body">
            <el-skeleton-item variant="h3" style="width: 60%" />
            <el-skeleton-item variant="text" style="margin-top: 10px" />
            <el-skeleton-item variant="text" style="width: 80%; margin-top: 6px" />
          </div>
        </template>
      </el-skeleton>
    </div>

    <!-- 错误态 -->
    <div v-else-if="error" class="empty-state">
      <p>😵 加载失败，可能后端未就绪或未登录放行未生效</p>
      <el-button type="primary" @click="fetchList">重试</el-button>
    </div>

    <!-- 空态 -->
    <div v-else-if="list.length === 0" class="empty-state">
      <p>📭 还没有博客，快去发布第一篇吧</p>
    </div>

    <!-- 列表 -->
    <div v-else class="grid">
      <BlogCard
        v-for="blog in list"
        :key="blog.id"
        :blog="blog"
        @thumb-change="handleThumbChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-title {
  margin: 0 0 20px;
  font-size: 24px;
  color: var(--text-main);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.skeleton-card {
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;

  .skeleton-cover {
    width: 100%;
    aspect-ratio: 16 / 9;
  }
  .skeleton-body {
    padding: 14px;
  }
}

.empty-state {
  text-align: center;
  padding: 80px 0;
  color: var(--text-sub);

  p {
    margin: 0 0 16px;
    font-size: 15px;
  }
}
</style>