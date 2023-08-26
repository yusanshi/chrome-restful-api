# Chrome RESTful API [WIP]

APIs for querying and controlling Chrome browser.

Currently implemented APIs:
- `GET http://127.0.0.1:[PORT]/hello`: say hello
- `GET http://127.0.0.1:[PORT]/url/current`: return the URL of the active tab
- `GET http://127.0.0.1:[PORT]/url/all`: return URLs of all tabs


## Get started

### Install from store

TODO

### Install manually
1. Install the extension.

   Open `chrome://extensions/`, toggle on `Developer mode`, click `Load unpacked` and select the `extension` directory. Click `Details` of the extension, find the ID and copy it.

2. Install the manifest file for native messaging.

   Modify the `com.yusanshi.chrome_restful_api.json`: change `path` to the real path of `chrome_restful_api.py`, change `allowed_origins` to `["chrome-extension://<extension_ID>/"]`.

   Then copy `com.yusanshi.chrome_restful_api.json` to the [proper location](https://developer.chrome.com/docs/extensions/mv3/nativeMessaging/#native-messaging-host-location).

3. Install Python packages.

   `pip install fastapi "uvicorn[standard]"`. Run `python chrome_restful_api.py` to make sure it works normally.

4. Restart everything. Test with `curl http://127.0.0.1:9234/url/all`.

## TODO
- [ ] more APIs
- [ ] redesign the API format


## Credits

[Api icons created by Vitaly Gorbachev - Flaticon](https://www.flaticon.com/free-icons/api)

