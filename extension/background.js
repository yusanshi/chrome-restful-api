// https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension
chrome.runtime.onStartup.addListener(connect);
chrome.runtime.onInstalled.addListener(connect);

function connect() {
  const port = chrome.runtime.connectNative('com.yusanshi.uncover_chrome');
  port.onDisconnect.addListener(connect);
  port.onMessage.addListener(function (data) {
    console.log('Receive: ' + data);
    if (data == 'hello') {
      port.postMessage('Hello from the extension');
    } else if (data == 'url/current') {
      chrome.tabs.query(
        { active: true, lastFocusedWindow: true },
        function (tabs) {
          port.postMessage(tabs[0]?.url);
        }
      );
    } else if (data == 'url/all') {
      chrome.tabs.query({}, function (tabs) {
        port.postMessage(tabs.map((e) => e.url));
      });
    } else {
      port.postMessage('unknown command');
    }
  });
}
