<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMyBlogList, getMyThumbBlogList, deleteBlog } from '@/api/blog'
import type { BlogVO } from '@/types'
import { usePagedList } from '@/composables/usePagedList'
import BlogCard from '@/components/BlogCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationNav from '@/components/PaginationNav.vue'

const router = useRouter()

const activeTab = ref('published')
const thumbedLoaded = ref(false)

const published = usePagedList<BlogVO>((pageNum, pageSize) =>
  getMyBlogList(pageNum, pageSize).then((res) => res.data ?? []),
)
const thumbed = usePagedList<BlogVO>((pageNum, pageSize) =>
  getMyThumbBlogList(pageNum, pageSize).then((res) => res.data ?? []),
)

function onTabChange(name: string | number) {
  if (name === 'thumbed' && !thumbedLoaded.value) {
    thumbedLoaded.value = true
    thumbed.load()
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
    published.remove((b) => b.id === blog.id)
  } catch {
    // 取消或失败
  }
}

function goEdit(blog: BlogVO) {
  router.push(`/blog/${blog.id}/edit`)
}

function goDetail(id: number) {
  router.push(`/blog/${id}`)
}

function handleThumbChange(payload: { blogId: number; thumbCount: number; hasThumb: boolean }) {
  if (!payload.hasThumb) {
    thumbed.remove((b) => b.id === payload.blogId)
  }
}

onMounted(() => {
  published.load()
})
</script>

<template>
  <div class="page-container">
    <h1 class="page-heading">我的内容</h1>

    <el-tabs v-model="activeTab" class="mine-tabs" @tab-change="onTabChange">
      <!-- 我发布的 -->
      <el-tab-pane label="我发布的" name="published">
        <div v-if="published.state.loading" class="row-list">
          <el-skeleton v-for="i in 4" :key="i" animated class="row-skeleton" />
        </div>

        <EmptyState
          v-else-if="published.state.error"
          icon="WarningFilled"
          title="加载失败"
          desc="请检查网络或后端状态后重试。"
        >
          <template #action>
            <el-button type="primary" @click="published.load">重试</el-button>
          </template>
        </EmptyState>

        <EmptyState
          v-else-if="published.state.list.length === 0"
          icon="Document"
          title="还没有发布过内容"
          desc="写下第一篇博客，分享你的技术思考。"
        >
          <template #action>
            <el-button type="primary" @click="router.push('/publish')">去发布</el-button>
          </template>
        </EmptyState>

        <template v-else>
          <div class="row-list">
            <div v-for="blog in published.state.list" :key="blog.id" class="mine-item">
              <div class="mine-main" @click="goDetail(blog.id)">
                <img
                  v-if="blog.coverImg"
                  class="mine-cover"
                  :src="blog.coverImg"
                  :alt="blog.title"
                  loading="lazy"
                />
                <div v-else class="mine-cover fallback">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13zM8 9.5A1.5 1.5 0 1 0 8 6.5a1.5 1.5 0 0 0 0 3zm11 8.5l-4.5-4.5L8 20h10.5a.5.5 0 0 0 .5-.5V18z"
                    />
                  </svg>
                </div>
                <div class="mine-body">
                  <h3 class="mine-title">{{ blog.title }}</h3>
                  <span class="mine-time">{{ blog.createTime?.replace('T', ' ').slice(0, 16) }}</span>
                </div>
              </div>
              <div class="mine-actions">
                <el-button size="small" @click="goDetail(blog.id)">查看</el-button>
                <el-button size="small" type="primary" @click="goEdit(blog)">编辑</el-button>
                <el-button size="small" type="danger" plain @click="handleDelete(blog)">删除</el-button>
              </div>
            </div>
          </div>

          <PaginationNav
            :page="published.state.page"
            :max-reached="published.state.maxReached"
            :has-next="published.state.hasNext"
            @change="published.goToPage"
          />
        </template>
      </el-tab-pane>

      <!-- 我点赞的 -->
      <el-tab-pane label="我点赞的" name="thumbed" lazy>
        <div v-if="thumbed.state.loading" class="grid">
          <SkeletonCard v-for="i in 6" :key="i" />
        </div>

        <EmptyState
          v-else-if="thumbed.state.error"
          icon="WarningFilled"
          title="加载失败"
          desc="请检查网络或后端状态后重试。"
        >
          <template #action>
            <el-button type="primary" @click="thumbed.load">重试</el-button>
          </template>
        </EmptyState>

        <EmptyState
          v-else-if="thumbed.state.list.length === 0"
          icon="Star"
          title="还没有点赞"
          desc="去首页逛逛，点下你喜欢的那个赞。"
        >
          <template #action>
            <el-button type="primary" @click="router.push('/')">去首页</el-button>
          </template>
        </EmptyState>

        <template v-else>
          <div class="grid">
            <BlogCard
              v-for="(blog, i) in thumbed.state.list"
              :key="blog.id"
              :blog="blog"
              :index="i"
              @thumb-change="handleThumbChange"
            />
          </div>

          <PaginationNav
            :page="thumbed.state.page"
            :max-reached="thumbed.state.maxReached"
            :has-next="thumbed.state.hasNext"
            @change="thumbed.goToPage"
          />
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.mine-tabs {
  :deep(.el-tabs__item) {
    font-size: 15px;
    font-weight: 500;
  }
  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
    background-color: var(--border);
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-5);
}

.row-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.row-skeleton {
  height: 80px;
  border-radius: var(--radius-md);
}

.mine-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  gap: var(--space-4);
  box-shadow: var(--shadow-xs);
  transition:
    box-shadow 0.25s var(--ease-out),
    border-color 0.25s var(--ease-out),
    transform 0.25s var(--ease-out);

  &:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--gray-300);
    transform: translateY(-2px);
  }

  .mine-main {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex: 1;
    cursor: pointer;
    min-width: 0;
  }

  .mine-cover {
    width: 76px;
    height: 52px;
    border-radius: var(--radius-sm);
    object-fit: cover;
    flex-shrink: 0;
    background: var(--gray-100);
  }

  .mine-cover.fallback {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 22px;
      height: 22px;
      fill: var(--gray-300);
    }
  }

  .mine-body {
    min-width: 0;

    .mine-title {
      margin: 0 0 2px;
      font-size: 15px;
      font-weight: 600;
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
    gap: var(--space-2);
    flex-shrink: 0;
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .mine-item {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-3);
  }
  .mine-actions {
    justify-content: flex-end;
  }
}
</style>