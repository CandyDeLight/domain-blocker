window.onload = () => {
    browser.storage.local.get('blockedList', function (data) {
        var list = data.blockedList;

        if (list == null) {
            document.getElementById("totalItems").innerHTML = "Total Items: " + "<u>" + "0" + "</u>" + "<hr>";

            document.getElementById("empty").innerHTML = "Your list is currently empty.<br><br> Add website to the list manually or import your own list." + "<hr>";
        } else {
            document.getElementById("totalItems").innerHTML = "Total Items: " + "<u>" + list.length + "</u>" + "<hr>";

            displayList();
        }

        document.getElementById('buttonAdd').addEventListener('click', function () {
            var value = document.getElementById('textAreaUserInput').value;
            var userInput = value.split(/\r?\n/);

            addToList(userInput, true);
        });
    });

    document.getElementById('buttonClear').addEventListener('click', function () {
        clearList();
    });

    document.getElementById('buttonDownload').addEventListener('click', function () {
        saveList();
    });

    document.getElementById("file").addEventListener("change", function () {
        if (this.files && this.files[0]) {
            var file = this.files[0];
            var reader = new FileReader();

            importList(file, reader);
        } else {
            alert("There seems to be a problem with reading the file.");
        }
    });
}

function displayList() {
    browser.storage.local.get('blockedList', function (data) {
        var list = data.blockedList;

        for(var i =  list.length - 1; i > -1; i--) {
            var text = list[i];
            var newText = text.substring(6);
            var displayText = newText.slice(0, -2);

            document.getElementById('blacklist').innerHTML += '<h3>' + displayText + '</h3>' + '<hr>';
        }
    });
}

function addToList(userInput, sendAlert) {
    browser.storage.local.get('blockedList', function (data) {
        var list = data.blockedList;

        if (list == null) {
            list = [];
        }
    
        if (userInput.length < 1 || userInput == "") {
            if (sendAlert == true) {
                alert("You did not enter any websites.\n\nPlease enter in some websites into the textarea and try again.");
            }
        } else {
            for (var i = 0; i < userInput.length; i++) {
                var prefix = "*://*.";
                var suffix = "/*";
                var result = prefix.concat(userInput[i]);
                var final_result = result.concat(suffix);
    
                if ((list.includes(final_result) != true)  && (userInput[i].replace(/\s/g, '').length)) {
                    list.push(final_result);
                }
            }
            browser.storage.local.set({'blockedList': list}, function () {
            
            });
            
            if (sendAlert == true) {
                alert("Website has been added. Page will reload shortly.\n\nNote duplicate items and strings that only contain whitespaces will not be added.");
            }
    
            location.reload(true);
        }
    });
}

function saveList() {
    var saveData = (function () {
        var list;
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';

        return function (fileName) {
            browser.storage.local.get('blockedList', function (data) {
                list = data.blockedList;
                blob = new Blob([list], {type: 'octet/stream'}),
                url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            });
        };
    }());

    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = mm + '-' + dd + '-' + yyyy;

    var fileName = "blacklistExport" + "_" + today + ".txt";

    saveData(fileName);
}

function clearList() {
    var confirmation = confirm("Are you sure you want to clear the current list?\n\nYou should consider saving your current list before doing so.");

    if (confirmation == true) {
        browser.storage.local.clear(function() {
            
        });
    
        alert("List has been cleared.\n\nPage will reload shortly.");

        browser.runtime.sendMessage({type: "refresh"});

        location.reload(true);
    } else {
        alert("List will not be cleared.");
    }
}

function importList(file, reader) {
    var confirmation = confirm("Are you sure you want to import the list?\n\nYour current list will be overwritten with the imported list.");

    if (confirmation == true) {
        reader.addEventListener('load', function (e) {
            var list = e.target.result.split(",");

            chrome.storage.local.clear(function() {

            });

            browser.storage.local.set({'blockedList': list}, function () {
                
            });
        });
    
        reader.readAsBinaryString(file);
    
        alert("Text file has successfully imported.\n\nPage will reload shortly.");

        browser.runtime.sendMessage({type: "refresh"});

        location.reload(true);
    } else {
        alert("List will not be imported.\n\nPage will reload shortly.");

        location.reload(true);
    }
    
}

browser.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if(request.type == "addToList") {
        var userInput = request.addToList.split(/\r?\n/);
        
        addToList(userInput, false);

        browser.runtime.sendMessage({type: "refresh"});
    }
});

browser.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if(request.type == "refresh") {
        location.reload(true);
    }
});