import request from '@/utils/request'
import type { BaseResponse, DoThumbRequest } from '@/types'

/** 点赞 ✅ POST /thumb/do */
export function doThumb(blogId: number): Promise<BaseResponse<boolean>> {
  return request.post<unknown, BaseResponse<boolean>, DoThumbRequest>(
    '/thumb/do',
    { blogId } as DoThumbRequest,
  )
}

/** 取消点赞 ✅ POST /thumb/undo */
export function undoThumb(blogId: number): Promise<BaseResponse<boolean>> {
  return request.post<unknown, BaseResponse<boolean>, DoThumbRequest>(
    '/thumb/undo',
    { blogId } as DoThumbRequest,
  )
}