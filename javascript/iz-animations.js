
let spanNodeFound;
let cssToAppend = '.iz-animation-text-flow:hover > span > span.iz-animation-hover { text-shadow: ';
let styleCssNode = document.createElement('style');
let appendedStyleNodes = [];
let mousePositionX;
let mousePositionY;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const ChangeShadowAnimationColor = function (element) {
    return;
    var randomSeed = getRandomInt(1, 365);
    var randomCss = cssToAppend;
    var wasSpanNodeFound = false;
    var removeChildNodes = false;
    for (var spanNode of element.children) {
        if (IsRectInMousePosition(spanNode.getBoundingClientRect())) {
            if (spanNodeFound && spanNodeFound.classList.contains("iz-animation-hover") && spanNode !== spanNodeFound) {
                removeChildNodes = true;
                spanNodeFound.classList.remove("iz-animation-hover");
            }
        }
        spanNode.classList.add("iz-animation-hover");
        wasSpanNodeFound = true;
        spanNodeFound = spanNode;
        break;
    }

    if (wasSpanNodeFound) {
        if (removeChildNodes) {
            for (var nodeStyle of appendedStyleNodes) {
                document.getElementsByTagName('head')[0].removeChild(nodeStyle);
            }
            appendedStyleNodes = [];
        }
        if (isDebug) {
            console.log(spanIndex);
        }
        randomCss += "" + getRandomInt(-4, 2) + "px " + getRandomInt(-4, 2) + "px " + getRandomInt(0, 10) + "px hsla(" + randomSeed + ", 60%, 60%, 1) !important;transition: all 0.3s ease};";
        if (styleCssNode.styleSheet) {
            styleCssNode.styleSheet.cssText = randomCss;
        } else {
            styleCssNode.appendChild(document.createTextNode(randomCss));
        }
        document.getElementsByTagName('head')[0].appendChild(styleCssNode);
        appendedStyleNodes.push(styleCssNode);
    }
};

const UpdateMousePosition = function (event) {
    mousePositionX = event.clientX;
    mousePositionY = event.clientY;
    if (isDebug) {
        console.log("X is --> " + mousePositionX);
        console.log("Y is --> " + mousePositionY);
    }
};

const IsRectInMousePosition = function (rect) {
    var isInRect = false;
    var isInXAxis = false;
    var isInYAxis = false;
    if (mousePositionX > rect.x && mousePositionX < rect.x + rect.width) {
        if (isDebug) {
            console.log("Is in X....");
        }
        isInXAxis = true;
    }
    if (mousePositionY > rect.y && mousePositionY < rect.y + rect.height) {
        if (isDebug) {
            console.log("Is in Y....");
        }
        isInYAxis = true;
    }
    if (isInXAxis && isInYAxis) {
        isInRect = true;
    }
    if (isDebug) {
        console.log(isInRect);
    }
    return isInRect;
};
