<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getBlogDetail, updateBlog } from '@/api/blog'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const title = ref('')
const coverImg = ref('')
const content = ref('')
const loading = ref(true)
const noPermission = ref(false)

async function loadBlog() {
  const id = Number(route.params.id)
  loading.value = true
  try {
    const res = await getBlogDetail(id)
    if (!res.data || res.data.id === undefined || res.data.id === null) {
      ElMessage.error('博客不存在')
      router.push('/')
      return
    }
    if (res.data.userId !== undefined && res.data.userId !== userStore.userId) {
      noPermission.value = true
      ElMessage.error('无权限编辑该博客')
      router.push(`/blog/${id}`)
      return
    }
    title.value = res.data.title
    coverImg.value = res.data.coverImg || ''
    content.value = res.data.content
  } catch {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  if (!title.value.trim()) {
    ElMessage.warning('请输入标题')
    return
  }
  if (!content.value.trim()) {
    ElMessage.warning('请输入正文内容')
    return
  }

  try {
    await updateBlog({
      id: Number(route.params.id),
      title: title.value.trim(),
      coverImg: coverImg.value.trim(),
      content: content.value,
    })
    ElMessage.success('修改成功')
    router.push(`/blog/${route.params.id}`)
  } catch {
    // 后端未实现时拦截器已提示
  }
}

onMounted(loadBlog)
</script>

<template>
  <div class="page-container editor-page">
    <template v-if="!noPermission">
      <div class="editor-head">
        <el-button link class="back" @click="router.push(`/blog/${route.params.id}`)">
          <el-icon><ArrowLeft /></el-icon> 返回详情
        </el-button>
        <h1 class="page-heading">编辑博客</h1>
      </div>

      <div v-if="!loading" class="editor-form">
        <el-form label-position="top">
          <el-form-item label="标题">
            <el-input
              v-model="title"
              placeholder="一句话说清这篇写了什么"
              maxlength="512"
              show-word-limit
              size="large"
            />
          </el-form-item>

          <el-form-item label="封面图 URL（选填）">
            <el-input v-model="coverImg" placeholder="https://.../cover.png" maxlength="1024" />
          </el-form-item>

          <div v-if="coverImg" class="cover-preview">
            <img :src="coverImg" alt="封面预览" />
          </div>

          <el-form-item label="正文">
            <el-input
              v-model="content"
              type="textarea"
              :rows="10"
              placeholder="支持换行分段"
              show-word-limit
            />
          </el-form-item>
        </el-form>

        <div class="form-actions">
          <el-button @click="router.push(`/blog/${route.params.id}`)">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存修改</el-button>
        </div>
      </div>

      <el-skeleton v-else :rows="10" animated class="edit-loading" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.editor-page {
  max-width: 720px;
}

.editor-head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);

  .back {
    color: var(--text-sub);
    font-size: 13px;
    margin-bottom: auto;
    margin-top: 6px;
  }
  .page-heading {
    margin: 0;
  }
}

.editor-form {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-sm);
  animation: fade-up 0.5s var(--ease-out) both;
}

.cover-preview {
  margin-bottom: var(--space-4);

  img {
    max-width: 100%;
    max-height: 220px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.edit-loading {
  margin-top: var(--space-4);
}

@media (max-width: 640px) {
  .editor-form {
    padding: var(--space-5);
  }
}
</style>