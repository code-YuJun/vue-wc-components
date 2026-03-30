/**
 * Extension Loader Runtime
 * 接入方式：<script src="./index.js" data-components="demoone,demotwo"></script>
 * 入口文件缓存设置：Cache-Control: no-store
 * 组件资源都用 unpkg ，自带的 CDN
 */

(async function () {
  // 锁 防止同一个页面里物理存在多个 loader.js 标签，保证了 init() 逻辑、fetchMetadata 接口请求在当前页面声明周期内只运行一次。
  if (window.__LOADER_LOCKED__) return;
  window.__LOADER_LOCKED__ = true;

  // 配置系统接口
  const CONFIG_API = "http://localhost:8080/components";
  const UNPKG_BASE = "https://unpkg.com";

  // 获取业务需要加载的组件
  const script = document.currentScript;
  const userNeededNames = script.dataset.components
    ? script.dataset.components.split(",").map((s) => s.trim())
    : [];

  // 请求配置系统接口
  async function fetchMetadata() {
    try {
      const response = await fetch(`${CONFIG_API}`, {
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "x-requested-with": "XMLHttpRequest",
        },
      });
      const res = await response.json();
      return res.components || [];
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  // 动态加载资源
  function loadExtension(comp) {
    const { name, version, enabled } = comp;
    console.log(name, version, enabled);

    // 降级开关：如果配置中该组件被禁用，直接跳过
    if (!enabled) return Promise.resolve();

    return new Promise((resolve, reject) => {
      // 检查是否加载过这个资源了，解决的 资源层面 的重复，防止同一个组件被多次加载，比如配置错了，导致配置中有两个相同的组件
      const existingScript = document.querySelector(
        `script[data-component="${name}"]`,
      );
      const existingLink = document.querySelector(
        `link[data-component="${name}"]`,
      );
      // 如果资源都存在了，直接返回
      if (existingScript && existingLink) {
        return resolve();
      }
      // 异常情况处理,如果某个节点已存在，先删掉它再重新整套加载。
      if (existingScript) existingScript.remove();
      if (existingLink) existingLink.remove();

      // 不存在的时候，再去加载资源
      const linkNode = document.createElement("link");
      linkNode.rel = "stylesheet";
      linkNode.href = `${UNPKG_BASE}/${name}-extension@${version}/dist/style.css`;
      linkNode.dataset.component = name;
      document.head.appendChild(linkNode);

      // 加载 JS 资源
      const scriptNode = document.createElement("script");
      scriptNode.src = `${UNPKG_BASE}/${name}-extension@${version}/dist/extension.min.js`;
      // script 标签打标
      scriptNode.dataset.component = name;

      scriptNode.onload = () => {
        // 执行组件内部的注册逻辑
        if (window.Extension?.[`${name}-extension`]?.register) {
          console.log("存在的");
          try {
            window.Extension[`${name}-extension`].register?.();
          } catch (e) {
            console.error(`组件 ${name} 注册失败`, e);
          }
        }
        resolve();
      };
      scriptNode.onerror = () => {
        reject(new Error(`资源加载失败: ${name}`));
      };
      document.body.appendChild(scriptNode);
    });
  }

  // 主执行逻辑
  async function init() {
    if (userNeededNames.length === 0) return;
    const allConfigComponents = await fetchMetadata();
    // 过滤出“业务需要”且“配置系统中存在”的组件
    const tasks = allConfigComponents
      .filter((comp) => userNeededNames.includes(comp.name))
      .map((comp) => loadExtension(comp));

    if (tasks.length === 0) return;
    try {
      await Promise.allSettled(tasks);
      // 组件加载完成之后，发消息通知
      window.dispatchEvent(
        new CustomEvent("extension-ready", {
          detail: { loadedComponents: userNeededNames },
        }),
      );
    } catch (err) {
      console.log(err);
    }
  }

  init();
})();
