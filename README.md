# dsh-live2d-mygo

MyGO!!!!! Live2D 桌宠插件 —— 为 DeepSeek Harness Web GUI 添加可拖拽的 Live2D 看板娘。

收录 MyGO!!!!! 五位成员的 Live2D 桌宠：高松燈（主唱）、千早愛音（吉他）、
要楽奈（吉他）、長崎そよ（贝斯）、椎名立希（鼓手），每角色多套换装
（常服 / 校服 / 演出 / 联动 / 生日等），合计 74 套；模型本地存储、同源加载，零网络请求。

## 功能

- 右下角 Live2D 看板娘（5 角色：高松燈 / 千早愛音 / 要楽奈 / 長崎そよ / 椎名立希）
- 拖拽自由移动（位置持久化到 localStorage）
- 角色切换 + 换装面板（74 套换装，缩略图或文字标签）
- 视线跟随鼠标、空闲随机动作/台词气泡、点击互动
- 拍照（下载 PNG 截图）
- 隐藏（右下角 Live2D 悬浮钮恢复）
- 纯 DOM 注入，无 React 依赖；卸载时完整清理（监听/定时器/渲染器/DOM）

## 安装

```bash
dsh plugin --profile web add D:\dsh\dsh-live2d-mygo
```

然后重启 dsh web（或热加载 client bundle），硬刷新页面。

## 结构

```
package.json            dsh.bundle.patch / dsh.client(platform: web) / exports["./client"]
cordis.patch.yml        补丁层：insert 一行 host 插件
build/
  tsdown.client.ts      client bundle 构建预设（镜像官方 tsdown.client.ts 协议）
  web-platform.ts       平台模块表（与 shell seed 一致）
src/
  index.ts              host 半区：导出 name/apply，注册 /pet-assets/* 同源静态路由
  routes.ts             静态路由（vendor / waifu.css / 缩略图 / 模型），路径防越界
  client/
    index.ts            浏览器半区：ctx.effect 持有启动/清理，注入样式 + 按序加载运行时
    waifu/              widget 源码（改造：vendor 全局惰性解析、生命周期可清理）
assets/
  vendor/               pixi.min.js (PIXI 6.5.2) / live2d.min.js (Cubism 2.1 框架) /
                        live2d-display.cubism2.min.js (pixi-live2d-display 0.4.0 cubism2 版)
  waifu.css             桌宠样式（注入时叠加高 z-index 覆盖）
  assets/               角色与换装缩略图（82 张）
  model/                模型资源（5 角色 × 74 套，Cubism 2，约 87MB）
```

## 开发

```bash
pnpm install
pnpm build        # tsdown 双产物：lib/index.js (host) + lib/client.js (browser)
```

改代码后：`pnpm build` → 重启 dsh web → 硬刷新页面。
（若 bundle 内容无变化仍未生效，完全重启 dsh web。）

## 规范说明

- host 半区为函数插件四要素的子集：导出 `name` 与 `apply`（无用户可配置项，故省略
  `Config`）；`webServer` 为必需服务，经 `ctx.inject(['webServer'], cb)` 声明后使用，
  路由注册的 disposer 包进 `ctx.effect`，卸载/HMR 自动清理。
- client 半区全部副作用（DOM、监听、定时器、PIXI 渲染器）随 fiber dispose：
  `apply` 内整体注册为 `ctx.effect`，返回 disposer 全量回收。
- 浏览器半区只 import 自身模块与类型（`@deepseek-ai/cordis` 仅 type-only），
  不越过平台模块表，无跨插件值导入。
- 分发采用「lib 产物提交进 Git」策略（与 dsh-gbc-ui 一致）：无 prepare 脚本，
  `dsh plugin add github:...` 免 allowBuilds 直装。

## 说明

- 模型为邦邦（BanG Dream!）手游解包资源，仅供个人学习研究使用。
- 渲染栈：pixi-live2d-display（Cubism 2）× PIXI 6.5.2，与自研 widget 一致。
  Cubism 2.1 链只需 live2d.min.js（框架）+ cubism2 版 display，无需 Cubism Core。
