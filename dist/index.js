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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  decodeToken: () => decodeToken,
  formatNumberToOneDecimal: () => formatNumberToOneDecimal,
  getAddressFromComponents: () => getAddressFromComponents,
  getBase64FromUrl: () => getBase64FromUrl,
  getEncodedToken: () => getEncodedToken,
  getParentFolder: () => getParentFolder,
  isClient: () => isClient,
  isEmail: () => isEmail,
  isFile: () => isFile,
  isServer: () => isServer,
  isStorybook: () => isStorybook,
  isValidObjectId: () => isValidObjectId,
  isValidPhone: () => isValidPhone,
  isValidURL: () => isValidURL,
  isValidUUID: () => isValidUUID,
  truncate: () => truncate
});
module.exports = __toCommonJS(src_exports);
var import_libphonenumber_js = __toESM(require("libphonenumber-js"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var isEmail = (value) => !value ? false : /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(value);
var isValidObjectId = (id) => {
  if (typeof id !== "string") return false;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
    id
  );
  return isObjectId || isUUID;
};
var isValidUUID = (id) => {
  if (typeof id !== "string") return false;
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
    id
  );
};
var isValidURL = (url) => {
  const pattern = /^(https?:\/\/)?(localhost|\d{1,3}(\.\d{1,3}){3}|\[[a-fA-F0-9:]+\]|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d{1,5})?(\/\S*)?$/;
  return !!pattern.test(url);
};
var isFile = (file) => {
  if (file && typeof file === "object" && "size" in file && "type" in file) {
    return true;
  }
  if (typeof window === "undefined" && file && typeof file.pipe === "function") {
    return true;
  }
  return false;
};
var truncate = (text, maxLength = 25) => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}\u2026`;
};
var isServer = () => typeof window === "undefined";
var isClient = () => !isServer();
var formatNumberToOneDecimal = (value) => parseFloat(value?.toFixed(1) ?? "0");
function getParentFolder(path) {
  const parts = path.split("/").filter(Boolean);
  parts.pop();
  return `/${parts.join("/")}`;
}
var isStorybook = () => {
  const storybookPort = process.env.NEXT_PUBLIC_STORYBOOK_PORT || 6006;
  return window.location.href.includes(`localhost:${storybookPort}`) || window.location.href.includes("storybook");
};
var isValidPhone = (phoneNumberString) => (0, import_libphonenumber_js.default)(phoneNumberString)?.isValid() ?? false;
var getEncodedToken = (data, secret, expiresInHours = 1) => new Promise((resolve, reject) => {
  import_jsonwebtoken.default.sign(
    data,
    secret,
    { algorithm: "RS256", expiresIn: expiresInHours * 60 * 60 },
    (err, encoded) => {
      if (err) {
        reject(new Error("could not sign token"));
      } else {
        resolve(encoded);
      }
    }
  );
});
var decodeToken = (token, secret) => new Promise((resolve, reject) => {
  import_jsonwebtoken.default.verify(token, secret, (err, decoded) => {
    if (err) {
      reject(new Error("could not verify token"));
    } else {
      resolve(decoded);
    }
  });
});
var getAddressFromComponents = (address_components) => {
  const ShouldBeComponent = {
    home: ["street_number"],
    postal_code: ["postal_code"],
    street: ["street_address", "route"],
    region: [
      "administrative_area_level_1",
      "administrative_area_level_2",
      "administrative_area_level_3",
      "administrative_area_level_4",
      "administrative_area_level_5"
    ],
    city: [
      "locality",
      "sublocality",
      "sublocality_level_1",
      "sublocality_level_2",
      "sublocality_level_3",
      "sublocality_level_4"
    ],
    country: ["country"]
  };
  const address = {
    home: "",
    postal_code: "",
    street: "",
    region: "",
    city: "",
    country: ""
  };
  address_components.forEach((component) => {
    for (const shouldBe in ShouldBeComponent) {
      if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
        if (shouldBe === "country") {
          address.country = component.short_name;
        } else {
          address[shouldBe] = component.long_name;
        }
      }
    }
  });
  return address;
};
var getBase64FromUrl = async (url, extension = "jpeg") => {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:image/${extension};base64,${buffer.toString("base64")}`;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decodeToken,
  formatNumberToOneDecimal,
  getAddressFromComponents,
  getBase64FromUrl,
  getEncodedToken,
  getParentFolder,
  isClient,
  isEmail,
  isFile,
  isServer,
  isStorybook,
  isValidObjectId,
  isValidPhone,
  isValidURL,
  isValidUUID,
  truncate
});
//# sourceMappingURL=index.js.map