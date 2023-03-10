var value, lastTimeout, saved = document.getElementById('saved');

function updateOptions(item) {
    var update = {};
    update[item.target.id] = document.getElementById(item.target.id).checked;
    if (update['download'] == true) {
        chrome.permissions.contains({
            permissions: ['downloads']
        }, function(result) {
            if (result == false) {
                chrome.permissions.request({
                    permissions: ['downloads']
                }, function(granted) {
                    if (granted) {
                        syncOptions(update)
                    } else {
                        document.getElementById(item.target.id).checked = false
                    }
                })
            } else {
                syncOptions(update)
            }
        })
    } else {
        syncOptions(update)
    }
}

function syncOptions(update) {
    chrome.storage.sync.set(update, function() {
        fin()
    })
}

function checkContentSettingsPermission() {
    chrome.permissions.contains({
        permissions: ['contentSettings']
    }, function(result) {
        if (result == false) {
            chrome.permissions.request({
                permissions: ['contentSettings']
            }, function(granted) {
                if (granted) {
                    updateLocalDataSetting()
                } else {
                    document.getElementById('localdata').checked = false
                }
            })
        } else {
            updateLocalDataSetting()
        }
    })
}

function updateLocalDataSetting() {
    if (document.getElementById('localdata').checked) {
        chrome.contentSettings.cookies.set({
            primaryPattern: '<all_urls>',
            setting: 'session_only'
        })
    } else {
        chrome.contentSettings.cookies.clear({})
    }
    fin()
}

function fin() {
    saved.style.display = 'block';
    saved.style.opacity = '0.4';
    clearTimeout(lastTimeout);
    saved.style.opacity = '1';
    lastTimeout = setTimeout(fout, 650)
}

function fout() {
    value = parseFloat(saved.style.opacity);
    if (value > 0) {
        saved.style.opacity = '' + (value - 0.1);
        lastTimeout = setTimeout(fout, 54)
    } else {
        saved.style.display = 'none'
    }
}
chrome.storage.sync.get({
    browsing: true,
    download: false,
    cookies: false,
    webdata: false,
    cache: false,
    passwords: false,
    autofill: false
}, function(items) {
    for (var item in items) {
        document.getElementById(item).checked = items[item];
        document.getElementById(item).addEventListener('click', updateOptions)
    }
});
chrome.permissions.contains({
    permissions: ['contentSettings']
}, function(result) {
    if (result == true) {
        chrome.contentSettings.cookies.get({
            primaryUrl: 'http://*/'
        }, function(details) {
            if (details.setting != 'allow') {
                document.getElementById('localdata').checked = true
            }
        })
    }
});
document.getElementById('localdata').addEventListener('click', checkContentSettingsPermission);