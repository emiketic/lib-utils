"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.ts
var client_exports = {};
__export(client_exports, {
  default: () => client_default,
  getBackgroundColor: () => getBackgroundColor,
  getBackgroundTextColor: () => getBackgroundTextColor,
  getDominantColorFromImageUrl: () => getDominantColorFromImageUrl,
  getPrimaryShadeColor: () => getPrimaryShadeColor
});
module.exports = __toCommonJS(client_exports);
var import_chroma_js = __toESM(require("chroma-js"));
var import_core = require("@mantine/core");
var import_react = require("react");
var import_navigation = require("next/navigation");
function getPrimaryShadeColor(color) {
  return (0, import_chroma_js.default)(color).set("hsl.s", 1).set("hsl.l", 0.55).hex();
}
function getBackgroundTextColor(color = "#ffffff", darkenAmount = 0.3, lightenAmount = 0.1) {
  if (!color) {
    return "#000000";
  }
  const darkerColor = (0, import_core.darken)(getPrimaryShadeColor(color), darkenAmount);
  const lightColor = (0, import_core.lighten)(getPrimaryShadeColor(color), lightenAmount);
  return (0, import_core.isLightColor)(color) ? darkerColor : lightColor;
}
function getBackgroundColor(color = "#ffffff", darkenAmount = 0.3, lightenAmount = 0.8) {
  if (!color) {
    return "#000000";
  }
  const darkerColor = (0, import_core.darken)(getPrimaryShadeColor(color), darkenAmount);
  const lightColor = (0, import_core.lighten)(getPrimaryShadeColor(color), lightenAmount);
  const inputLuminance = (0, import_chroma_js.default)(color).luminance();
  if (inputLuminance > 0.9) {
    return darkerColor;
  }
  if (inputLuminance < 0.15) {
    return lightColor;
  }
  const contrastLight = import_chroma_js.default.contrast(color, lightColor);
  const contrastDark = import_chroma_js.default.contrast(color, darkerColor);
  return contrastLight > contrastDark ? lightColor : darkerColor;
}
var getDominantColorFromImageUrl = async (imageUrl, fallbackDominantColor = "#000000", fallbackBackgroundColor = "#ffffff") => {
  try {
    const image = await loadImage(imageUrl);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      return { dominant: fallbackDominantColor, background: fallbackBackgroundColor };
    }
    const maxSize = 96;
    const ratio = Math.min(maxSize / image.naturalWidth, maxSize / image.naturalHeight, 1);
    canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const allPixels = extractQuantizedPixels(imageData);
    const edgePixels = extractEdgeQuantizedPixels(imageData, canvas.width, canvas.height);
    const background = getMostFrequentColor(edgePixels) ?? getMostFrequentColor(allPixels);
    const dominant = getMostFrequentColor(
      background ? allPixels.filter((hex) => import_chroma_js.default.distance(hex, background, "rgb") > 28) : allPixels
    ) ?? getMostFrequentColor(allPixels);
    return {
      dominant: dominant ?? fallbackDominantColor,
      background: background ?? fallbackBackgroundColor
    };
  } catch {
    return { dominant: fallbackDominantColor, background: fallbackBackgroundColor };
  }
};
function loadImage(imageUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.referrerPolicy = "no-referrer";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load image for color extraction"));
    image.src = imageUrl;
  });
}
function extractQuantizedPixels(imageData) {
  const colors = [];
  for (let index = 0; index < imageData.length; index += 4) {
    const alpha = imageData[index + 3] ?? 0;
    if (alpha < 16) continue;
    const red = quantizeChannel(imageData[index] ?? 0);
    const green = quantizeChannel(imageData[index + 1] ?? 0);
    const blue = quantizeChannel(imageData[index + 2] ?? 0);
    colors.push((0, import_chroma_js.default)(red, green, blue).hex());
  }
  return colors;
}
function extractEdgeQuantizedPixels(imageData, width, height) {
  const edgeColors = [];
  const edgeThickness = Math.max(1, Math.floor(Math.min(width, height) * 0.1));
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const isEdge = x < edgeThickness || x >= width - edgeThickness || y < edgeThickness || y >= height - edgeThickness;
      if (!isEdge) continue;
      const pixelIndex = (y * width + x) * 4;
      const alpha = imageData[pixelIndex + 3] ?? 0;
      if (alpha < 16) continue;
      const red = quantizeChannel(imageData[pixelIndex] ?? 0);
      const green = quantizeChannel(imageData[pixelIndex + 1] ?? 0);
      const blue = quantizeChannel(imageData[pixelIndex + 2] ?? 0);
      edgeColors.push((0, import_chroma_js.default)(red, green, blue).hex());
    }
  }
  return edgeColors;
}
function getMostFrequentColor(colors) {
  if (colors.length === 0) return null;
  const frequencies = /* @__PURE__ */ new Map();
  for (const color of colors) {
    frequencies.set(color, (frequencies.get(color) ?? 0) + 1);
  }
  let selectedColor = null;
  let selectedCount = 0;
  for (const [color, count] of frequencies.entries()) {
    if (count > selectedCount) {
      selectedColor = color;
      selectedCount = count;
    }
  }
  return selectedColor;
}
function quantizeChannel(value) {
  return Math.round(value / 16) * 16;
}
var useQueryParamBuilder = () => {
  const searchParams = (0, import_navigation.useSearchParams)();
  const createQueryString = (0, import_react.useCallback)(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  const deleteParamFromQueryString = (0, import_react.useCallback)(
    (name) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      return params.toString();
    },
    [searchParams]
  );
  return { createQueryString, deleteParamFromQueryString };
};
var client_default = useQueryParamBuilder;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getBackgroundColor,
  getBackgroundTextColor,
  getDominantColorFromImageUrl,
  getPrimaryShadeColor
});
//# sourceMappingURL=client.js.map