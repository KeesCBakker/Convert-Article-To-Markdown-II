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
  KeesTalksTechParser: () => KeesTalksTechParser,
  NrcParser: () => NrcParser,
  remove: () => remove
});
var import_DefaultParser = __toModule(require("./DefaultParser"));
class KeesTalksTechParser extends import_DefaultParser.DefaultParser {
  canParse(url) {
    return url.hostname == "keestalkstech.com";
  }
  getArticleNode(document) {
    return document.querySelector("article .entry-content");
  }
  preParse(document) {
    super.preParse(document);
    document.querySelectorAll("pre code").forEach((code) => {
      var _a;
      let lang = [...((_a = code.parentElement) == null ? void 0 : _a.classList) || []].filter((x) => x.startsWith("lang-")).find((x) => x);
      if (!lang)
        return;
      lang = lang.replace("lang-", "language-");
      code.classList.add(lang);
    });
  }
}
function remove(document, selector) {
  document.querySelectorAll(selector).forEach((el) => {
    el.remove();
  });
}
class NrcParser extends import_DefaultParser.DefaultParser {
  canParse(url) {
    return url.hostname == "nrc.nl" || url.hostname == "www.nrc.nl";
  }
  getArticleNode(document) {
    return document.querySelector(".article__header-and-content");
  }
  preParse(document) {
    [
      ".print-layout-warning"
    ].forEach((el) => remove(document, el));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  KeesTalksTechParser,
  NrcParser,
  remove
});
//# sourceMappingURL=KeesTalksTechParser.js.map
