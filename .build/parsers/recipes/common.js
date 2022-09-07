var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  capitalizeFirstLetter: () => capitalizeFirstLetter,
  capitalizeFirstLetterEndWithDot: () => capitalizeFirstLetterEndWithDot
});
function capitalizeFirstLetter(str) {
  if (!str)
    return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function capitalizeFirstLetterEndWithDot(str) {
  if (!str)
    return str;
  str = str.charAt(0).toUpperCase() + str.slice(1).trim();
  str = capitalizeFirstLetter(str);
  if (![".", "?", "!"].some((x) => str.endsWith(x))) {
    str += ".";
  }
  return str;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  capitalizeFirstLetter,
  capitalizeFirstLetterEndWithDot
});
//# sourceMappingURL=common.js.map
