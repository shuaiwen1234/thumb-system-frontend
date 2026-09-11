import request from '@/utils/request'
import type { BaseResponse, BlogCreateRequest, BlogUpdateRequest, BlogVO } from '@/types'

/** 获取博客详情 ✅ GET /blog?blogId={blogId} */
export function getBlogDetail(blogId: number): Promise<BaseResponse<BlogVO>> {
  return request.get<unknown, BaseResponse<BlogVO>>('/blog', { params: { blogId } })
}

/** 获取博客列表 ✅ GET /blog/list */
export function getBlogList(): Promise<BaseResponse<BlogVO[]>> {
  return request.get<unknown, BaseResponse<BlogVO[]>>('/blog/list')
}

/** 发布博客 ⏳ POST /blog/create（后端待实现） */
export function createBlog(data: BlogCreateRequest): Promise<BaseResponse<number>> {
  return request.post<unknown, BaseResponse<number>, BlogCreateRequest>('/blog/create', data)
}

/** 我的博客列表 ⏳ GET /blog/mine（后端待实现） */
export function getMyBlogList(): Promise<BaseResponse<BlogVO[]>> {
  return request.get<unknown, BaseResponse<BlogVO[]>>('/blog/mine')
}

/** 编辑博客 ⏳ PUT /blog/update（后端待实现） */
export function updateBlog(data: BlogUpdateRequest): Promise<BaseResponse<boolean>> {
  return request.put<unknown, BaseResponse<boolean>, BlogUpdateRequest>('/blog/update', data)
}

/** 删除博客 ⏳ DELETE /blog/{blogId}（后端待实现） */
export function deleteBlog(blogId: number): Promise<BaseResponse<boolean>> {
  return request.delete<unknown, BaseResponse<boolean>>(`/blog/${blogId}`)
}