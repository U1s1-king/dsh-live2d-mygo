/* 工具按钮 SVG 图标（Font Awesome Free 6.2.0，CC BY 4.0，内联为 data URL） */
const fa_circle_user = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 272c39.8 0 72-32.2 72-72s-32.2-72-72-72s-72 32.2-72 72s32.2 72 72 72z"/></svg>');
const fa_camera_retro = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M220.6 121.2L271.1 96 448 96v96H333.2c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24H64V128H192c9.9 0 19.7-2.3 28.6-6.8zM0 128V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H271.1c-9.9 0-19.7 2.3-28.6 6.8L192 64H160V48c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM344 304c0 48.6-39.4 88-88 88s-88-39.4-88-88s39.4-88 88-88s88 39.4 88 88z"/></svg>');
const fa_circle_info = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"/></svg>');
const fa_xmark = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>');

import showMessage from "./message.js";

const tools = {
    "switch-model": {
        icon: fa_circle_user,
        callback: () => { }
    },
    "photo": {
        icon: fa_camera_retro,
        callback: () => { } // 在 index.js 中注入 model 实例
    },
    "info": {
        icon: fa_circle_info,
        callback: () => {
            showMessage(
                { expression: () => null, motion: () => null },
                { text: "MyGO!!!!! Live2D 桌宠插件 · 5 角色 × 74 套换装", motion: "smile01" },
                4000, 10
            );
        }
    },
    "quit": {
        icon: fa_xmark,
        callback: () => {
            localStorage.setItem("mygo-waifu-display", Date.now());
            const waifu = document.getElementById("waifu-mygo");
            if (waifu) waifu.style.bottom = "-500px";
            // 异步卸载防护：定时器触发时元素可能已被移除，空值跳过
            setTimeout(() => {
                const toggle = document.getElementById("waifu-toggle-mygo");
                if (toggle) toggle.classList.add("waifu-toggle-active");
            }, 3000);
        }
    }
};

export default tools;
