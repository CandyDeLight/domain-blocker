chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if(request.type == "pauseOrUnpauseExtension") {
        if(request.pauseOrUnpauseExtension == true) {
            //if the extension is not paused it will be paused here
            chrome.storage.local.set({'isPause': true}, function () {
                
            });

            location.reload();
        } else {
            //if the extension is paused it will be unpaused here
            chrome.storage.local.set({'isPause': false}, function () {
                
            });

            location.reload();
        }
    }
});

chrome.storage.local.get('blockedList', function (data1) {
    chrome.storage.local.get('isPause', function (data2) {
        if (data1.blockedList != null && data2.isPause == false || data2.isPause == null) {
            chrome.webRequest.onBeforeRequest.addListener(
                function(details) {
                    url = details.url.split("/");
                    return {
                        redirectUrl : chrome.runtime.getURL("blockedPage.html"+ "?site=" + url[2]),
                    }
                },
                { urls: data1.blockedList },
                ["blocking"]
            )
        }
    });
});

chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
        title: "Home Page",
        contexts: ["page"],
        onclick: function() {
            chrome.tabs.create({ url: "options.html" });
        }
    });
});

chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
        title: "About Page",
        contexts: ["page"],
        onclick: function() {
            chrome.tabs.create({ url: "about.html" });
        }
    });
});

chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
        title: "Issues Page",
        contexts: ["page"],
        onclick: function() {
            chrome.tabs.create({ url: "issues.html" });
        }
    });
});

chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
        title: "Click to add highlighted text to blacklist",
        contexts:["selection"],
        onclick: function(textData) {
            var value = textData.selectionText;
            var userInput = value.split(/\r?\n/);
            addToList(userInput);
        }
    });
});

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if(request.type == "refresh") {
        location.reload();
    }
});