/**
 * 角色元数据与模型资源名工具。
 *
 * 模型目录统一为 `<角色>/<资源id>_<中文标签>`（如 `tomori/036_casual-2023_常服`），
 * 其中「中文标签」用于在换装面板中展示，实际资源（缩略图 / 贴图）仍使用不带标签的
 * `<资源id>` 命名（如 `assets/036_live_default.png`）。本文件提供两组转换函数。
 */

export const CHARACTERS = [
  { id: "tomori", num: 36, name: "高松 燈", en: "Tomori", color: "#8ec9e8" },
  { id: "anon", num: 37, name: "千早 愛音", en: "Anon", color: "#f2a7b8" },
  { id: "rana", num: 38, name: "要 楽奈", en: "Rāna", color: "#f4c95d" },
  { id: "soyo", num: 39, name: "長崎 そよ", en: "Soyo", color: "#b9a7d9" },
  { id: "taki", num: 40, name: "椎名 立希", en: "Taki", color: "#7fa9d9" },
];

/**
 * 从模型目录名中提取「中文标签」。
 * `tomori/036_casual-2023_常服` -> `常服`
 * `anon/037_live_event_240_sr_活动240` -> `活动240`
 */
export function textureLabel(dir) {
  const match = dir.match(/_([\p{Script=Han}][\p{Script=Han}0-9A-Za-z]*)$/u);
  return match ? match[1] : dir.split("/").pop();
}

/**
 * 去掉目录名末尾的中文标签，得到原始资源 id。
 * `036_live_default_默认` -> `036_live_default`
 * 注意：标签组必须「以下划线 + 汉字开头」，否则会把 `live_default` 这种带下划线的
 * 基础 id 也误剥掉（`_live_default_默认` 整段被匹配）。
 */
export function stripTextureLabel(dir) {
  return dir.replace(/_\p{Script=Han}[\p{Script=Han}0-9A-Za-z]*$/u, "");
}

/**
 * 由模型目录名得到平铺在 `assets/` 下的资源文件名（去掉中文标签）。
 * `036_live_default_默认` -> `036_live_default`
 */
export function textureAssetId(dir) {
  return stripTextureLabel(dir);
}

/**
 * 该换装是否有缩略图资源（live / 活动 / 生日 / 梦祭 / 联动等「卡片」换装有 assets 图，
 * 常服 / 校服 / 和服 / 打工等没有，面板中将以文字标签展示）。
 */
export function hasTextureAsset(dir) {
  const base = stripTextureLabel(dir);
  return !/[_](casual|school|furisode|arbeit|story)/.test(base);
}
