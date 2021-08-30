let settings = ['block-popups', 'rating-disable', 'selected-voices', 'next-video'];

async function saveOptions(e) {
    e.preventDefault();

    const settingsDict = {};

    settings.forEach((setting, x) => {
        settingsDict[setting] = document.querySelector("#" + setting).checked;
    });
    await browser.storage.local.set(settingsDict)
}

async function restoreOptions() {
    function setCurrentChoice(settingsStorage) {
        for (const setting of settings) {
            const value = settingsStorage[setting];
            console.log(value)
            document.querySelector("#" + setting).checked = value === undefined ? true : value;
        }
    }

    let settingsStorage = await browser.storage.local.get();
    setCurrentChoice(settingsStorage);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
