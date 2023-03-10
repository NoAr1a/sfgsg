chrome.runtime.onStartup.addListener(function() {
    wipeData()
});
chrome.windows.onRemoved.addListener(function(id) {
    chrome.windows.getAll(function(w) {
        if (w.length == 0) {
            wipeData()
        }
    })
});

function wipeData() {
    chrome.storage.sync.get({
        browsing: true,
        download: false,
        cookies: false,
        webdata: false,
        cache: false,
        passwords: false,
        autofill: false,
        localdata: false
    }, function(items) {
        var remove = {};
        if (items.browsing) {
            remove.history = true
        }
        if (items.download) {
            remove.downloads = true;
            chrome.permissions.contains({
                permissions: ['downloads']
            }, function(result) {
                if (result) {
                    chrome.downloads.erase({})
                }
            })
        }
        if (items.cookies) {
            remove.cookies = true
        }
        if (items.webdata) {
            remove.fileSystems = true;
            remove.indexedDB = true;
            remove.localStorage = true;
            remove.pluginData = true;
            remove.serverBoundCertificates = true;
            remove.webSQL = true
        }
        if (items.cache) {
            remove.cache = true;
            remove.appcache = true
        }
        if (items.passwords) {
            remove.passwords = true
        }
        if (items.autofill) {
            remove.formData = true
        }
        chrome.browsingData.remove({}, remove, function() {
            if (items.download) {
                chrome.browsingData.removeDownloads({})
            }
        })
    })
}