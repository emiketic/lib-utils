// src/client.ts
import chroma from "chroma-js";
import { darken, isLightColor, lighten } from "@mantine/core";
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
function getPrimaryShadeColor(color) {
  return chroma(color).set("hsl.s", 1).set("hsl.l", 0.55).hex();
}
function getBackgroundTextColor(color = "#ffffff", darkenAmount = 0.3, lightenAmount = 0.1) {
  if (!color) {
    return "#000000";
  }
  const darkerColor = darken(getPrimaryShadeColor(color), darkenAmount);
  const lightColor = lighten(getPrimaryShadeColor(color), lightenAmount);
  return isLightColor(color) ? darkerColor : lightColor;
}
function getBackgroundColor(color = "#ffffff", darkenAmount = 0.3, lightenAmount = 0.8) {
  if (!color) {
    return "#000000";
  }
  const darkerColor = darken(getPrimaryShadeColor(color), darkenAmount);
  const lightColor = lighten(getPrimaryShadeColor(color), lightenAmount);
  const inputLuminance = chroma(color).luminance();
  if (inputLuminance > 0.9) {
    return darkerColor;
  }
  if (inputLuminance < 0.15) {
    return lightColor;
  }
  const contrastLight = chroma.contrast(color, lightColor);
  const contrastDark = chroma.contrast(color, darkerColor);
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
      background ? allPixels.filter((hex) => chroma.distance(hex, background, "rgb") > 28) : allPixels
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
    colors.push(chroma(red, green, blue).hex());
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
      edgeColors.push(chroma(red, green, blue).hex());
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
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  const deleteParamFromQueryString = useCallback(
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
export {
  client_default as default,
  getBackgroundColor,
  getBackgroundTextColor,
  getDominantColorFromImageUrl,
  getPrimaryShadeColor
};
//# sourceMappingURL=client.mjs.map