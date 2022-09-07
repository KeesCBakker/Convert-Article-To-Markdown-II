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
  LeukeReceptenParser: () => LeukeReceptenParser
});
var import_RecipeParser = __toModule(require("./RecipeParser"));
var import_common = __toModule(require("./common"));
class LeukeReceptenParser extends import_RecipeParser.RecipeParser {
  canParse(url) {
    return url.hostname == "leukerecepten.nl" || url.hostname == "www.leukerecepten.nl";
  }
  parseHeader(document) {
    var _a, _b, _c, _d;
    let header = super.parseHeader(document);
    let subHeader = "";
    let porties = (((_b = (_a = document.querySelector(".icon--servings")) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.textContent) || "").trim();
    if (porties) {
      porties = porties.replace(/\s+(personen|porties)\s+/i, "");
      subHeader += `porties: ${porties}
`;
    }
    let timing = (((_d = (_c = document.querySelector(".icon--clock")) == null ? void 0 : _c.parentElement) == null ? void 0 : _d.textContent) || "").trim();
    if (timing) {
      subHeader += `timing: ${timing}
`;
    }
    subHeader += "---\n\n";
    return header.replace("---\n\n", subHeader);
  }
  preParse(document) {
    [
      ".print\\:text-lg",
      ".fiu-button-wrapper",
      "button",
      ".info-balloon",
      "#bereiding > *:not(.step)",
      ".icon--difficulty",
      ".hidden",
      ".page-content__meta li:last-child",
      ".page-content__title",
      ".responsive-image",
      ".ingredient-group > .justify-between > strong"
    ].forEach((el) => (0, import_RecipeParser.remove)(document, el));
  }
  getArticleNode(document) {
    return document.querySelector(".page-content");
  }
  getTagSelector() {
    return ".stream__tags a";
  }
  getIngredientsNode(document) {
    return document.querySelector(".page-content__ingredients-sidebar");
  }
  getStepsNode(document) {
    let ul = document.createElement("ul");
    let stop = false;
    document.querySelectorAll("#bereiding .step").forEach((el) => {
      var _a;
      if (stop || ((_a = el.textContent) == null ? void 0 : _a.startsWith("Tip:"))) {
        stop = true;
        return;
      }
      let li = document.createElement("li");
      let n = document.createTextNode(el.textContent || "");
      li.appendChild(n);
      ul.appendChild(li);
    });
    return ul;
  }
  getTipsNode(document) {
    let ul = document.createElement("ul");
    let start = false;
    document.querySelectorAll("#bereiding .step").forEach((el) => {
      var _a, _b;
      if ((_a = el.textContent) == null ? void 0 : _a.startsWith("Tip:")) {
        start = true;
      } else if (!start) {
        return;
      }
      let txt = ((_b = el.textContent) == null ? void 0 : _b.replace("Tip:", "").trim()) || "";
      txt = (0, import_common.capitalizeFirstLetterEndWithDot)(txt);
      let li = document.createElement("li");
      let n = document.createTextNode(txt);
      li.appendChild(n);
      ul.appendChild(li);
    });
    return ul;
  }
  getDescriptionNode(document) {
    return document.querySelector(".page-content > p");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LeukeReceptenParser
});
//# sourceMappingURL=LeukeReceptenParser.js.map
