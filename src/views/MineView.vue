<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMyBlogList, deleteBlog } from '@/api/blog'
import type { BlogVO } from '@/types'

const router = useRouter()

const list = ref<BlogVO[]>([])
const loading = ref(true)
const error = ref(false)

async function fetchList() {
  loading.value = true
  error.value = false
  try {
    const res = await getMyBlogList()
    list.value = res.data ?? []
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

async function handleDelete(blog: BlogVO) {
  try {
    await ElMessageBox.confirm(`确定删除《${blog.title}》吗？`, '提示', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteBlog(blog.id)
    ElMessage.success('删除成功')
    // 从列表移除
    list.value = list.value.filter((b) => b.id !== blog.id)
  } catch {
    // 取消或失败
  }
}

function goEdit(blog: BlogVO) {
  router.push(`/blog/${blog.id}/edit`)
}

function goDetail(blog: BlogVO) {
  router.push(`/blog/${blog.id}`)
}

onMounted(fetchList)
</script>

<template>
  <div class="page-container">
    <h2 class="page-title">我的博客</h2>

    <div v-if="loading" class="grid">
      <el-skeleton v-for="i in 4" :key="i" animated class="skeleton-card" />
    </div>

    <div v-else-if="error" class="empty-state">
      <el-icon :size="40" class="empty-icon"><WarningFilled /></el-icon>
      <p>加载失败，后端「我的列表」接口可能未就绪</p>
      <el-button type="primary" @click="fetchList">重试</el-button>
    </div>

    <div v-else-if="list.length === 0" class="empty-state">
      <el-icon :size="40" class="empty-icon"><Document /></el-icon>
      <p>你还没有发布过博客</p>
      <el-button type="primary" @click="router.push('/publish')">去发布</el-button>
    </div>

    <div v-else class="list">
      <div v-for="blog in list" :key="blog.id" class="mine-item">
        <div class="mine-main" @click="goDetail(blog)">
          <template v-if="blog.coverImg">
            <img class="mine-cover" :src="blog.coverImg" :alt="blog.title" />
          </template>
          <template v-else>
            <div class="mine-cover placeholder">
              <el-icon :size="22"><Picture /></el-icon>
            </div>
          </template>
          <div class="mine-body">
            <h3 class="mine-title">{{ blog.title }}</h3>
            <span class="mine-time">{{ blog.createTime?.replace('T', ' ').slice(0, 16) }}</span>
          </div>
        </div>
        <div class="mine-actions">
          <el-button size="small" @click="goDetail(blog)">查看</el-button>
          <el-button size="small" type="primary" @click="goEdit(blog)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(blog)">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-title {
  margin: 0 0 20px;
  font-size: 24px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.skeleton-card {
  height: 200px;
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

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mine-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  gap: 16px;

  .mine-main {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    cursor: pointer;
    min-width: 0;
  }

  .mine-cover {
    width: 80px;
    height: 56px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background: var(--cover-bg);
    color: var(--text-faint);
  }

  .mine-body {
    min-width: 0;

    .mine-title {
      margin: 0 0 4px;
      font-size: 15px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mine-time {
      font-size: 12px;
      color: var(--text-faint);
    }
  }

  .mine-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }
}
</style>