function readStoredId(key) {
    const value = parseInt(localStorage.getItem(key), 10);
    return Number.isNaN(value) || value < 0 ? null : value;
}

let modelId = readStoredId("mygo-modelId");
let modelTexturesId = readStoredId("mygo-modelTexturesId");
let config = {};
let messageArray = [];

export function getModelId() {
    if (modelId === null || modelId === undefined) {
        resetModelState();
    }
    return modelId;
}

export function setModelId(newModelId) {
    modelId = newModelId;
    localStorage.setItem("mygo-modelId", newModelId.toString());
}

export function getModelTexturesId() {
    if (modelTexturesId === null || modelTexturesId === undefined) {
        resetModelState();
    }
    return modelTexturesId;
}

export function setModelTexturesId(newModelTexturesId) {
    modelTexturesId = newModelTexturesId;
    localStorage.setItem("mygo-modelTexturesId", newModelTexturesId.toString());
}

export function resetModelState() {
    modelId = 0;
    modelTexturesId = 0;
    localStorage.setItem("mygo-modelId", "0");
    localStorage.setItem("mygo-modelTexturesId", "0");
}

export function getConfig() {
    return config;
}

export function setConfig(newConfig) {
    config = newConfig;
}

export function getMessageArray() {
    return messageArray;
}

export function updateMessageArray(result) {
    messageArray = result.message.default[getModelId()];
    result.seasons.forEach(({ date, text }) => {
        const now = new Date(),
            nowMonth = now.getMonth() + 1,
            nowDate = now.getDate(),
            after = date.split("-")[0],
            afterMonth = parseInt(after.split("/")[0]),
            afterDate = parseInt(after.split("/")[1]),
            before = date.split("-")[1] || after,
            beforeMonth = parseInt(before.split("/")[0]),
            beforeDate = parseInt(before.split("/")[1]);
        const isCrossYear = afterMonth > beforeMonth;
        let isInRange = false;
        if (isCrossYear) {
            isInRange =
                (nowMonth > afterMonth || (nowMonth === afterMonth && nowDate >= afterDate)) ||
                (nowMonth < beforeMonth || (nowMonth === beforeMonth && nowDate <= beforeDate));
        } else {
            isInRange =
                (nowMonth > afterMonth || (nowMonth === afterMonth && nowDate >= afterDate)) &&
                (nowMonth < beforeMonth || (nowMonth === beforeMonth && nowDate <= beforeDate));
        }
        if (isInRange) {
            for (let t of text[getModelId()]) {
                messageArray.push(t);
            }
        }
    });
    result.time.forEach(({ hour, text }) => {
        const now = new Date(),
            after = hour.split("-")[0],
            before = hour.split("-")[1] || after;
        if (after <= now.getHours() && now.getHours() <= before) {
            for (let t of text[getModelId()]) {
                messageArray.push(t);
            }
        }
    });
}
