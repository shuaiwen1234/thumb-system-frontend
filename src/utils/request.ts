import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

/**
 * 统一 axios 实例
 * - baseURL: '/api'（Vite dev 代理到 http://localhost:80）
 * - 请求拦截器：自动附加 `user` 头（后端 UserLoginInterceptor 依赖）
 * - 响应拦截器：统一处理 BaseResponse 信封；非信封/空响应统一兜底
 */

// localStorage 中登录态的 key（与 store/user.ts 保持一致）
const USER_STORAGE_KEY = 'thumb_system_user'

export interface StoredUser {
  userId: number
  userName: string
}

/** 判断一个响应体是否是合法的 BaseResponse 信封 */
function isBaseResponse(obj: unknown): obj is { code: number; data: unknown; message: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as Record<string, unknown>).code === 'number'
  )
}

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

// 请求拦截器：附加 user 头
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const raw = localStorage.getItem(USER_STORAGE_KEY)
  if (raw) {
    try {
      const user = JSON.parse(raw) as StoredUser
      if (user && user.userId !== undefined) {
        config.headers.set('user', String(user.userId))
      }
    } catch {
      // 解析失败清除脏数据
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  }
  return config
})

// 响应拦截器：统一信封处理 + 兜底
request.interceptors.response.use(
  (response) => {
    const body = response.data

    // 兜底：空响应 / 非信封结构（后端未实现接口 404/501、后端抛异常等非规范响应）
    if (body === null || body === '' || !isBaseResponse(body)) {
      ElMessage.error('接口异常或后端功能未就绪，请稍后重试')
      return Promise.reject(new Error('非信封响应'))
    }

    // 成功：拦截器改造返回值为业务信封 body（类型上强制断言对齐 axios 拦截器约定）
    if (body.code === 0) {
      return body as unknown as typeof response
    }

    // 业务失败
    const msg = body.message || '操作失败'
    ElMessage.error(msg)
    return Promise.reject(new Error(msg))
  },
  (error: AxiosError) => {
    // 网络层错误：401/404/500 等 HTTP 状态
    const status = error.response?.status
    if (status === 401) {
      ElMessage.error('未登录，请先登录')
    } else {
      ElMessage.error('接口异常或后端功能未就绪，请稍后重试')
    }
    return Promise.reject(error)
  },
)

export default request
export { USER_STORAGE_KEY }