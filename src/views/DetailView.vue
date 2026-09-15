<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBlogDetail, deleteBlog } from '@/api/blog'
import type { BlogVO } from '@/types'
import { useUserStore } from '@/store/user'
import ThumbButton from '@/components/ThumbButton.vue'
import EmptyState from '@/components/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const blog = ref<BlogVO | null>(null)
const loading = ref(true)
const error = ref(false)

const isAuthor = () => blog.value?.userId !== undefined && blog.value.userId === userStore.userId

async function fetchDetail() {
  loading.value = true
  error.value = false
  const id = Number(route.params.id)
  try {
    const res = await getBlogDetail(id)
    if (res.data && res.data.id !== undefined && res.data.id !== null) {
      blog.value = res.data
    } else {
      error.value = true
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

function handleThumbChange(payload: { blogId: number; thumbCount: number; hasThumb: boolean }) {
  if (blog.value) {
    blog.value.thumbCount = payload.thumbCount
    blog.value.hasThumb = payload.hasThumb
  }
}

function goEdit() {
  router.push(`/blog/${blog.value!.id}/edit`)
}

async function handleDelete() {
  if (!blog.value) return
  try {
    await ElMessageBox.confirm('删除后不可恢复，确定删除这篇博客吗？', '提示', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteBlog(blog.value.id)
    ElMessage.success('删除成功')
    router.push('/')
  } catch {
    // 取消或失败
  }
}

onMounted(fetchDetail)

const paragraphs = () => (blog.value?.content || '').split('\n').filter((p) => p.trim() !== '')
</script>

<template>
  <div class="page-container detail-page">
    <el-button link class="back" @click="router.push('/')">
      <el-icon><ArrowLeft /></el-icon> 返回列表
    </el-button>

    <!-- 加载 -->
    <div v-if="loading" class="detail-loading">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 错误态 -->
    <EmptyState
      v-else-if="error || !blog"
      icon="WarningFilled"
      title="内容不存在"
      desc="这篇博客可能已被删除，或加载失败。"
    >
      <template #action>
        <el-button type="primary" @click="router.push('/')">返回列表</el-button>
      </template>
    </EmptyState>

    <!-- 详情 -->
    <article v-else class="article">
      <img v-if="blog.coverImg" class="article-cover" :src="blog.coverImg" :alt="blog.title" />

      <h1 class="article-title">{{ blog.title }}</h1>

      <div class="article-meta">
        <time>{{ blog.createTime?.replace('T', ' ').slice(0, 16) }}</time>
        <span class="dot">·</span>
        <ThumbButton
          :blog-id="blog.id"
          :thumb-count="blog.thumbCount"
          :has-thumb="blog.hasThumb"
          @thumb-change="handleThumbChange"
        />
      </div>

      <!-- 作者操作 -->
      <div v-if="isAuthor()" class="author-actions">
        <el-button type="primary" size="small" @click="goEdit">编辑</el-button>
        <el-button type="danger" size="small" plain @click="handleDelete">删除</el-button>
      </div>

      <div class="article-content">
        <p v-for="(p, i) in paragraphs()" :key="i" class="paragraph">{{ p }}</p>
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss">
.detail-page {
  max-width: 760px;
}

.back {
  margin-bottom: var(--space-4);
  color: var(--text-sub);
  font-size: 13px;
}

.detail-loading {
  margin-top: var(--space-4);
}

.article {
  margin-top: var(--space-2);
  animation: fade-up 0.5s var(--ease-out) both;
}

.article-cover {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-8);
  box-shadow: var(--shadow-md);
}

.article-title {
  margin: 0 0 var(--space-4);
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: var(--text-main);
  text-wrap: balance;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--text-faint);
  font-size: 13px;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--gray-100);

  .dot {
    color: var(--gray-300);
  }
}

.author-actions {
  margin-bottom: var(--space-6);
  display: flex;
  gap: var(--space-2);
}

.article-content {
  .paragraph {
    margin: 0 0 var(--space-4);
    font-size: 16px;
    line-height: 1.9;
    color: var(--gray-700);
    white-space: pre-wrap;
    text-wrap: pretty;
  }
}

@media (max-width: 640px) {
  .article-title {
    font-size: 26px !important;
  }
  .article-content .paragraph {
    font-size: 15px;
  }
}
</style>