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
  RecipeParser: () => RecipeParser,
  multiplyIngredients: () => multiplyIngredients,
  processIngredients: () => processIngredients,
  remove: () => remove,
  toMarkdown: () => toMarkdown
});
var import_DefaultParser = __toModule(require("../DefaultParser"));
var import_linkedom = __toModule(require("linkedom"));
var import_remove_markdown = __toModule(require("remove-markdown"));
var import_scraper = __toModule(require("../scraper"));
function toMarkdown(el) {
  let content = (0, import_DefaultParser.elementToMarkdown)(el);
  return content.replace(/\*\*/g, "");
}
class RecipeParser extends import_DefaultParser.DefaultParser {
  parseHeader(document) {
    var _a, _b;
    let header = super.parseHeader(document);
    let subHeader = "";
    let featureImage = ((_a = document.querySelector("meta[property=og\\:image]")) == null ? void 0 : _a.getAttribute("content")) || ((_b = document.querySelector("link[rel=image_src]")) == null ? void 0 : _b.getAttribute("href"));
    if (featureImage) {
      subHeader += `image: ${featureImage}
`;
    }
    subHeader += `created: ${new Date().toISOString()}
`;
    subHeader += "---\n\n";
    return header.replace("---\n\n", subHeader);
  }
  async parse(url) {
    this._url = url;
    let txt = await (0, import_scraper.scrape)(url);
    const { document } = (0, import_linkedom.parseHTML)(txt);
    this.preParse(document);
    let ingredients = toMarkdown(this.getIngredientsNode(document));
    let steps = toMarkdown(this.getStepsNode(document));
    let tips = toMarkdown(this.getTipsNode(document));
    let title = toMarkdown(this.getTitleNode(document));
    let description = toMarkdown(this.getDescriptionNode(document));
    let content = "";
    if (title) {
      title = (0, import_remove_markdown.default)(title);
      content += `# ${title}
`;
    }
    if (description) {
      description = (0, import_remove_markdown.default)(description);
      content += description;
      content += "\n\n";
    }
    if (ingredients) {
      ingredients = ingredients.split("* ").map((x) => processIngredients(x)).map((x) => multiplyIngredients(x, 1)).join("* ");
      content += "## Ingredi\xEBnten\n";
      content += ingredients;
      content += "\n\n";
    }
    if (steps) {
      content += "## Stappen\n";
      content += steps;
      content += "\n\n";
    }
    if (tips) {
      content += "## Tips\n";
      content += tips;
      content += "\n\n";
    }
    content = content.trim();
    let header = this.parseHeader(document);
    return header + content;
  }
  getTitleNode(document) {
    return document.querySelector("h1");
  }
}
function remove(document, selector) {
  document.querySelectorAll(selector).forEach((el) => {
    el.remove();
  });
}
function processIngredients(line) {
  return line.replace("to maten", "tomaten").replace(/ eetl /g, " el ").replace(/ g /g, " gr ").replace("gram", "gr").replace("theelepel", "tl").replace("theel", "tl").replace("tls", "tl").replace("milliliter", "ml").replace("mililtr", "ml").replace("liter", "ltr").replace("eetlepels", "el").replace("eetlepel", "el").replace(/([Pp]eper) en zout/i, "$1 & zout").replace(/1½/, "1.5").replace(/1\/2/g, "0.5").replace(/1\/4/g, "0.25").replace(/½/g, "0.5").replace(/¼/g, "0.25");
}
function multiplyIngredients(item, multiplier) {
  let isOne = /(^| )(1) /.test(item);
  item = item.replace(/^[Ss]nuf /, "snufje ");
  if (multiplier > 1) {
    item = item.replace(/^([Hh]andje|[Ss]cheutje|[Kk]lontje|[Zz]akje|[Ss]neetje|[Ss]nufje)/, "1 $1s").replace(/^[Kk]lont /, "1 klontjes ").replace(/^[Pp]aar /, "1 handjes ").replace(/ml\/gr/g, "gr").replace(/(\d+),(\d+)/g, "$1.$2").replace(/1½/, "1.5").replace(/1\/2/g, "0.5").replace(/1\/4/g, "0.25").replace(/½/g, "0.5").replace(/¼/g, "0.25").replace(/⅓/g, "0.333333333333").replace(/(?<!a\s(\d+)?)\d+(\.\d+)?/g, function(match, capture) {
      if (match.includes(".")) {
        let f = parseFloat(match) * multiplier;
        return f.toFixed(2).replace(/\.?0+$/, "");
      }
      return (parseInt(match) * multiplier).toString();
    }).replace(/(\d{4,}) gr /g, function(match, capture) {
      return parseInt(match) / 1e3 + " kg ";
    }).replace(/(\d{4,}) ml /g, function(match, capture) {
      return parseInt(match) / 1e3 + " ltr ";
    });
  }
  item = item.replace(/ml\/gr/g, "gr.").replace(/( (ml|gr|kg|el|tl|ltr)) /g, "$1. ");
  let hasUnit = /(?<!a\s(\d+)?)\d+(\.\d+) (ml|gr|kg|el|tl|ltr|stukken|stuks)/.test(item);
  if (isOne && !hasUnit && multiplier > 1) {
    item = item.replace(/(ui|limoen|citroen|meloen|prei|[Ss]cheut)( |$)/g, "$1en$2").replace(/(uitje|appel|peper|bakje|sneetje|snufje|plak|courgette|handje|komkommer|teentje|blikje|zakje|klontje|blokje|wrap|kopje|lapje)( |$)/g, "$1s$2").replace(/(snee)( |$)/g, "sneden$2").replace(/(ei)( |$)/g, "eieren$2").replace(/(avocado)( |$)/g, "$1's$2").replace(/(kop)( |$)/g, "koppen$2").replace(/(kool)( |$)/g, "kolen$2").replace(/(teen)( |$)/g, "tenen$2").replace(/(tablet)( |$)/g, "tabletten$2").replace(/(banaan)( |$)/g, "bananen$2").replace(/(peer)( |$)/g, "peren$2").replace(/(blik)( |$)/g, "blikken$2").replace(/(middelgroot)( |$)/, "middelgrote$2").replace(/(klein blikjes)( |$)/g, "kleine blikjes$2");
  }
  return item;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RecipeParser,
  multiplyIngredients,
  processIngredients,
  remove,
  toMarkdown
});
//# sourceMappingURL=RecipeParser.js.map
