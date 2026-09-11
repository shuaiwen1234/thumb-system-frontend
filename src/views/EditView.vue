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
    // 权限校验：非作者本人，跳回详情页
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
  <div class="page-container edit-page">
    <!-- 无权限时不渲染表单 -->
    <template v-if="!noPermission">
      <div class="edit-head">
        <el-button link @click="router.push(`/blog/${route.params.id}`)">← 返回详情</el-button>
        <h2 class="title">编辑博客</h2>
      </div>

      <el-form v-if="!loading" label-position="top" class="edit-form">
        <el-form-item label="标题（必填）">
          <el-input v-model="title" placeholder="请输入博客标题" maxlength="512" show-word-limit />
        </el-form-item>

        <el-form-item label="封面图 URL（选填）">
          <el-input v-model="coverImg" placeholder="https://.../cover.png" maxlength="1024" />
        </el-form-item>

        <el-form-item label="正文（必填）">
          <el-input
            v-model="content"
            type="textarea"
            :rows="10"
            placeholder="请输入正文内容"
            show-word-limit
          />
        </el-form-item>

        <div class="form-actions">
          <el-button @click="router.push(`/blog/${route.params.id}`)">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存修改</el-button>
        </div>
      </el-form>

      <el-skeleton v-else :rows="8" animated />
    </template>
  </div>
</template>

<style scoped lang="scss">
.edit-page {
  max-width: 720px;
}

.edit-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;

  .title {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
}

.edit-form {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-sm);
  animation: fade-up 0.5s var(--ease-out) both;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>