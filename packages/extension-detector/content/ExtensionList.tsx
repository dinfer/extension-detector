import { FC, useState, useEffect } from "react";
import { Api } from "../types";
import { Invoker } from "./Invoker";

export const ExtensionList: FC<{ invoker: Invoker<Api> }> = ({ invoker }) => {
  const [list, setList] = useState<chrome.management.ExtensionInfo[]>();
  useEffect(() => {
    invoker.invoke("background", "listExtensions").then((list) => {
      setList((list as any) || []);
    });
  }, []);
  return (
    <div className="max-h-[300px] overflow-y-auto">
      {list ? (
        list.map((v) => (
          <div key={v.id} className="">
            <span className="">{v.enabled ? '✅' : '❌'}</span>
            <span className="text-slate-800">{v.name}</span>
            <span className="text-slate-400">({v.id})</span>
          </div>
        ))
      ) : (
        <div>loading</div>
      )}
    </div>
  );
};
