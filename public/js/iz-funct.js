let isDebug = false;
let isDebugDeltaTime = true;

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
// Variable Declaration
let mainContentWrapperNode = document.getElementById("iz-wrapper");
let headerAppenixNode = document.getElementById("iz-nav-list");
let navigationAppenixNode = document.getElementById("iz-nav-ul");
let parallaxContentNodes = document.getElementsByClassName("iz-parallax-content");
let parallaxVideoNodes = document.getElementsByClassName("iz-parallax-video");
let parallaxBannerVideoNode = document.getElementById("iz-banner-background-video");
let parallaxContentNodesInView = [];
let parallaxVideoNodesInView = [];
let parallaxVideoNodesOutOfView = [];
let parallaxVideoNodeInViewRemainingHeight = [];
const parallaxVideoVisibleClass = "iz-parallax-video-visible";
const parallaxVideoInvisibleClass = "iz-parallax-video-invisible";
const parallaxVideoOnTopZIndex = "iz-parallax-video-z-top";

// Function Definition
const CreateNavigationNode = function () {
    headerAppenixNode = document.getElementById("iz-nav-list");
    navigationAppenixNode = document.getElementById("iz-nav-ul");
    if (!headerAppenixNode || !navigationAppenixNode || typeof window.impactzone === 'undefined') {
        setTimeout(CreateNavigationNode, 100);
        return;
    }
    var siteList = window.impactzone.navSites;

    Object.entries(siteList).forEach(siteNavInfo => {
        const [key, value] = siteNavInfo;
        if (isDebug) {
            console.log(key, value);
        }

        if (key === "logo") {
            var fotoElementNode = document.createElement("img");
            fotoElementNode.id = value.id;
            fotoElementNode.src = value.src;
            headerAppenixNode.prepend(fotoElementNode);
        }
        else if (key === "search") {
            var searchElementNode = document.createElement("form");
            searchElementNode.classList.add(value.class);
            searchElementNode.method = value.method;
            searchElementNode.action = value.action;

            var searchElementInputNode = document.createElement("input");
            searchElementInputNode.name = value.name;
            searchElementInputNode.id = value.id;
            searchElementInputNode.type = value.type
            searchElementInputNode.placeholder = value.placeholder;

            var searchElementIconNode = document.createElement("i");
            searchElementIconNode.classList.add("fas");
            searchElementIconNode.classList.add("fa-search");

            headerAppenixNode.append(searchElementNode);
            searchElementNode.append(searchElementInputNode);
            searchElementNode.append(searchElementIconNode);
        }
        else {
            CreateNavigationWithSubnavList(value);
        }
    });
    MarkSelectedNavPoint();
}

const CreateNavigationWithSubnavList = function (navigationValue) {
    var listElementNode = document.createElement("li");
    listElementNode.classList.add("nav-entry");

    var listElementLinkNode = document.createElement("a");
    listElementLinkNode.innerHTML = navigationValue.label;
    listElementLinkNode.setAttribute("href", navigationValue.href);

    navigationAppenixNode.append(listElementNode);
    listElementNode.append(listElementLinkNode);

    if (typeof navigationValue.subsites !== 'undefined') {
        listElementNode.classList.add("nav-entry-sublist");
        listElementNode.removeAttribute("href");
        var unorderedListNode = document.createElement("ul");
        unorderedListNode.classList.add("iz-subnav-ul");
        listElementNode.append(unorderedListNode);

        Object.entries(navigationValue.subsites).forEach(subsiteNavInfo => {
            const [subKey, subValue] = subsiteNavInfo;
            if (isDebug) {
                console.log(subKey, subValue);
            }
            var sublistElementNode = document.createElement("li");
            sublistElementNode.classList.add("nav-sub-entry");

            var sublistElementLinkNode = document.createElement("a");
            sublistElementLinkNode.innerHTML = subValue.label;
            sublistElementLinkNode.setAttribute("href", subValue.href);

            unorderedListNode.append(sublistElementNode);
            sublistElementNode.append(sublistElementLinkNode);
        });
    }
};

const OnLoadParallaxScrollFunction = function () {
    var izDocumentBody = document.body;
    if (izDocumentBody && izDocumentBody.onload === null) {
        izDocumentBody.onload = AddParallaxScrollFunction;
    } else {
        setTimeout(OnLoadParallaxScrollFunction, 50);
    }
};


const AddParallaxScrollFunction = function () {
    var izWrapperNode = document.getElementById("iz-wrapper");
    if (izWrapperNode) {
        if (izWrapperNode.getAttribute("onscroll") !== "SetPrallaxVideoVisible()") {
            izWrapperNode.setAttribute("onscroll", "SetPrallaxVideoVisible()");
        }
    } else {
        setTimeout(AddParallaxScrollFunction, 100);
    }
};

const ScrollBannerParallaxHeight = function () {
    parallaxBannerVideoNode = document.getElementById("iz-banner-background-video");
    mainContentWrapperNode = document.getElementById("iz-wrapper");
    if (!parallaxBannerVideoNode || !mainContentWrapperNode) {
        return;
    }
    if (isDebug) {
        console.log(mainContentWrapperNode.scrollTop);
    }

    if (mainContentWrapperNode.scrollTop > parallaxBannerVideoNode.parentNode.clientHeight - 78) {
        if (!parallaxBannerVideoNode.classList.contains(parallaxVideoInvisibleClass)) {
            parallaxBannerVideoNode.classList.add(parallaxVideoInvisibleClass);
        }
    } else if (mainContentWrapperNode.scrollTop < parallaxBannerVideoNode.parentNode.clientHeight - 78) {
        if (parallaxBannerVideoNode.classList.contains(parallaxVideoInvisibleClass)) {
            parallaxBannerVideoNode.classList.remove(parallaxVideoInvisibleClass);
        }
    }
};

const SetPrallaxVideoVisible = function () {
    ScrollBannerParallaxHeight();
    parallaxVideoNodes = document.getElementsByClassName("iz-parallax-video");
    parallaxContentNodes = document.getElementsByClassName("iz-parallax-content");
    if (parallaxVideoNodes && parallaxVideoNodes.length == 1) {
        parallaxVideoNodes[0].classList.add(parallaxVideoVisibleClass);
    } else {
        var parallaxContentCount = 0;
        parallaxContentNodesInView = [];
        parallaxVideoNodesInView = [];
        parallaxVideoNodesOutOfView = [];
        for (var parallaxContentNode of parallaxContentNodes) {
            if (CheckVisible(parallaxContentNode)) {
                //parallaxVideoNodeInViewRemainingHeight.push(CheckRemainingParallaxHeight(parallaxContentNode));
                parallaxContentNodesInView.push(parallaxContentNode);
                parallaxContentCount++;
                var parallaxIndex = parallaxContentNode.getAttribute("izparallaxindex");
                var matchingVideoNode;
                if (parallaxIndex) {
                    matchingVideoNode = document.getElementsByClassName("iz-parallax-video-index-" + parallaxIndex)[0];
                    if (matchingVideoNode) {
                        parallaxVideoNodesInView.push(matchingVideoNode);
                    }
                }
            }
        }
        for (var parallaxVideoNode of parallaxVideoNodes) {
            if (!parallaxVideoNodesInView.includes(parallaxVideoNode)) {
                parallaxVideoNodesOutOfView.push(parallaxVideoNode);
            }
        }
        if (parallaxContentCount > 0) {
            SetParallaxClassesForAll();
            if (parallaxVideoNodesInView.length > 0) {
                var parallaxContentNode = parallaxContentNodesInView[0];
                parallaxVideoNodesInView[0].children[0].style.maxHeight = CheckRemainingParallaxHeight(parallaxContentNodes[0]) + "px";
            }
        }
    }
};

const SetParallaxClassesForAll = function () {
    var parallaxIndexInView = 0;
    for (var visibleParallaxNode of parallaxContentNodesInView) {
        var parallaxIndexCurrent = visibleParallaxNode.getAttribute("izparallaxindex");
        var matchingParallaxVideoFound = document.getElementsByClassName("iz-parallax-video-index-" + parallaxIndexCurrent)[0];
        if (parallaxIndexCurrent && parallaxIndexInView == 0) {
            if (matchingParallaxVideoFound && !matchingParallaxVideoFound.classList.contains(parallaxVideoOnTopZIndex)) {
                matchingParallaxVideoFound.classList.add(parallaxVideoOnTopZIndex);
            }
        } else if (parallaxVideoNodesInView.length > 0) {
            if (matchingParallaxVideoFound && matchingParallaxVideoFound.classList.contains(parallaxVideoOnTopZIndex)) {
                matchingParallaxVideoFound.classList.remove(parallaxVideoOnTopZIndex);
            }
        }
        parallaxIndexInView++;
    }

    for (var parallaxVideoNode of parallaxVideoNodes) {
        if (!parallaxVideoNodesInView.includes(parallaxVideoNode)) {
            if (parallaxVideoNode && parallaxVideoNode.classList.contains(parallaxVideoVisibleClass)) {
                parallaxVideoNode.classList.remove(parallaxVideoVisibleClass);
                if (!parallaxVideoNode && parallaxVideoNode.classList.contains(parallaxVideoInvisibleClass)) {
                    parallaxVideoNode.classList.add(parallaxVideoInvisibleClass);
                }
            }
            if (parallaxVideoNode.children[0].style.maxHeight != '') {
                parallaxVideoNode.children[0].style.maxHeigh = '';
            }
        } else {
            if (parallaxVideoNode && !parallaxVideoNode.classList.contains(parallaxVideoVisibleClass)) {
                parallaxVideoNode.classList.add(parallaxVideoVisibleClass);
                if (parallaxVideoNode && parallaxVideoNode.classList.contains(parallaxVideoInvisibleClass)) {
                    parallaxVideoNode.classList.remove(parallaxVideoInvisibleClass);
                }
            }
            if (parallaxVideoNodesInView.length > 0) {
                var parallaxContentNode = parallaxContentNodesInView[0];
                parallaxVideoNodesInView[0].children[0].style.maxHeight = CheckRemainingParallaxHeight(parallaxContentNode) + "px";
                if (parallaxVideoNodesInView.length > 1) {
                    parallaxVideoNodesInView[1].children[0].style.maxHeight = '';
                }
            } else {
                if (!parallaxVideoNode.classList.contains(parallaxVideoInvisibleClass)) {
                    parallaxVideoNode.classList.add(parallaxVideoInvisibleClass);
                }
            }
        }
    }

};

const CheckVisible = function (element) {
    var rect = element.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - ((viewHeight - 78) * 2) >= 0);
};

const CheckRemainingParallaxHeight = function (element) {
    var rect = element.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    var remainingHeight = viewHeight * 2 + rect.top;
    return remainingHeight - 200;
};

const MarkSelectedNavPoint = function () {
    var navListNode = document.getElementById("iz-nav-ul");
    var pathnameToLookFor = "";
    if (!navListNode) {
        setTimeout(MarkSelectedNavPoint, 50);
        return;
    }
    if ((window.location.href.endsWith("/") && window.location.pathname == "/") || window.location.href.endsWith("premiumFullService")) {
        pathnameToLookFor = "/";
        for (var navListEntryNode of navListNode.children) {
            if (navListEntryNode.children && navListEntryNode.children[0] && navListEntryNode.children[0].getAttribute("href")) {
                var pathNameFound = navListEntryNode.children[0].getAttribute("href");
                if (pathNameFound && pathNameFound == pathnameToLookFor) {
                    navListEntryNode.classList.add("iz-nav-item-selected");
                }
            }
        }
    }
};

const SetInitialNavigationClass = function () {
    var navNode = document.getElementById("iz-nav-list");
    if (!navNode) {
        setTimeout(SetInitialNavigationClass, 50);
        return;
    }
    if (!navNode.classList.contains("iz-nav-fade-in")) {
        navNode.classList.add("iz-nav-fade-in");
    }
};
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

        ScrollBy(izNodeListArray[izNodeListIndexCurrent], scrollingDistance, scrollingTime, easeInOutCubic, izNodeListIndexCurrent);
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
// Code Execution
CreateNavigationNode();
SetInitialNavigationClass();
OnLoadParallaxScrollFunction();
InitScrollCustomMade();
