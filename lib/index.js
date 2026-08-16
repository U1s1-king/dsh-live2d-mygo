import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
//#region src/routes.ts
/**
* MyGO!!!!! Live2D 桌宠 —— host 半区路由。
* 同源静态路由 /pet-assets/* 暴露插件 assets 目录（vendor 运行时脚本、
* waifu.css、缩略图与 92MB 模型资源），浏览器半区经同源 URL 加载，
* 无 CDN、无 CORS。路径一律规范化并限制在 assets 目录内（防 ../ 越界）。
*/
/** 浏览器侧静态资源路由前缀。 */
const PET_ASSET_PREFIX = "/pet-assets";
const MIME = {
	".js": "text/javascript; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".png": "image/png",
	".ico": "image/x-icon",
	".svg": "image/svg+xml",
	".moc": "application/octet-stream",
	".mtn": "application/octet-stream",
	".exp": "application/json",
	".model3.json": "application/json"
};
/** 插件包根目录（本模块 → ../）。 */
function packageRootOf(importMetaUrl) {
	return fileURLToPath(new URL("../", importMetaUrl));
}
/** 把 URL 路径安全映射到 assets 目录内；越界返回 null。 */
function assetPath(packageRoot, urlPath) {
	const assetsRoot = resolve(packageRoot, "assets");
	let rel = urlPath;
	try {
		rel = decodeURIComponent(urlPath);
	} catch {}
	rel = rel.replace(/^\/+/, "");
	const abs = resolve(assetsRoot, rel);
	if (abs !== assetsRoot && !abs.startsWith(assetsRoot + sep)) return null;
	return abs;
}
function sendFile(res, file) {
	return readFile(file).then((body) => {
		const lower = file.toLowerCase();
		const ext = lower.endsWith(".model3.json") ? ".model3.json" : lower.slice(lower.lastIndexOf(".") || 1);
		res.writeHead(200, {
			"content-type": MIME[ext] ?? "application/octet-stream",
			"content-length": String(body.byteLength),
			"cache-control": "no-cache"
		});
		res.end(body);
	}, () => {
		res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
		res.end("not found");
	});
}
/** 静态资源前缀路由：/pet-assets/<assets 内相对路径>。 */
function makeAssetRoute(packageRoot) {
	return {
		kind: "prefix",
		path: PET_ASSET_PREFIX,
		handler: (req, res) => {
			if (req.method !== "GET" && req.method !== "HEAD") {
				res.writeHead(405);
				res.end();
				return;
			}
			const urlPath = (req.url ?? "").split("?")[0];
			const abs = assetPath(packageRoot, urlPath.startsWith("/pet-assets") ? urlPath.slice(11) : urlPath);
			if (abs === null) {
				res.writeHead(400);
				res.end();
				return;
			}
			sendFile(res, abs);
		}
	};
}
//#endregion
//#region src/index.ts
/** 插件名：与 package.json name、cordis.patch.yml 的 name 保持一致。 */
const name = "dsh-live2d-mygo";
/** 注册静态资源路由；插件卸载时自动清理。 */
function apply(ctx) {
	const packageRoot = packageRootOf(import.meta.url);
	ctx.inject(["webServer"], (httpCtx) => {
		httpCtx.effect(() => httpCtx.webServer.register(makeAssetRoute(packageRoot)), "live2d-mygo: routes");
	});
}
//#endregion
export { PET_ASSET_PREFIX, apply, makeAssetRoute, name };
