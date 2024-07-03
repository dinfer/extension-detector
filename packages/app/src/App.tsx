import { useEffect, useRef, useState } from "react";
import "./App.css";
import { InstalledExtension, check, configs } from "./util";

function App() {
  const [list, setList] = useState<InstalledExtension[] | null>(null);
  const ref = useRef(0);
  useEffect(() => {
    clearTimeout(ref.current);
    ref.current = window.setTimeout(() => {
      check().then(setList);
    }, 5_000);
  }, []);
  return (
    <div>
      <h1>可检测 ({configs.length})</h1>
      <p>目前配置文件支持如下插件的检测，可以通过拓展配置检测更多插件</p>
      <ul>
        {configs.map((v) => (
          <li key={v.id}>{v.name}</li>
        ))}
      </ul>
      <h1>检测结果</h1>
      {list === null ? (
        <p>等待检测</p>
      ) : (
        <div>
          <p>已安装插件 ({list.length})</p>
          <ul>
            {list.map((v) => (
              <li key={v.id}>{v.name}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h2>篡改猴 检测</h2>
        <p>通过覆盖全局对象，检测调用方是否来自篡改猴</p>
        <p>本demo覆盖了console.log方法，使用下面的篡改猴脚本进行检测</p>
        <code>
          <pre
            style={{ background: "#eee" }}
            dangerouslySetInnerHTML={{
              __html: `// ==UserScript==
// @name         篡改猴检测
// @namespace    http://tampermonkey.net/
// @version      2024-07-03
// @description  try to take over the world!
// @author       You
// @match        http://localhost:5173/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log('xxx')
    // Your code here...
})();`,
            }}
          ></pre>
        </code>
        <p>截图如下</p>
        <img src="./screenshot.png" style={{ width: "100%" }} />
      </div>
    </div>
  );
}

export default App;
