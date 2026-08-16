/**
 * MyGO!!!!! Live2D 桌宠 —— 浏览器半区。
 *
 * 通过纯 DOM 注入在 web GUI 右下角显示 Live2D 看板娘（复用自研 widget：
 * 拖拽 / 视线跟随 / 随机待机 / 台词气泡 / 拍照 / 角色·换装面板），
 * 无需 React、不依赖 slots。运行时脚本与模型资源全部走 host 同源路由
 * （/pet-assets/*），无 CDN、无 CORS。
 *
 * 生命周期（规范要求 client 面的 DOM/监听/定时器/渲染器随 fiber dispose）：
 * apply 里把「启动 + 清理」整体注册为 ctx.effect —— 插件卸载、client HMR
 * 重建时 cordis 自动执行返回的 disposer，保证监听/定时器/PIXI 渲染器/DOM 全量回收。
 */
import type { Context } from '@deepseek-ai/cordis'
import { initWidget } from './waifu/index.js'

/** vendor 运行时脚本（host 同源路由，按依赖顺序加载）。
 *  Cubism 2.1 渲染链：live2d.min.js（框架，暴露 window.Live2D / Live2DModelWebGL）
 *  → pixi.min.js（PIXI 6）→ live2d-display.cubism2.min.js（pixi-live2d-display
 *  0.4.0 的 cubism2 版，运行时校验 window.Live2D 存在）。
 *  Cubism 2.1 不需要 live2dcubismcore.min.js（那是 Cubism 4 链的依赖）。
 */
const VENDOR_SCRIPTS = [
  '/pet-assets/vendor/live2d.min.js',
  '/pet-assets/vendor/pixi.min.js',
  '/pet-assets/vendor/live2d-display.cubism2.min.js',
]

/** 桌宠容器与面板的 z-index 覆盖（dsh GUI 上方悬浮）+ 默认放右下（避开左侧栏）。 */
const Z_INDEX_OVERRIDE = `
#waifu, #waifu-toggle { z-index: 2147483646 !important; }
.waifu-panel { z-index: 2147483647 !important; }
#waifu { left: auto; right: 20px; top: 20px; bottom: auto; }
`

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tag = document.createElement('script')
    tag.src = src
    tag.onload = () => resolve()
    tag.onerror = () => reject(new Error(`加载 ${src} 失败`))
    document.head.appendChild(tag)
  })
}

/** 插件入口：注入 CSS + 按序加载运行时 + 启动桌宠；清理注册为 ctx.effect disposer。 */
export function apply(ctx: Context): void {
  ctx.effect(() => {
    const cleanup: Array<() => void> = []
    let stopWidget: (() => void) | undefined
    let disposed = false

    const stop = () => {
      if (disposed) return
      disposed = true
      for (const fn of cleanup) {
        try { fn() } catch { /* 忽略清理错误 */ }
      }
      cleanup.length = 0
    }

    // 1) 桌宠样式（同源路由拉取 + 高 z-index 覆盖）
    fetch('/pet-assets/waifu.css')
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((css) => {
        if (disposed) return
        const style = document.createElement('style')
        style.id = 'live2d-mygo-css'
        style.textContent = css + Z_INDEX_OVERRIDE
        document.head.appendChild(style)
        cleanup.push(() => style.remove())
      })
      .catch((error) => console.error('[live2d-mygo] 样式加载失败', error))

    // 2) 运行时脚本按序加载 → 3) 启动桌宠
    ;(async () => {
      for (const src of VENDOR_SCRIPTS) {
        await loadScript(src)
        if (disposed) return
      }
      if (disposed) return
      try {
        stopWidget = await initWidget({
          cdnPath: '/pet-assets/',
          preload: 'IDLE',
          tools: ['switch-model', 'photo', 'info', 'quit'],
        })
      } catch (error) {
        console.error('[live2d-mygo] 桌宠启动失败', error)
      }
    })()

    return stop
  }, 'live2d-mygo: widget')
}
