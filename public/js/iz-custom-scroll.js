// Create a global variable which will keep track of userInteraction
let scrollWrapperNode = document.getElementById("iz-wrapper");
let izContentEntryMainNodes = document.getElementsByClassName("iz-content-entry");
let izBannerContentNodeList = document.getElementsByClassName("iz-content-banner");

let isAnimationTimerRunning = false;

let izNodeListArray = [];
let izNodeListIndexCurrent = 0;
let izNodeListIndexMaximum = 0;

const ScrollCustomMade = function (event) {
    event.preventDefault();
    event.cancelBubble = true;
    if (!isAnimationTimerRunning) {
        if (event.wheelDelta > 0 && izNodeListIndexCurrent > 0) {
            izNodeListIndexCurrent--;
        } else if (event.wheelDelta < 0 && izNodeListIndexCurrent < izNodeListIndexMaximum) {
            izNodeListIndexCurrent++;
        } else {
            console.log("index didnt change");
        }

        izNodeListArray[izNodeListIndexCurrent].scrollIntoView({ behavior: "smooth" });

        RunAnimationTimer();
    } else {
        console.log("Animation Timer running.... cancelling!");
    }
};

const InitScrollCustomMade = function () {
    scrollWrapperNode = document.getElementById("iz-wrapper");
    izBannerContentNodeList = document.getElementsByClassName("iz-content-banner");
    izContentEntryMainNodes = document.getElementsByClassName("iz-content-entry");
    izNodeListArray = [];

    if (!scrollWrapperNode || izContentEntryMainNodes < 1 || !izBannerContentNodeList || !izBannerContentNodeList[0]) {
        setTimeout(InitScrollCustomMade, 50);
    } else {
        for (var izBannerNode of izBannerContentNodeList) {
            izNodeListArray.push(izBannerNode);
        }
        for (var izContentNode of izContentEntryMainNodes) {
            izNodeListArray.push(izContentNode);
        }
        izNodeListIndexMaximum = izNodeListArray.length - 1;
        scrollWrapperNode.setAttribute("onwheel", "ScrollCustomMade(event);");
    }
};

const RunAnimationTimer = function () {
    if (!isAnimationTimerRunning) {
        isAnimationTimerRunning = true;

        setTimeout(function () {
            isAnimationTimerRunning = false;
        }, 500);
    }
};