import randomSelection from "./utils.js";

let messageTimer;

function showMessage(model, text, timeout, priority) {
    if (!text) return;
    const storedPriority = parseInt(sessionStorage.getItem("waifu-text"), 10);
    if (!Number.isNaN(storedPriority) && storedPriority > priority) return;
    if (messageTimer) {
        clearTimeout(messageTimer);
        messageTimer = null;
    }
    text = randomSelection(text);
    sessionStorage.setItem("waifu-text", priority);
    const tips = document.getElementById("waifu-tips");
    if (tips) {
        tips.innerHTML = text.text || "";
        tips.classList.add("waifu-tips-active");
    }
    messageTimer = setTimeout(() => {
        sessionStorage.removeItem("waifu-text");
        if (tips) tips.classList.remove("waifu-tips-active");
    }, timeout);
    if (model && model.model) {
        if (text.motion) {
            try { model.model.motion(text.motion); } catch (error) { /* 忽略单个动作失败 */ }
        }
        if (text.expression) {
            try { model.model.expression(text.expression); } catch (error) { /* 忽略 */ }
        }
    }
}

/** 清理未完成的气泡定时器（插件卸载 / HMR 重建时调用，防止残留 setTimeout）。 */
export function clearMessageTimer() {
    if (messageTimer) {
        clearTimeout(messageTimer);
        messageTimer = null;
    }
}

export default showMessage;
