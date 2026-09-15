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
    ElMessage.success('发布成功')
    router.push(`/blog/${res.data}`)
  } catch {
    // 后端未实现时拦截器已提示
  } finally {
    submitting.value = false
  }
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="page-container editor-page">
    <div class="editor-head">
      <el-button link class="back" @click="goBack">
        <el-icon><ArrowLeft /></el-icon> 返回
      </el-button>
      <h1 class="page-heading">发布博客</h1>
    </div>

    <div class="editor-form">
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
            placeholder="支持换行分段，写点真实的思考"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <div class="form-actions">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">发布</el-button>
      </div>
    </div>
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

@media (max-width: 640px) {
  .editor-form {
    padding: var(--space-5);
  }
}
</style>