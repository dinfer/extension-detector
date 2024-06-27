import React, { FC, useEffect, useState } from "react";
import { Api, CHANNEL_ID } from "../types";
import { Invoker } from "./Invoker";
import { ExtensionList } from "./ExtensionList";

const port = chrome.runtime.connect({ name: CHANNEL_ID });

export default function ContentApp() {
  const [open, setOpen] = React.useState(false);
  const [invoker] = useState(() => {
    const invoker = new Invoker<Api>(
      CHANNEL_ID + "-content",
      (message) => {
        port.postMessage(message);
        console.log("> send", message);
      },
      (cb) => {
        const fn = (args: any) => {
          console.log("> got", args);
          cb(args);
        };
        port.onMessage.addListener(fn);
        return () => {
          port.onMessage.removeListener(cb);
        };
      }
    );
    return invoker;
  });

  return (
    <div className="m-4 p-4 w-96 rounded bg-slate-100">
      <div className="flex justify-between items-center">
        <div className="font-bold">extension installed</div>
        <button
          className="px-4 border border-dashed border-slate-800 cursor-pointer"
          onClick={() => {
            setOpen((p) => !p);
          }}
        >
          {open ? "close" : "open"}
        </button>
      </div>
      {open && <ExtensionList invoker={invoker} />}
    </div>
  );
}
