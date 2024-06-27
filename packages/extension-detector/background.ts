import { Api, CHANNEL_ID } from "./types";

chrome.runtime.onConnect.addListener((port) => {
  console.log("> port", port);
  if (port.name !== CHANNEL_ID) {
    return;
  }
  console.log("> add");
  port.onMessage.addListener(async (message, port) => {
    console.log("> received", message);
    if (message.target !== "background") {
      return;
    }
    const name = message.name as keyof Api;
    const params = message.params as Parameters<Api[typeof name]>;
    console.log(">", message);
    switch (message.name) {
      case "listExtensions":
        const extensions = await chrome.management.getAll();
        console.log("> extensions", extensions);
        port.postMessage({
          id: message.id,
          target: message.target,
          name: message.name,
          value: extensions,
        });
        break;
      default:
        port.postMessage({
          id: message.id,
          target: message.target,
          name: message.name,
          error: "cannot handle message",
        });
    }
  });
});
