let navigationAppenixNode = document.getElementById("iz-nav-ul");

const CreateNavigationNode = function() {
    var siteList = window.impactzone.sites;

    for(var siteNavInfo of siteList) {
        var listElementNode = document.createElement("li");
        listElementNode.classList.add("nav-entry");
        listElementNode.innerHTML = siteNavInfo.label;
        listElementNode.setAttribute("href", siteNavInfo.href);
        navigationAppenixNode.append(listElementNode);

        if(siteNavInfo.subsites) {
            var unorderedListNode = document.createElement("ul");
            unorderedListNode.classList.add("iz-subnav-ul");
            listElementNode.append(unorderedListNode);

            for(var subsiteNavInfo of siteNavInfo.subsites) {
                var sublistElementNode = document.createElement("li");
                sublistElementNode.classList.add("nav-sub-entry");
                sublistElementNode.innerHTML = subsiteNavInfo.label;
                sublistElementNode.setAttribute("href", subsiteNavInfo.href);
                unorderedListNode.append(sublistElementNode);
            }
        }
    }
}
