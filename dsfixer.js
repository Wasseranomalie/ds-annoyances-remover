let settings = ['block-popups', 'rating-disable', 'selected-voices', 'next-video'];

showRatings = function () {
    let ratings = document.querySelectorAll(".js-ratings, .ratings");
    if (ratings.length > 0) {
        for (let rating of ratings) {
            rating.style.setProperty("display", 'flex', 'important');
        }
        return true;
    }
    return false;
}

removePopupContainer = function () {
    return removeElementWithClassName('dstpiano-container');
}

removeVoices = function () {
    const introRemoved = removeElementWithClassName('forum-intro forum-intro-stickypostings');
    const postingsRemoved = removeElementWithClassName('forum-stickypostings');
    return introRemoved && postingsRemoved;
}

stopNextVideoAutoplay = function () {
    if (document.getElementById('playerv5_box') === null) {
        return;
    }
    let svgElements = document.body.querySelectorAll('.np_icon ');
    if (svgElements.length > 0) {
        for (let svgElement of svgElements) {
            if (svgElement.childElementCount === 1) {
                let useElements = svgElement.getElementsByTagName('use');
                if (useElements.length === 1) {
                    let useElement = useElements.item(0);
                    if (useElement.getAttributeNS('http://www.w3.org/1999/xlink', 'href') === '#dmp_Cross') {
                        useElement.parentElement.parentElement.click();
                        console.log('Aborted countdown for subsequent video playback.');
                    }
                }
            }
        }
    }
}

createChangeObserver = function (executeFunctions) {

    let observer = new MutationObserver(() => {
        for (const executeFunction of executeFunctions) {
            executeFunction();
        }

        // TODO: MAYBE DISCONNECT OBSERVER ONCE ALL ELEMENTS SUCESSFULLY REMOVED
    });
    observer.observe(document.body, {
        childList: true
        , subtree: true
    });
}

removeElementWithClassName = function (className) {
    const elements = document.getElementsByClassName(className);
    if (elements.length > 0) {
        const element = elements[0];
        element.parentElement.removeChild(element);
        return true;
    }
    return false;
}

settingsDict = {};

settings.forEach((setting, x) => settingsDict[setting] = true);

window.addEventListener('load', retrieveSettings);

async function retrieveSettings() {
    let settingsStorage = await browser.storage.local.get();
    for (const setting of settings) {
        const settingValue = settingsStorage[setting];
        settingsDict[setting] = settingValue === undefined ? true : settingValue;
    }
}

retrieveSettings().then(() => {
    const functionsForObserver = [];
    if (settingsDict[settings[0]]) {
        functionsForObserver.push(removePopupContainer);
    }
    if (settingsDict[settings[1]]) {
        functionsForObserver.push(showRatings);
    }
    if (settingsDict[settings[2]]) {
        functionsForObserver.push(removeVoices);
    }
    if (settingsDict[settings[3]]) {
        functionsForObserver.push(stopNextVideoAutoplay);
    }

    createChangeObserver(functionsForObserver);

    if (settingsDict[settings[0]]) {
        removePopupContainer();
    }

    if (settingsDict[settings[1]]) {
        showRatings();
    }

    if (settingsDict[settings[2]]) {
        removeVoices();
    }

    if (settingsDict[settings[3]]) {
        stopNextVideoAutoplay();
    }
})
