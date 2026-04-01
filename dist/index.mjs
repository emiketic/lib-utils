// src/index.ts
import parsePhoneNumber from "libphonenumber-js";
import jwt from "jsonwebtoken";
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
var isValidPhone = (phoneNumberString) => parsePhoneNumber(phoneNumberString)?.isValid() ?? false;
var getEncodedToken = (data, secret, expiresInHours = 1) => new Promise((resolve, reject) => {
  jwt.sign(
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
  jwt.verify(token, secret, (err, decoded) => {
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
export {
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
};
//# sourceMappingURL=index.mjs.map