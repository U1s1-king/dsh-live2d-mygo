// vendor 全局（dsh 插件环境：脚本由 host 同源路由注入，client bundle 加载时可能
// 尚未就绪，故用惰性 getter 延迟解析到 widget 启动时刻）
const PIXI = { get Application() { return window.PIXI.Application; } };
const Live2DModel = { get value() { return window.PIXI.live2d.Live2DModel; } };
import { getModelId, setModelId, getModelTexturesId, setModelTexturesId, getConfig, updateMessageArray } from "./config.js";
import showMessage from "./message.js";
import modelList from "./modelList.js";
import tips from "./tips.js";

/**
 * 适合作为随机待机动作的 motion 组名。
 * 各角色的可用动作集不同，加载时会被过滤成该角色实际存在的集合。
 */
const IDLE_MOTIONS = [
    "smile01", "smile02", "smile03", "thinking01", "thinking02",
    "nf01", "nf02", "nnf01", "nnf02", "kandou01", "kime01",
    "sad01", "surprised01", "serious01", "shame01",
    "niya01", "ando01", "odoodo01", "sigh01",
];

class Model {
    constructor() {
        this.cdnPath = getConfig().cdnPath;
        this.app = new PIXI.Application({
            view: document.getElementById("live2d-mygo"),
            autoStart: true,
            width: 800,
            height: 800,
            backgroundAlpha: 0,
        });
        this.modelList = modelList;
        this.tips = tips;
        this.model = null;
        this.modelIndex = null;
        this.modelMotions = [];
        this.modelExpressions = [];
        this.idleMotions = [];
    }

    async loadModel(modelId, modelTexturesId, message) {
        if (modelId >= this.modelList.length) {
            modelId %= this.modelList.length;
        }
        if (modelTexturesId >= this.modelList[modelId].length) {
            modelTexturesId %= this.modelList[modelId].length;
        }
        setModelId(modelId);
        setModelTexturesId(modelTexturesId);
        console.log(`Live2D Model ${modelId}-${modelTexturesId}`);
        showMessage(this, message, 4000, 10);

        const target = this.modelList[modelId][modelTexturesId];
        const url = `${this.cdnPath}model/${target}/index.json`;

        try {
            this.modelIndex = await fetch(url).then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            });
        } catch (error) {
            console.error(`模型加载失败: ${url}`, error);
            showMessage(this, { text: "呜……模型加载失败了，换个衣服试试？", motion: "sad01" }, 5000, 10);
            return;
        }

        this.modelIndex.url = url;

        // 兜底：部分模型没有 idle 组，使用 idle01
        if (!this.modelIndex.motions.idle && this.modelIndex.motions.idle01) {
            this.modelIndex.motions.idle = this.modelIndex.motions.idle01;
        }
        // 兜底：补充 idle 表情
        if (Array.isArray(this.modelIndex.expressions) &&
            !this.modelIndex.expressions.find(expression => expression.name === "idle") &&
            this.modelIndex.expressions.find(expression => expression.name === "idle01")) {
            this.modelIndex.expressions.push({
                name: "idle",
                file: this.modelIndex.expressions.find(expression => expression.name === "idle01").file
            });
        }

        this.modelMotions = Object.keys(this.modelIndex.motions || {});
        this.modelExpressions = (this.modelIndex.expressions || []).map(expression => expression.name);
        this.idleMotions = IDLE_MOTIONS.filter(motion => this.modelMotions.includes(motion));

        this.app.stage.removeChildren();
        try {
            this.model = await Live2DModel.value.from(this.modelIndex, { motionPreload: getConfig().preload });
        } catch (error) {
            console.error("Live2D 模型渲染初始化失败", error);
            showMessage(this, { text: "呜……渲染器罢工了，刷新一下试试？", motion: "sad01" }, 5000, 10);
            return;
        }
        this.app.stage.addChild(this.model);
        this.model.scale.set(0.33);
        updateMessageArray(this.tips);
    }

    /** 播放一个随机的待机动作（不弹气泡） */
    playRandomIdle() {
        if (!this.model || !this.idleMotions.length) return;
        const motion = this.idleMotions[Math.floor(Math.random() * this.idleMotions.length)];
        try {
            this.model.motion(motion);
        } catch (error) { /* 单个动作失败不影响整体 */ }
    }

    /** 随机切换一个表情 */
    playRandomExpression() {
        if (!this.model || !this.modelExpressions.length) return;
        const expression = this.modelExpressions[Math.floor(Math.random() * this.modelExpressions.length)];
        try {
            this.model.expression(expression);
        } catch (error) { /* 忽略 */ }
    }

    /** 让模型视线跟随屏幕坐标（canvas 空间，可超出 0~800） */
    focusAt(clientX, clientY) {
        if (!this.model) return;
        const canvas = this.app.view;
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const x = (clientX - rect.left) * (canvas.width / rect.width);
        const y = (clientY - rect.top) * (canvas.height / rect.height);
        try {
            this.model.focus(x, y);
        } catch (error) { /* 忽略 */ }
    }

    /** 截取当前画面为 PNG dataURL */
    capture() {
        if (!this.model) return null;
        try {
            const canvas = this.app.renderer.plugins.extract.canvas(this.app.stage);
            return canvas.toDataURL("image/png");
        } catch (error) {
            try {
                return this.app.view.toDataURL("image/png");
            } catch (error2) {
                return null;
            }
        }
    }
}

export default Model;
