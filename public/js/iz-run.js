let navigationAppenixNode = document.getElementById("iz-nav-ul");

const CreateNavigationNode = function() {
    navigationAppenixNode = document.getElementById("iz-nav-ul");
    var siteList = window.impactzone.sites;
    if (!navigationAppenixNode) {
        setTimeout(CreateNavigationNode, 100);
    }
    debugger;
    for (var siteNavInfo in siteList) {
        var listElementNode = document.createElement("li");
        listElementNode.classList.add("nav-entry");
        listElementNode.innerHTML = siteList.siteNavInfo.label;
        listElementNode.setAttribute("href", siteList.siteNavInfo.href);
        navigationAppenixNode.append(listElementNode);

        if (siteList[siteNavInfo].subsites) {
            var unorderedListNode = document.createElement("ul");
            unorderedListNode.classList.add("iz-subnav-ul");
            listElementNode.append(unorderedListNode);

            for (var subsiteNavInfo in siteList[siteNavInfo].subsites) {
                var sublistElementNode = document.createElement("li");
                sublistElementNode.classList.add("nav-sub-entry");
                sublistElementNode.innerHTML = siteList.siteNavInfo.subsites.subsiteNavInfo.label;
                sublistElementNode.setAttribute("href", siteList.siteNavInfo.subsites.subsiteNavInfo.href);
                unorderedListNode.append(sublistElementNode);
            }
        }
    }
}