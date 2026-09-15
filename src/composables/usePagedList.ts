import { shallowReactive } from 'vue'

/**
 * 通用「页码分页」列表组合式函数。
 *
 * 适配后端契约：`mine` / `mine/thumb` 返回纯 List<BlogVO>，没有 total / 总页数。
 * 因此采用「每页满额(== pageSize)即认为还有下一页」的推断：
 *   - page：当前页码
 *   - maxReached：已探索到的最大页码（页码列表据此展开 1..maxReached）
 *   - hasNext：当前页已满额，可继续向后翻
 */
export function usePagedList<T>(fetchPage: (pageNum: number, pageSize: number) => Promise<T[]>) {
  const PAGE_SIZE = 10

  const state = shallowReactive({
    list: [] as T[],
    loading: true,
    error: false,
    page: 1,
    maxReached: 1,
    hasNext: false,
  })

  async function loadPage(p: number) {
    state.loading = true
    state.error = false
    try {
      const data = await fetchPage(p, PAGE_SIZE)
      state.list = data
      state.page = p
      if (p > state.maxReached) state.maxReached = p
      state.hasNext = data.length === PAGE_SIZE
    } catch {
      state.error = true
    } finally {
      state.loading = false
    }
  }

  /** 首屏 / 重试加载（回到第 1 页） */
  async function load() {
    await loadPage(1)
  }

  /** 跳转到指定页（前端兜底校验，配合导航组件的禁用态） */
  async function goToPage(p: number) {
    if (p === state.page || p < 1) return
    if (p > state.maxReached + 1) return
    if (p === state.maxReached + 1 && !state.hasNext) return
    await loadPage(p)
  }

  /** 下一页 / 上一页 */
  async function next() {
    if (state.hasNext) await goToPage(state.page + 1)
  }

  async function prev() {
    await goToPage(state.page - 1)
  }

  /** 本地移除：删除成功 / 取消点赞后从列表剔除该条目 */
  function remove(predicate: (item: T) => boolean) {
    state.list = state.list.filter((it) => !predicate(it))
  }

  return { state, load, goToPage, next, prev, remove }
}