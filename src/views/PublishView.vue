<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createBlog } from '@/api/blog'

const router = useRouter()

const title = ref('')
const coverImg = ref('')
const content = ref('')
const submitting = ref(false)

async function handleSubmit() {
  // 前端校验：title/content 非空
  if (!title.value.trim()) {
    ElMessage.warning('请输入标题')
    return
  }
  if (!content.value.trim()) {
    ElMessage.warning('请输入正文内容')
    return
  }

  submitting.value = true
  try {
    const res = await createBlog({
      title: title.value.trim(),
      coverImg: coverImg.value.trim(),
      content: content.value,
    })
    const newId = res.data
    ElMessage.success('发布成功')
    router.push(`/blog/${newId}`)
  } catch {
    // 后端未实现时拦截器已提示「功能未就绪」
  } finally {
    submitting.value = false
  }
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="page-container publish-page">
    <div class="publish-head">
      <el-button link @click="goBack">← 返回</el-button>
      <h2 class="title">发布博客</h2>
    </div>

    <el-form label-position="top" class="publish-form">
      <el-form-item label="标题（必填）">
        <el-input
          v-model="title"
          placeholder="请输入博客标题"
          maxlength="512"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="封面图 URL（选填）">
        <el-input v-model="coverImg" placeholder="https://.../cover.png" maxlength="1024" />
      </el-form-item>

      <el-form-item v-if="coverImg" label="封面预览">
        <img class="cover-preview" :src="coverImg" alt="封面预览" />
      </el-form-item>

      <el-form-item label="正文（必填）">
        <el-input
          v-model="content"
          type="textarea"
          :rows="10"
          placeholder="请输入正文内容，支持换行分段"
          show-word-limit
        />
      </el-form-item>

      <div class="form-actions">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">发布</el-button>
      </div>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.publish-page {
  max-width: 720px;
}

.publish-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;

  .title {
    margin: 0;
    font-size: 22px;
  }
}

.publish-form {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px;
}

.cover-preview {
  max-width: 100%;
  max-height: 220px;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>