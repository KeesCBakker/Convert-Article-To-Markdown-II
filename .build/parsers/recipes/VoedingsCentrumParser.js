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
  VoedingsCentrumParser: () => VoedingsCentrumParser
});
var import_RecipeParser = __toModule(require("./RecipeParser"));
class VoedingsCentrumParser extends import_RecipeParser.RecipeParser {
  canParse(url) {
    return url.hostname == "voedingscentrum.nl" || url.hostname == "www.voedingscentrum.nl";
  }
  parseHeader(document) {
    var _a, _b, _c;
    let header = super.parseHeader(document);
    let subHeader = "";
    let porties = (((_a = document.querySelector(".informatie .personen")) == null ? void 0 : _a.textContent) || "").trim();
    if (porties) {
      porties = porties.replace(/\s+(personen|porties)\s+/i, "");
      subHeader += `porties: ${porties}
`;
    }
    let timing = (((_b = document.querySelector(".informatie .bereiding")) == null ? void 0 : _b.textContent) || "").trim();
    if (timing) {
      subHeader += `tijd: ${timing}
`;
    }
    let calories = (((_c = document.querySelector("*[itemprop=calories]")) == null ? void 0 : _c.textContent) || "").trim();
    if (calories) {
      calories = calories.replace(/\s+/, " ");
      subHeader += `energie: ${calories}
`;
    }
    subHeader += "---\n\n";
    return header.replace("---\n\n", subHeader);
  }
  preParse(document) {
    [".ingredienten h3"].forEach((selector) => (0, import_RecipeParser.remove)(document, selector));
  }
  getTagSelector() {
    return ".infomatie .gerecht";
  }
  getIngredientsNode(document) {
    return document.querySelector(".ingredienten");
  }
  getStepsNode(document) {
    return document.querySelector("*[itemprop=recipeInstructions]");
  }
  getDescriptionNode(document) {
    return document.querySelector("*[itemprop=description]");
  }
  getTipsNode(document) {
    return null;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VoedingsCentrumParser
});
//# sourceMappingURL=VoedingsCentrumParser.js.map
