let shouldScroll = true;
let delayReg;
let deltaSinceLastMeasure = 0;
let timestampLastMeasure;
let isDeltaTimerActive = false;

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
};

/*if ((isDeltaTimerActive && GetDeltaTime() > 3000) || !isDeltaTimerActive) {
    }*/

/*
if (!isDeltaTimerActive) {
    ToggleDeltaTimer();
}
*/

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