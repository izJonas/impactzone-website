// Create a global variable which will keep track of userInteraction
let scrollWrapperNode = document.getElementById("iz-wrapper");
let izContentEntryMainNodes = document.getElementsByClassName("iz-content-entry");
let izBannerContentNodeList = document.getElementsByClassName("iz-content-banner");
let footerWrapperNode = document.getElementById("iz-footer");
let isAnimationTimerRunning = false;

let izNodeListArray = [];
let izNodeListIndexCurrent = 0;
let izNodeListIndexMaximum = 0;


let scrollingDistance = ((window.innerHeight - 78) * 2);
let scrollingTime = 1000;
let easeInOutCubic = function (t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

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

        if (isDebug) {
            console.log(izNodeListArray[izNodeListIndexCurrent]);
            console.log(scrollingDistance);
            console.log(scrollingTime);
        }

        izNodeListArray[izNodeListIndexCurrent].scrollIntoView({ behavior: "smooth" });
        //ScrollBy(izNodeListArray[izNodeListIndexCurrent], scrollingDistance, scrollingTime, easeInOutCubic, izNodeListIndexCurrent);
        if (izNodeListIndexCurrent == izNodeListIndexMaximum) {
            if (!footerWrapperNode.classList.contains("bottom-reached")) {
                footerWrapperNode.classList.add("bottom-reached");
                scrollWrapperNode.classList.add("bottom-reached");
            }
        } else {
            if (footerWrapperNode.classList.contains("bottom-reached")) {
                footerWrapperNode.classList.remove("bottom-reached");
                scrollWrapperNode.classList.remove("bottom-reached");
            }
        }
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
    var bodyNode = document.body;

    if (!bodyNode || !scrollWrapperNode || izContentEntryMainNodes < 1 || !izBannerContentNodeList || !izBannerContentNodeList[0]) {
        setTimeout(InitScrollCustomMade, 50);
    } else {
        bodyNode.setAttribute("onmousemove", "UpdateMousePosition(event);");
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

const ScrollBy = function (element, value, duration, easingFunc, index) {
    var startTime;
    var startPos = element.scrollTop;
    //var startPos = scrollWrapperNode.scrollTop;
    var clientHeight = element.clientHeight;
    var maxScroll = scrollWrapperNode.scrollHeight - (clientHeight * index);
    var scrollIntendedDestination = startPos + ((value + 200) * index);
    // low and high bounds for possible scroll destinations
    var scrollEndValue = Math.min(Math.max(scrollIntendedDestination, 0), maxScroll);

    if (isDebug || true) {
        console.log("scrollHeight:");
        console.log(scrollWrapperNode.scrollHeight);

        console.log("Values:");
        console.log(startPos);
        console.log(clientHeight);
        console.log(maxScroll);
        console.log(scrollIntendedDestination);
        console.log(scrollEndValue);
    }

    // create recursive function to call every frame
    let scroll = function (timestamp) {
        startTime = startTime || timestamp;
        var elapsed = timestamp - startTime;
        scrollWrapperNode.scrollTop = startPos + (scrollEndValue - startPos) * easingFunc(elapsed / duration);
        elapsed <= duration && window.requestAnimationFrame(scroll);
    };
    // call recursive function
    if (startPos != scrollEndValue) window.requestAnimationFrame(scroll);
};
