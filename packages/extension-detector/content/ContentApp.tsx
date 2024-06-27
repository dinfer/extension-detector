import React, { FC, useEffect, useState } from "react";
import { Api, CHANNEL_ID } from "../types";
import { Invoker } from "./Invoker";

const port = chrome.runtime.connect({ name: CHANNEL_ID });

const ExtensionList: FC<{ invoker: Invoker<Api> }> = ({ invoker }) => {
  const [list, setList] = useState<chrome.management.ExtensionInfo[]>();
  useEffect(() => {
    invoker.invoke("background", "listExtensions").then((list) => {
      setList((list as any) || []);
    });
    fetch("chrome-extension://hefbggikcnbfmhonaekmkneehfajobhl/16/0").then(
      (r) => console.log("> icon", r),
      (e) => console.error("> icon", e)
    );
  }, []);
  return (
    <div>
      {list ? (
        list.map((v) => (
          <div key={v.id}>
            <div className="text-slate-800">名称: {v.name}</div>
            <div className="text-slate-400">id: {v.id}</div>
          </div>
        ))
      ) : (
        <div>loading</div>
      )}
    </div>
  );
};

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
    <div className="m-4 p-4 w-80 rounded bg-slate-100">
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
