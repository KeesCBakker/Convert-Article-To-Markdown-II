var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  DefaultParser: () => DefaultParser,
  elementToMarkdown: () => elementToMarkdown
});
var import_linkedom = __toModule(require("linkedom"));
var import_node_html_markdown = __toModule(require("node-html-markdown"));
var import_scraper = __toModule(require("./scraper"));
function elementToMarkdown(element) {
  let html = (element == null ? void 0 : element.innerHTML) || "";
  let content = import_node_html_markdown.NodeHtmlMarkdown.translate(html).trim();
  return content;
}
class DefaultParser {
  _url = null;
  canParse(url) {
    if (url)
      return true;
    return false;
  }
  async parse(url) {
    this._url = url;
    let txt = await (0, import_scraper.scrape)(url);
    const { document } = (0, import_linkedom.parseHTML)(txt);
    this.preParse(document);
    let article = this.getArticleNode(document);
    let content = elementToMarkdown(article);
    let header = this.parseHeader(document);
    content = header + content;
    return content;
  }
  preParse(document) {
    document.querySelectorAll("iframe").forEach((iframe) => {
      var _a;
      if (!iframe.src)
        return;
      const url = new URL(iframe.src);
      const type = url.host;
      const name = url.pathname;
      const p = document.createElement("p");
      const n = document.createTextNode(`{% ${type} ${name} %}`);
      p.appendChild(n);
      (_a = iframe.parentNode) == null ? void 0 : _a.insertBefore(p, iframe);
    });
  }
  getArticleNode(document) {
    return document.querySelector("article") || document.querySelector("body");
  }
  parseHeader(document) {
    var _a, _b;
    let header = "---\n";
    let title = (((_a = document.querySelector("h1")) == null ? void 0 : _a.textContent) || "").trim();
    if (title) {
      header += `title: ${title}
`;
    }
    let tagSelector = this.getTagSelector();
    let tags = [...document.querySelectorAll(tagSelector)].map((a) => (a.textContent || "").trim().toLowerCase()).filter((t) => t).map((a) => a.replace("node.js", "node"));
    if (tags.length > 0) {
      tags.sort();
      let t = [...new Set(tags)].join(", ");
      header += `tags: [${t}]
`;
    }
    let canonical = ((_b = document.querySelector("link[rel=canonical]")) == null ? void 0 : _b.getAttribute("href")) || this._url;
    if (canonical) {
      header += `canonical_url: ${canonical}
`;
    }
    header += "---\n\n";
    return header;
  }
  getTagSelector() {
    return ".categories a, .tags a";
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DefaultParser,
  elementToMarkdown
});
//# sourceMappingURL=DefaultParser.js.map
