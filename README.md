# 文的点赞系统 - 前端

基于 Vue 3 + TypeScript + Vite + Element Plus + Pinia + Vue Router + Axios 的博客点赞系统前端。

后端：`D:\code\thumb-system-backend`（Spring Boot，端口 80，接口前缀 `/api`）。

## 技术栈

- Vue 3（`<script setup>` 组合式 API）
- TypeScript（严格模式）
- Vite 5
- Element Plus + @element-plus/icons-vue
- Pinia（用户登录态）
- Vue Router 4（含登录守卫）
- Axios（统一请求封装）

## 启动方式

```bash
# 需要 Node.js >= 18
npm install
npm run dev
```

启动后访问：<http://localhost:5173>

## 后端联调

- Vite 已配置 `/api` → `http://localhost:80` 代理（`vite.config.ts`）
- 登录态通过请求头 `user: {userId}` 传递（后端 `UserLoginInterceptor` 依赖）
- 在线接口文档：<http://localhost/api/doc.html>

## 页面与路由

| 路由 | 页面 | 说明 |
|---|---|---|
| `/login` | 登录 | 输入用户 ID，成功后写 user 头 |
| `/` | 博客列表 | 未登录可浏览，点赞需登录 |
| `/blog/:id` | 博客详情 | 完整内容 + 点赞 + 作者编辑/删除 |
| `/publish` | 发布博客 | 登录守卫 |
| `/blog/:id/edit` | 编辑博客 | 登录守卫 + 作者本人 |
| `/mine` | 我的博客 | 登录守卫，查看/编辑/删除 |

## 接口对接状态

- ✅ 已实现（后端可用）：登录、列表、详情、点赞、取消点赞
- ⏳ 待后端实现（前端已按契约调用，采用降级提示）：发布 `/blog/create`、我的 `/blog/mine`、编辑 `/blog/update`、删除 `/blog/{id}`

详见《接口文档.md》。

## 目录结构

```
src/
├─ api/            # 按模块封装接口（user/blog/thumb）
├─ router/         # 路由 + 登录守卫
├─ store/          # Pinia：user 登录态
├─ utils/request.ts# axios 封装（user 头、信封/非信封兜底）
├─ views/          # login/home/detail/publish/edit/mine
├─ components/     # BlogCard、ThumbButton 复用组件
├─ types/          # 接口 TS 类型（BaseResponse/BlogVO/User 等）
└─ App.vue / main.ts
```