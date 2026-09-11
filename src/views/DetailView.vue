<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBlogDetail, deleteBlog } from '@/api/blog'
import type { BlogVO } from '@/types'
import { useUserStore } from '@/store/user'
import ThumbButton from '@/components/ThumbButton.vue'

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
      // blogId 为空或博客不存在返回空对象/异常
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
    // 取消或失败（失败提示由拦截器处理）
  }
}

onMounted(fetchDetail)

const paragraphs = () => (blog.value?.content || '').split('\n').filter((p) => p.trim() !== '')
</script>

<template>
  <div class="page-container detail-page">
    <el-button link @click="router.push('/')">← 返回列表</el-button>

    <!-- 加载 -->
    <div v-if="loading" class="detail-loading">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 错误态 -->
    <div v-else-if="error || !blog" class="empty-state">
      <el-icon :size="40" class="empty-icon"><WarningFilled /></el-icon>
      <p>博客不存在或加载失败</p>
      <el-button type="primary" @click="router.push('/')">返回列表</el-button>
    </div>

    <!-- 详情 -->
    <article v-else class="article">
      <template v-if="blog.coverImg">
        <img class="article-cover" :src="blog.coverImg" :alt="blog.title" />
      </template>

      <h1 class="article-title">{{ blog.title }}</h1>

      <div class="article-meta">
        <span>{{ blog.createTime?.replace('T', ' ').slice(0, 16) }}</span>
        <span v-if="blog.userId !== undefined">作者：用户 {{ blog.userId }}</span>
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
        <el-button type="danger" size="small" @click="handleDelete">删除</el-button>
      </div>

      <div class="article-content">
        <p v-for="(p, i) in paragraphs()" :key="i" class="paragraph">{{ p }}</p>
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss">
.detail-page {
  max-width: 800px;
}

.detail-loading {
  margin-top: 20px;
}

.empty-state {
  text-align: center;
  padding: 80px 0;
  color: var(--text-sub);
  .empty-icon {
    color: var(--text-faint);
    margin-bottom: 8px;
  }
  p {
    margin: 0 0 16px;
  }
}

.article {
  margin-top: 20px;
}

.article-cover {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 24px;
}

.article-title {
  margin: 0 0 16px;
  font-size: 28px;
  color: var(--text-main);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--text-faint);
  font-size: 13px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.author-actions {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
}

.article-content {
  border-top: 1px solid var(--border);
  padding-top: 24px;

  .paragraph {
    margin: 0 0 16px;
    font-size: 15px;
    line-height: 1.8;
    color: var(--text-main);
    white-space: pre-wrap;
  }
}
</style>