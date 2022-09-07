var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
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
var import_readline_sync = __toModule(require("readline-sync"));
var import_DefaultParser = __toModule(require("./parsers/DefaultParser"));
var import_DevToParser = __toModule(require("./parsers/DevToParser"));
var import_KeesTalksTechParser = __toModule(require("./parsers/KeesTalksTechParser"));
var import_LeukeReceptenParser = __toModule(require("./parsers/recipes/LeukeReceptenParser"));
var import_VoedingsCentrumParser = __toModule(require("./parsers/recipes/VoedingsCentrumParser"));
async function run() {
  var parsers = [
    new import_DevToParser.DevToParser(),
    new import_KeesTalksTechParser.KeesTalksTechParser(),
    new import_LeukeReceptenParser.LeukeReceptenParser(),
    new import_KeesTalksTechParser.NrcParser(),
    new import_VoedingsCentrumParser.VoedingsCentrumParser(),
    new import_DefaultParser.DefaultParser()
  ];
  while (true) {
    console.log();
    console.log("CONVERT ARTICLE TO MARKDOWN");
    console.log("---------------------------");
    console.log();
    try {
      let url = import_readline_sync.default.question(`Please enter URL: `);
      let u = new URL(url);
      let content = "";
      for (let p of parsers) {
        if (p.canParse(u)) {
          content = await p.parse(u);
          break;
        }
      }
      console.log();
      console.log();
      console.log(content);
      console.log();
      console.log();
    } catch (error) {
      console.log();
      console.log();
      console.log("Sorry, all I got was:", error.message);
      console.log();
      console.log();
    }
  }
}
run();
//# sourceMappingURL=index.js.map
