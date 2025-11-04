let jsonData;

chrome.downloads.onChanged.addListener((delta) => {
  if (delta.state && delta.state.current === "complete") {
    chrome.downloads.search({ id: delta.id }, async (items) => {
      if (items.length > 0) {
        const downloadItem = items[0];
        const filePath = downloadItem.filename;
        if (filePath.endsWith(".json")) {
          const response = await fetch(downloadItem.url);
          const data = await response.json();

          jsonData = JSON.stringify(data, null, 2);
        }
      }
    });
  }
});

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url ) {
    await uploadData(jsonData, false);
  }
});

