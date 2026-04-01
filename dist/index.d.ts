/**
 * Returns true if the given string is a valid e-mail address.
 */
declare const isEmail: (value: string | undefined) => boolean;
/**
 * Returns true if the given string is a valid MongoDB ObjectId (24 hex chars)
 * or a UUID v1–v5.
 */
declare const isValidObjectId: (id: string) => boolean;
/**
 * Returns true if the given string is a valid UUID v1–v5.
 */
declare const isValidUUID: (id: string) => boolean;
/**
 * Returns true if the given string is a valid URL (http/https, localhost, IP, or domain).
 */
declare const isValidURL: (url: string) => boolean;
/**
 * Returns true if the value looks like a File object (browser) or a Node.js Readable stream.
 */
declare const isFile: (file: unknown) => boolean;
/**
 * Truncates a string to `maxLength` characters, appending an ellipsis if needed.
 * Defaults to 25 characters.
 */
declare const truncate: (text: string, maxLength?: number) => string;
/**
 * Returns true when running on the server (no `window` object).
 */
declare const isServer: () => boolean;
/**
 * Returns true when running in the browser.
 */
declare const isClient: () => boolean;
/**
 * Formats a number to one decimal place (e.g. `4.567` → `4.6`).
 * Returns `0` for `null` or `undefined` input.
 */
declare const formatNumberToOneDecimal: (value: number | null | undefined) => number;
/**
 * Returns the parent path of a given route string.
 * e.g. `"/a/b/c"` → `"/a/b"`
 */
declare function getParentFolder(path: string): string;
/**
 * Returns true when the current page is running inside Storybook
 * (checks URL for localhost:6006 or the string "storybook").
 */
declare const isStorybook: () => boolean;
/**
 * Returns true if the given string is a valid international phone number.
 */
declare const isValidPhone: (phoneNumberString: string) => boolean;
/**
 * Signs a JWT with RS256 and returns the encoded token string.
 *
 * @param data         - Key/value payload to embed in the token.
 * @param secret       - The RSA private key (PEM) or HMAC secret used to sign.
 * @param expiresInHours - Token lifetime in hours (default: 1).
 */
declare const getEncodedToken: (data: Record<string, string | number>, secret: string, expiresInHours?: number) => Promise<unknown>;
/**
 * Verifies and decodes a JWT.
 *
 * @param token  - The encoded JWT string.
 * @param secret - The RSA public key (PEM) or HMAC secret used to verify.
 */
declare const decodeToken: (token: string, secret: string) => Promise<unknown>;
interface GeocoderAddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}
/**
 * Parses a Google Maps Geocoder address components array into a flat address object
 * with fields: `home`, `postal_code`, `street`, `region`, `city`, `country`.
 */
declare const getAddressFromComponents: (address_components: GeocoderAddressComponent[]) => {
    home: string;
    postal_code: string;
    street: string;
    region: string;
    city: string;
    country: string;
};
/**
 * Fetches a remote URL and returns a base64-encoded data URI.
 *
 * @param url       - The remote resource URL.
 * @param extension - Image extension for the data URI MIME type (default: `"jpeg"`).
 */
declare const getBase64FromUrl: (url: string, extension?: string) => Promise<string>;

export { decodeToken, formatNumberToOneDecimal, getAddressFromComponents, getBase64FromUrl, getEncodedToken, getParentFolder, isClient, isEmail, isFile, isServer, isStorybook, isValidObjectId, isValidPhone, isValidURL, isValidUUID, truncate };
