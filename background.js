chrome.storage.sync.get('coloring', (data) => {
    console.log(data)
})

chrome.contextMenus.create({
    title:'PaintMan',
    contexts:["all"]
});
chrome.contextMenus.onClicked.addListener(function(info,tab){
    chrome.tabs.sendMessage(tab.id,'getClickedEl',function(el){
        chrome.tabs.create({
            "url": `setting.html?new=${btoa(JSON.stringify(el))}`
        });
    })
})
