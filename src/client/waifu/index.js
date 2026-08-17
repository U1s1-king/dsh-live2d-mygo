import { getModelId, getModelTexturesId, resetModelState, getConfig, setConfig, getMessageArray } from "./config.js";
import Model from "./model.js";
import showMessage, { clearMessageTimer } from "./message.js";
import randomSelection from "./utils.js";
import tools from "./tools.js";
import modelList from "./modelList.js";
import tips from "./tips.js";
import { CHARACTERS, textureLabel, textureAssetId, hasTextureAsset } from "./characters.js";

const TOOL_TITLES = {
    "switch-model": "切换角色",
    "photo": "拍照",
    "info": "关于",
    "quit": "隐藏",
};

/** 轻量监听/定时器收集器：插件卸载时统一清理 */
function createHooks() {
    const listeners = [];
    const intervals = [];
    return {
        on(target, event, fn) {
            target.addEventListener(event, fn);
            listeners.push([target, event, fn]);
        },
        interval(fn, ms) {
            intervals.push(setInterval(fn, ms));
        },
        stop() {
            for (const [target, event, fn] of listeners) {
                try { target.removeEventListener(event, fn); } catch { /* 忽略 */ }
            }
            for (const id of intervals) clearInterval(id);
            listeners.length = 0;
            intervals.length = 0;
        },
    };
}

async function loadWidget(hooks) {
    document.body.insertAdjacentHTML("beforeend", `
    <div id="waifu-mygo">
      <canvas id="live2d-mygo" width="800" height="800"></canvas>
      <div id="waifu-tips-mygo"></div>
      <div id="waifu-tool-mygo"></div>
    </div>
    <div id="model-selection-panel-mygo" class="waifu-panel waifu-panel-mygo" style="display: none;"></div>
    <div id="texture-selection-panel-mygo" class="waifu-panel waifu-panel-mygo" style="display: none;"></div>`);

    const model = new Model();
    localStorage.removeItem("mygo-waifu-display");
    sessionStorage.removeItem("mygo-waifu-text");

    const waifu = document.getElementById("waifu-mygo");
    const toolBar = document.getElementById("waifu-tool-mygo");
    const modelPanel = document.getElementById("model-selection-panel-mygo");
    const texturePanel = document.getElementById("texture-selection-panel-mygo");
    let selectedModelIndex = null;

    const drag = enableDrag(waifu);
    restorePosition(waifu);

    /* ---------- 面板定位 ---------- */
    const waifuRect = () => waifu.getBoundingClientRect();

    function openPanel(panel) {
        panel.style.display = "block";
        const pw = panel.offsetWidth, ph = panel.offsetHeight;
        const rect = waifuRect();
        let left = rect.right + 8;
        if (left + pw > window.innerWidth - 8) left = rect.left - pw - 8;
        left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
        const top = Math.max(8, Math.min(rect.top, window.innerHeight - ph - 8));
        panel.style.position = "fixed";
        panel.style.left = left + "px";
        panel.style.top = top + "px";
        panel.style.right = "auto";
        panel.style.bottom = "auto";
    }

    function closePanels() {
        modelPanel.style.display = "none";
        texturePanel.style.display = "none";
    }

    /* ---------- 工具按钮 ---------- */
    tools["switch-model"].callback = () => {
        if (modelPanel.style.display !== "none") { closePanels(); return; }
        renderModelPanel();
        openPanel(modelPanel);
    };
    tools["photo"].callback = () => {
        const url = model.capture();
        if (!url) {
            showMessage(model, { text: "呜……拍照失败了，再试一次吧？", motion: "sad01" }, 4000, 10);
            return;
        }
        const a = document.createElement("a");
        a.href = url;
        a.download = `live2d-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        showMessage(model, { text: "拍好啦！这张照片，要好好珍藏哦！", motion: "smile01" }, 4000, 10);
    };

    if (!Array.isArray(getConfig().tools)) {
        getConfig().tools = Object.keys(tools);
    }
    for (const tool of getConfig().tools) {
        if (!tools[tool]) continue;
        const { icon, callback } = tools[tool];
        toolBar.insertAdjacentHTML("beforeend",
            `<span id="waifu-tool-mygo-${tool}" title="${TOOL_TITLES[tool] || tool}">${decodeURIComponent(icon).replace("data:image/svg+xml,", "")}</span>`);
        document.getElementById(`waifu-tool-mygo-${tool}`).addEventListener("click", callback);
    }

    /* ---------- 角色选择面板 ---------- */
    function renderModelPanel() {
        let html = "";
        modelList.forEach((textures, index) => {
            const char = CHARACTERS[index];
            const defaultTexture = textures.find(texture => texture.includes("_live_default"));
            const asset = defaultTexture
                ? `${getConfig().cdnPath}assets/${textureAssetId(defaultTexture)}.png`
                : `${getConfig().cdnPath}assets/chara_icon_${char.num}.png`;
            html += `
            <button class="model-option" data-model-index="${index}" style="--accent:${char.color}">
              <img src="${asset}" alt="${char.name}" loading="lazy">
              <span class="model-option-text">
                <span class="model-option-name">${char.name}</span>
                <span class="model-option-en">${char.en}</span>
              </span>
            </button>`;
        });
        modelPanel.innerHTML = `
            <div class="waifu-panel-header"><span>选择角色</span><button class="waifu-panel-close" aria-label="关闭">✕</button></div>
            <div class="waifu-panel-body">${html}</div>`;
    }

    function renderTexturePanel(charIndex) {
        const char = CHARACTERS[charIndex];
        const textures = modelList[charIndex];
        let html = "";
        textures.forEach((dir, index) => {
            const label = textureLabel(dir);
            const base = textureAssetId(dir);
            const asset = `${getConfig().cdnPath}assets/${base}.png`;
            if (hasTextureAsset(dir)) {
                html += `
                <button class="texture-option" data-texture-index="${index}">
                  <img src="${asset}" alt="${label}" loading="lazy">
                  <span>${label}</span>
                </button>`;
            } else {
                html += `
                <button class="texture-option texture-option-text" data-texture-index="${index}">
                  <span>${label}</span>
                </button>`;
            }
        });
        texturePanel.innerHTML = `
            <div class="waifu-panel-header">
              <button class="waifu-panel-back" aria-label="返回">←</button>
              <span>${char.name} · 换装</span>
              <button class="waifu-panel-close" aria-label="关闭">✕</button>
            </div>
            <div class="waifu-panel-body">${html}</div>`;
    }

    hooks.on(modelPanel, "click", async event => {
        if (event.target.closest(".waifu-panel-close")) { closePanels(); return; }
        const button = event.target.closest(".model-option");
        if (!button) return;
        selectedModelIndex = parseInt(button.getAttribute("data-model-index"), 10);
        renderTexturePanel(selectedModelIndex);
        modelPanel.style.display = "none";
        openPanel(texturePanel);
    });

    hooks.on(texturePanel, "click", async event => {
        if (event.target.closest(".waifu-panel-close")) { closePanels(); return; }
        if (event.target.closest(".waifu-panel-back")) {
            texturePanel.style.display = "none";
            openPanel(modelPanel);
            return;
        }
        const button = event.target.closest(".texture-option");
        if (!button) return;
        const textureIndex = parseInt(button.getAttribute("data-texture-index"), 10);
        closePanels();
        await model.loadModel(selectedModelIndex, textureIndex);
    });

    /* ---------- 点击空白处关闭面板 ---------- */
    hooks.on(document, "click", event => {
        if (event.target.closest("#model-selection-panel-mygo") ||
            event.target.closest("#texture-selection-panel-mygo") ||
            event.target.closest("#waifu-tool-mygo") ||
            event.target.closest("#waifu-toggle-mygo")) {
            return;
        }
        closePanels();
    });
    hooks.on(document, "keydown", event => {
        if (event.key === "Escape") closePanels();
    });

    /* ---------- 交互监听 ---------- */
    registerEventListener(model, drag, hooks);

    /* ---------- 对外 API ---------- */
    const api = {
        loadModel: (charId, texId) => model.loadModel(charId, texId),
        getModelList: () => modelList,
        getState: () => ({ modelId: getModelId(), modelTexturesId: getModelTexturesId() }),
        capture: () => model.capture(),
        playRandomIdle: () => model.playRandomIdle(),
        showMessage,
        debug: () => ({
            stageChildren: model.app.stage.children.length,
            modelLoaded: !!model.model,
            modelSize: model.model ? { w: Math.round(model.model.width), h: Math.round(model.model.height) } : null,
            appRunning: !!(model.app.ticker && model.app.ticker.started),
            canvas: model.app.view ? { id: model.app.view.id, w: model.app.view.width, h: model.app.view.height } : null,
            pixiVersion: window.PIXI && window.PIXI.VERSION,
        }),
    };
    window.L2D = api;

    /* ---------- 初始化 ---------- */
    if (getModelId() === null) {
        resetModelState();
    }
    await model.loadModel(getModelId(), getModelTexturesId());

    return () => {
        hooks.stop();
        clearMessageTimer();
        try { model.app.destroy(true); } catch { /* 忽略 */ }
        for (const el of [waifu, modelPanel, texturePanel]) {
            try { if (el && el.parentNode) el.parentNode.removeChild(el); } catch { /* 忽略 */ }
        }
        if (window.L2D === api) window.L2D = undefined;
    };
}

/* ================= 拖拽 ================= */

function enableDrag(widgetEl) {
    const drag = { active: false, moved: false, startX: 0, startY: 0, originX: 0, originY: 0 };

    widgetEl.addEventListener("pointerdown", event => {
        if (event.target.closest("#waifu-tool-mygo") ||
            event.target.closest(".waifu-panel-mygo") ||
            event.target.closest("#waifu-toggle-mygo")) {
            return;
        }
        drag.active = true;
        drag.moved = false;
        drag.startX = event.clientX;
        drag.startY = event.clientY;
        const rect = widgetEl.getBoundingClientRect();
        drag.originX = rect.left;
        drag.originY = rect.top;
        widgetEl.classList.add("waifu-dragging");
        try { widgetEl.setPointerCapture(event.pointerId); } catch (error) { /* 忽略 */ }
    });

    widgetEl.addEventListener("pointermove", event => {
        if (!drag.active) return;
        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        if (!drag.moved && Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
        if (!drag.moved) return;
        const left = Math.min(Math.max(drag.originX + dx, -120), window.innerWidth - 40);
        const top = Math.min(Math.max(drag.originY + dy, -80), window.innerHeight - 40);
        widgetEl.style.left = left + "px";
        widgetEl.style.top = top + "px";
        widgetEl.style.right = "auto";
        widgetEl.style.bottom = "auto";
    });

    const endDrag = event => {
        if (!drag.active) return;
        drag.active = false;
        widgetEl.classList.remove("waifu-dragging");
        if (drag.moved) {
            const rect = widgetEl.getBoundingClientRect();
            try {
                localStorage.setItem("mygo-waifu-pos", JSON.stringify({ left: rect.left, top: rect.top }));
            } catch (error) { /* 忽略 */ }
        }
    };
    widgetEl.addEventListener("pointerup", endDrag);
    widgetEl.addEventListener("pointercancel", endDrag);

    return drag;
}

function restorePosition(widgetEl) {
    try {
        const pos = JSON.parse(localStorage.getItem("mygo-waifu-pos"));
        if (!pos || typeof pos.left !== "number" || typeof pos.top !== "number") return;
        const left = Math.min(Math.max(pos.left, -120), window.innerWidth - 40);
        const top = Math.min(Math.max(pos.top, -80), window.innerHeight - 40);
        widgetEl.style.left = left + "px";
        widgetEl.style.top = top + "px";
        widgetEl.style.right = "auto";
        widgetEl.style.bottom = "auto";
    } catch (error) { /* 忽略损坏数据 */ }
}

/* ================= 交互事件 ================= */

function registerEventListener(model, drag, hooks) {
    // 检测用户活动状态：空闲时显示消息 / 随机待机动作，鼠标移动时视线跟随
    let userAction = false;
    let idleSeconds = 0;
    let lastHoverElement;
    let lastFocusTime = 0;

    hooks.on(window, "mousemove", event => {
        userAction = true;
        const now = Date.now();
        if (now - lastFocusTime > 50) {
            lastFocusTime = now;
            model.focusAt(event.clientX, event.clientY);
        }
    });
    hooks.on(window, "mousedown", () => userAction = true);
    hooks.on(window, "keydown", () => userAction = true);
    hooks.on(window, "scroll", () => userAction = true, true);

    hooks.interval(() => {
        if (userAction) {
            userAction = false;
            idleSeconds = 0;
            return;
        }
        idleSeconds++;
        if (idleSeconds === 18) {
            // 空闲 18 秒后开始随机搭话
            showMessage(model, getMessageArray(), 6000, 9);
        } else if (idleSeconds > 18 && idleSeconds % 30 === 0) {
            // 每 30 秒播放一个随机待机动作（不弹气泡）
            model.playRandomIdle();
        }
    }, 1000);

    hooks.on(window, "mouseover", event => {
        if (event.target.closest("#live2d-mygo")) {
            showMessage(model, getMessageArray(), 4000, 9);
            return;
        }
        for (const { selector, text } of tips.mouseover) {
            if (!event.target.closest(selector)) continue;
            if (lastHoverElement === selector) return;
            lastHoverElement = selector;
            showMessage(model, randomSelection(text[getModelId()]), 4000, 10);
            return;
        }
    });
    hooks.on(window, "click", event => {
        if (drag.moved) return;
        if (event.target.closest("#live2d-mygo")) {
            showMessage(model, getMessageArray(), 4000, 9);
            return;
        }
        for (const { selector, text } of tips.mouseover) {
            if (!event.target.closest(selector)) continue;
            showMessage(model, randomSelection(text[getModelId()]), 4000, 10);
            return;
        }
    });

    hooks.on(window, "resize", () => {
        const threshold = 160;
        const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
        const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
        if (widthDiff > threshold || heightDiff > threshold) {
            showMessage(model, tips.message.console[getModelId()], 6000, 9);
        }
    });
    hooks.on(window, "copy", () => {
        showMessage(model, tips.message.copy[getModelId()], 6000, 9);
    });
    hooks.on(document, "visibilitychange", () => {
        if (!document.hidden) showMessage(model, tips.message.visibilitychange[getModelId()], 6000, 9);
    });
}

/* ================= 入口 ================= */

/**
 * 启动桌宠。返回停止函数（插件卸载时调用）：清理监听/定时器、销毁渲染器、移除 DOM。
 */
async function initWidget(config) {
    const hooks = createHooks();
    setConfig(config);
    document.getElementById("waifu-toggle-mygo")?.remove();
    document.getElementById("waifu-mygo")?.remove();
    document.body.insertAdjacentHTML("beforeend", `<div id="waifu-toggle-mygo"><span>Live2D</span></div>`);
    const toggle = document.getElementById("waifu-toggle-mygo");
    let stopWidget = () => { };
    const toggleStop = () => {
        hooks.stop();
        try { if (toggle && toggle.parentNode) toggle.parentNode.removeChild(toggle); } catch { /* 忽略 */ }
        stopWidget();
    };
    hooks.on(toggle, "click", async () => {
        toggle.classList.remove("waifu-toggle-active");
        if (toggle.getAttribute("first-time")) {
            stopWidget = await loadWidget(hooks);
            toggle.removeAttribute("first-time");
        } else {
            localStorage.removeItem("mygo-waifu-display");
            const waifuEl = document.getElementById("waifu-mygo");
            if (waifuEl) {
                waifuEl.style.display = "";
                setTimeout(() => { waifuEl.style.bottom = "20px"; }, 0);
            }
        }
    });
    if (localStorage.getItem("mygo-waifu-display") && Date.now() - localStorage.getItem("mygo-waifu-display") <= 86400000) {
        toggle.setAttribute("first-time", true);
        setTimeout(() => {
            toggle.classList.add("waifu-toggle-active");
        }, 0);
    } else {
        stopWidget = await loadWidget(hooks);
    }
    return toggleStop;
}

export { initWidget };
