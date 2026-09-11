import request from '@/utils/request'
import type { BaseResponse, User } from '@/types'

/** 用户登录 ✅ GET /user/login?userId={userId}（公开接口） */
export function login(userId: number): Promise<BaseResponse<User>> {
  return request.get<unknown, BaseResponse<User>>('/user/login', { params: { userId } })
}