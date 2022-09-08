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
    if (mainContentWrapperNode.scrollTop < 377) {
        parallaxBannerVideoNode.children[0].style.top = (77 - mainContentWrapperNode.scrollTop) + "px";
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
            }
            if (parallaxVideoNode.children[0].style.maxHeight != '') {
                parallaxVideoNode.children[0].style.maxHeigh = '';
            }
        } else {
            if (parallaxVideoNode && !parallaxVideoNode.classList.contains(parallaxVideoVisibleClass)) {
                parallaxVideoNode.classList.add(parallaxVideoVisibleClass);
            }
            if (parallaxVideoNodesInView.length > 0) {
                var parallaxContentNode = parallaxContentNodesInView[0];
                parallaxVideoNodesInView[0].children[0].style.maxHeight = CheckRemainingParallaxHeight(parallaxContentNode) + "px";
                if (parallaxVideoNodesInView.length > 1) {
                    parallaxVideoNodesInView[1].children[0].style.maxHeight = '';
                }
            }
        }
    }

};

const CheckVisible = function (element) {
    var rect = element.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
};

const CheckRemainingParallaxHeight = function (element) {
    var rect = element.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    var remainingHeight = viewHeight * 2 + rect.top;
    return remainingHeight;
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
