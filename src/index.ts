/**
 * MyGO!!!!! Live2D 桌宠 —— host 半区入口。
 * 注册 /pet-assets/* 同源静态路由（vendor 运行时 + waifu.css + 缩略图 + 模型），
 * 浏览器半区（lib/client.js）负责 DOM 注入与桌宠运行。
 *
 * 按 DSH 插件规范（docs/user/develop/basic + framework/service）：
 * - 函数插件导出 name/inject/Config/apply；本插件无用户可配置项，
 *   Config 省略（默认即全部行为），name 与 package.json / cordis.patch.yml 一致。
 * - webServer 是必需服务，但 cordis 4 禁止在 apply 里直接读 ctx.webServer，
 *   必须「先声明再使用」：ctx.inject(['webServer'], cb) 等服务就绪后在子上下文
 *   中使用；路由注册返回的 disposer 包进 ctx.effect，卸载/HMR 时自动清理。
 */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'
import { makeAssetRoute, packageRootOf } from './routes.ts'

/** 插件名：与 package.json name、cordis.patch.yml 的 name 保持一致。 */
export const name = 'dsh-live2d-mygo'

/** 注册静态资源路由；插件卸载时自动清理。 */
export function apply(ctx: Context): void {
  const packageRoot = packageRootOf(import.meta.url)
  ctx.inject(['webServer'], (httpCtx) => {
    httpCtx.effect(() => httpCtx.webServer.register(makeAssetRoute(packageRoot)), 'live2d-mygo: routes')
  })
}

export { makeAssetRoute, PET_ASSET_PREFIX } from './routes.ts'
