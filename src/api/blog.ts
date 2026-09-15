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

/** 发布博客 ✅ POST /blog/create（后端已实现，返回新博客 id） */
export function createBlog(data: BlogCreateRequest): Promise<BaseResponse<number>> {
  return request.post<unknown, BaseResponse<number>, BlogCreateRequest>('/blog/create', data)
}

/**
 * 我的博客列表 ✅ GET /blog/mine?pageNum=&pageSize=
 * 后端返回纯 List<BlogVO>（无 total 等分页元信息），前端按「每页满额即还有下一页」做加载更多
 */
export function getMyBlogList(pageNum: number, pageSize: number): Promise<BaseResponse<BlogVO[]>> {
  return request.get<unknown, BaseResponse<BlogVO[]>>('/blog/mine', {
    params: { pageNum, pageSize },
  })
}

/**
 * 我点赞的博客列表 ✅ GET /blog/mine/thumb?pageNum=&pageSize=
 * 后端返回纯 List<BlogVO>（无 total），前端按「每页满额即还有下一页」做加载更多
 */
export function getMyThumbBlogList(
  pageNum: number,
  pageSize: number,
): Promise<BaseResponse<BlogVO[]>> {
  return request.get<unknown, BaseResponse<BlogVO[]>>('/blog/mine/thumb', {
    params: { pageNum, pageSize },
  })
}

/** 编辑博客 ⏳ PUT /blog/update（后端未实现） */
export function updateBlog(data: BlogUpdateRequest): Promise<BaseResponse<boolean>> {
  return request.put<unknown, BaseResponse<boolean>, BlogUpdateRequest>('/blog/update', data)
}

/** 删除博客 ⏳ DELETE /blog/{blogId}（后端未实现） */
export function deleteBlog(blogId: number): Promise<BaseResponse<boolean>> {
  return request.delete<unknown, BaseResponse<boolean>>(`/blog/${blogId}`)
}