export interface ExtensionDetectionConfig {
  id: string;
  name: string;
  detections: {
    connect?: string;
    globalVariables?: string[];
    resource?: string;
    domElements?: string[];
  };
}
export interface InstalledExtension {
  id: string;
  name: string;
}
export const configs: ExtensionDetectionConfig[] = [
  {
    id: "dhdgffkkebhmkfjojejmpbldmpobfkfo",
    name: "Tampermonkey 篡改猴",
    detections: {
      connect: "dhdgffkkebhmkfjojejmpbldmpobfkfo",
      resource: "options.html",
    },
  },
  {
    id: "piohkopmiebhgodfkcfcmjbmgkcnjnmf",
    name: "Billfish - 免费素材管理工具V4.0",
    detections: {
      resource: "kb-wasm.wasm",
    },
  },
  {
    id: "idkjhjggpffolpidfkikidcokdkdaogg",
    name: "XSwitch",
    detections: {
      connect: "idkjhjggpffolpidfkikidcokdkdaogg",
    },
  },
  {
    id: "fpdnjdlbdmifoocedhkighhlbchbiikl",
    name: "广告终结者",
    detections: {
      resource: "block.html",
    },
  },
  {
    id: "gighmmpiobklfepjocnamgkkbiglidom",
    name: "AdBlock — best ad blocker",
    detections: {
      resource: "adblock-uiscripts-adblock-wizard.css",
    },
  },
  {
    id: "ofpnmcalabcbjgholdjcjblkibolbppb",
    name: "Monica - ChatGPT4 驱动的 AI Copilot",
    detections: {
      domElements: ["#monica-content-root"],
    },
  },
  {
    id: "nkbihfbeogaeaoehlefnkodbefgpgknn",
    name: "MetaMask 或同类加密货币钱包插件",
    detections: {
      globalVariables: ["ethereum"],
    },
  },
  {
    id: "fmkadmapgofadopljbjfkapdkoienihi",
    name: "React Developer Tools",
    detections: {
      resource: "main.html",
    },
  },
  {
    id: "nhdogjmejiglipccpnnnanhbledajbpd",
    name: "Vue.js devtools",
    detections: {
      resource: "devtools.html",
    },
  },
  {
    id: "lmhkpmbekcpmknklioeibfkpmmfibljd",
    name: "Redux DevTools",
    detections: {
      resource: "page.bundle.js",
    },
  },
];

export async function check() {
  const installed: { id: string; name: string }[] = [];
  for (const item of configs) {
    const { resource, globalVariables, connect, domElements } = item.detections;
    if (resource) {
      try {
        await fetch(`chrome-extension://${item.id}/${resource}`);
        installed.push({
          id: item.id,
          name: item.name,
        });
      } catch (e) {}
    }
    if (Array.isArray(globalVariables) && globalVariables.length > 0) {
      for (const varableName of globalVariables) {
        if (typeof varableName !== "undefined") {
          installed.push({
            id: item.id,
            name: item.name,
          });
        }
      }
    }
    if (connect) {
      try {
        const port = chrome.runtime.connect(connect);
        if (port) {
          installed.push({
            id: item.id,
            name: item.name,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }

    if (domElements) {
      for (const selector of domElements) {
        const el = document.querySelector(selector);
        if (el) {
          installed.push({
            id: item.id,
            name: item.name,
          });
        }
      }
    }
  }

  if (Array.isArray(window.__ex_ids__)) {
    for (const id of window.__ex_ids__) {
      const item = configs.find((item) => item.id === id);
      if (item && !installed.some((v) => v.id === id)) {
        installed.push({
          id: item.id,
          name: item.name,
        });
      }
    }
  }
  return installed;
}
