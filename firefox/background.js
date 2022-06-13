browser.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if(request.type == "pauseOrUnpauseExtension") {
        if(request.pauseOrUnpauseExtension == true) {
            //if the extension is not paused it will be paused here
            browser.storage.local.set({'isPause': true}, function () {
                
            });

            location.reload();
        } else {
            //if the extension is paused it will be unpaused here
            browser.storage.local.set({'isPause': false}, function () {
                
            });

            location.reload();
        }
    }
});

browser.storage.local.get('blockedList', function (data1) {
    browser.storage.local.get('isPause', function (data2) {
        if (data1.blockedList != null && data2.isPause == false || data2.isPause == null) {
            browser.webRequest.onBeforeRequest.addListener(
                function(details) {
                    url = details.url.split("/");
                    return {
                        redirectUrl : browser.runtime.getURL("blockedPage.html"+ "?site=" + url[2]),
                    }
                },
                { urls: data1.blockedList },
                ["blocking"]
            )
        }
    });
});

browser.contextMenus.removeAll(function() {
    browser.contextMenus.create({
        title: "Home Page",
        contexts: ["page"],
        onclick: function() {
            browser.tabs.create({ url: "options.html" });
        }
    });
});

browser.contextMenus.removeAll(function() {
    browser.contextMenus.create({
        title: "About Page",
        contexts: ["page"],
        onclick: function() {
            browser.tabs.create({ url: "about.html" });
        }
    });
});

browser.contextMenus.removeAll(function() {
    browser.contextMenus.create({
        title: "Issues Page",
        contexts: ["page"],
        onclick: function() {
            browser.tabs.create({ url: "issues.html" });
        }
    });
});

browser.contextMenus.removeAll(function() {
    browser.contextMenus.create({
        title: "Click to add highlighted text to blacklist",
        contexts:["selection"],
        onclick: function(textData) {
            var value = textData.selectionText;
            var userInput = value.split(/\r?\n/);
            addToList(userInput, false);
        }
    });
});

browser.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if(request.type == "refresh") {
        location.reload(true);
    }
});