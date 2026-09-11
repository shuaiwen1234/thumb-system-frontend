// 接口契约类型定义 —— 严格对齐《接口文档.md》
// ✅ 后端已实现的接口类型照此使用；⏳ 待后端实现的接口类型已按契约预留（前端调用，后端补全后生效）

/** 通用响应包装 BaseResponse<T> */
export interface BaseResponse<T> {
  /** 状态码，0 为成功 */
  code: number
  /** 业务数据，失败为 null */
  data: T
  /** 提示信息 */
  message: string
}

/** 用户信息 User */
export interface User {
  userId: number
  userName: string
}

/** 博客 VO（列表/详情通用） */
export interface BlogVO {
  id: number
  title: string
  coverImg: string
  content: string
  thumbCount: number
  createTime: string
  /** 更新时间（可选，后端 VO 后补） */
  updateTime?: string
  /** 作者 ID ⏳ 后端需在 BlogVO 补充该字段 */
  userId?: number
  /** 当前用户是否已点赞 */
  hasThumb: boolean
}

/** 点赞/取消点赞请求体 DoThumbRequest */
export interface DoThumbRequest {
  blogId: number
}

/** 发布博客请求体 ⏳ BlogRequest（后端待实现） */
export interface BlogCreateRequest {
  title: string
  coverImg?: string
  content: string
}

/** 编辑博客请求体 ⏳（全量提交） */
export interface BlogUpdateRequest {
  id: number
  title: string
  coverImg?: string
  content: string
}

/** 错误码枚举（对齐 ErrorCode） */
export const ErrorCode = {
  SUCCESS: 0,
  PARAMS_ERROR: 40000,
  NOT_LOGIN: 40100,
  NO_AUTH: 40101,
  FORBIDDEN: 40300,
  NOT_FOUND: 40400,
  OPERATION_ERROR: 50001,
} as const