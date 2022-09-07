// Create a global variable which will keep track of userInteraction
let shouldScroll = true;
let scrollWrapperNode = document.getElementById("iz-wrapper");
let delayReg;
let izContentEntryMainNodes = document.getElementsByClassName("iz-content-entry");
let izContentEntryIndexCurrent = 0;
let deltaSinceLastMeasure = 0;
let timestampLastMeasure;
let isDeltaTimerActive = false;
let is3SecondTimerRunning = false;

const AddCustomScrollBehaviour = function () {
    if (shouldScroll) {
        if (deltaY > 0) {
            scrollDown();
        }
        else if (deltaY < 0) {
            scrollUp();
        }
    } else {
        // Change back to false to prevent further scrolling.
        shouldScroll = false;
        return;
    }
};
/* call this function when user interaction occurs
 and you want to allow scrolling function  again.. */
const EnableUserScrollInteraction = function () {
    // set to true to allow scrolling
    shouldScroll = true;
};

// add the event listener, and call the function when triggered
/*window.addEventListener('wheel', () => AddCustomScrollBehaviour);*/

const CutomScrollPage = (deltaY) => {
    var heightToScroll = (window.innerHeight - 78) / 2;
    var heightToScrollNegative = (heightToScroll) * -1;
    if (isDebug) {
        console.log("Height: " + heightToScroll);
        console.log("DeltaY: " + deltaY);
    }
    if (deltaY > 0) {
        scrollWrapperNode.scrollBy({ top: heightToScroll, behavior: 'smooth' });
    }
    else if (deltaY < 0) {
        scrollWrapperNode.scrollBy({ top: heightToScrollNegative, behavior: 'smooth' });
    }
};

const AssureWrapperNodeIsSet = function () {
    scrollWrapperNode = document.getElementById("iz-wrapper");
    if (!scrollWrapperNode) {
        setTimeout(AssureWrapperNodeIsSet, 50);
    } else {
        AddEventListenerForCustomScroll();
    }
};

const AddEventListenerForCustomScroll = function () {
    scrollWrapperNode.addEventListener('wheel', ({ deltaY }) => {
        clearTimeout(delayReg);
        delayReg = setTimeout(CutomScrollPage.bind(deltaY), 1000);
    });
};

const ScrollCustomMade = function (event) {
    var heightToScroll = (window.innerHeight - 78) / 2;
    var heightToScrollNegative = (heightToScroll) * -1;
    if (isDebug) {
        console.log(event);
        console.log(heightToScroll);
        console.log(heightToScrollNegative);
    }
    event.preventDefault();
    if (!is3SecondTimerRunning) {
        if (event.wheelDelta > 0 && izContentEntryIndexCurrent > 0) {
            izContentEntryMainNodes[izContentEntryIndexCurrent--].scrollIntoView({ behavior: "smooth" });
        } else if (event.wheelDelta < 0 && izContentEntryMainNodes.length > izContentEntryIndexCurrent) {
            izContentEntryMainNodes[izContentEntryIndexCurrent++].scrollIntoView({ behavior: "smooth" });
        }
        Run3SecondTimer();
    }
    /*if ((isDeltaTimerActive && GetDeltaTime() > 3000) || !isDeltaTimerActive) {
    }*/

    /*
    if (!isDeltaTimerActive) {
        ToggleDeltaTimer();
    }
    */
};

const InitScrollCustomMade = function () {
    scrollWrapperNode = document.getElementById("iz-wrapper");
    izContentEntryMainNodes = document.getElementsByClassName("iz-content-entry");
    if (!scrollWrapperNode || izContentEntryMainNodes < 1) {
        setTimeout(InitScrollCustomMade, 50);
    } else {
        scrollWrapperNode.setAttribute("onwheel", "ScrollCustomMade(event);");
    }
};

const Run3SecondTimer = function () {
    if (!is3SecondTimerRunning) {
        is3SecondTimerRunning = true;
        setTimeout(function () {
            is3SecondTimerRunning = false;
        }, 3000);
    }
};

const ToggleDeltaTimer = function () {
    if (!isDeltaTimerActive) {
        timestampLastMeasure = Date.now();
        deltaSinceLastMeasure = 0;
        isDeltaTimerActive = true;
        if (isDebugDeltaTime) {
            console.log("Delta Timer Toggled: ON");
        }
    } else {
        timestampLastMeasure = null;
        deltaSinceLastMeasure = 0;
        isDeltaTimerActive = false;
        if (isDebugDeltaTime) {
            console.log("Delta Timer Toggled: OFF");
        }
    }
};

const GetDeltaTime = function () {
    if (isDeltaTimerActive) {
        if (timestampLastMeasure) {
            deltaSinceLastMeasure += Date.now() - timestampLastMeasure;
        }
        if (isDebug || isDebugDeltaTime) {
            console.log("deltaSinceLastMeasure");
            console.log(deltaSinceLastMeasure);
        }
        timestampLastMeasure = Date.now();
        if (isDebug || isDebugDeltaTime) {
            console.log("timestampLastMeasure");
            console.log(timestampLastMeasure);
        }
        return deltaSinceLastMeasure;
    } else {
        ToggleDeltaTimer();
        var deltaMillis = GetDeltaTime();
        if (isDebugDeltaTime) {
            log.console("deltaMillis");
            log.console(deltaMillis);
        }
        return deltaMillis;
    }
}