// Variable Declaration
let headerAppenixNode = document.getElementById("iz-nav-list");
let navigationAppenixNode = document.getElementById("iz-nav-ul");

// Function Definition
const CreateNavigationNode = function () {
    headerAppenixNode = document.getElementById("iz-nav-list");
    navigationAppenixNode = document.getElementById("iz-nav-ul");
    if (!headerAppenixNode || !navigationAppenixNode || typeof window.impactzone === 'undefined') {
        setTimeout(CreateNavigationNode, 100);
        return;
    }
    var siteList = window.impactzone.sites;

    Object.entries(siteList).forEach(siteNavInfo => {
        const [key, value] = siteNavInfo;
        console.log(key, value);

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
            console.log(subKey, subValue);
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

// Code Execution
CreateNavigationNode();
