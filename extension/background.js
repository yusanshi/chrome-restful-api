// https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension
chrome.runtime.onStartup.addListener(connect);
chrome.runtime.onInstalled.addListener(connect);

function connect() {
  const port = chrome.runtime.connectNative('com.yusanshi.chrome_restful_api');
  port.onDisconnect.addListener(connect);

  port.onMessage.addListener(async function (data) {
    console.log('Receive: ' + data);
    if (data == 'hello') {
      port.postMessage('Hello from the extension');
    } else if (data == 'url/current') {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      port.postMessage(tab?.url);
    } else if (data == 'url/all') {
      const tabs = await chrome.tabs.query({});
      const urls = tabs.map((e) => e.url);
      port.postMessage(urls);
    } else {
      port.postMessage('unknown command');
    }
  });
}
