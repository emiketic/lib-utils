/* -------------------------------------------------------------------------- */
/*                               Validation                                   */
/* -------------------------------------------------------------------------- */

/**
 * Returns true if the given string is a valid e-mail address.
 */
export const isEmail = (value: string | undefined): boolean =>
  !value ? false : /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(value);

/**
 * Returns true if the given string is a valid MongoDB ObjectId (24 hex chars)
 * or a UUID v1–v5.
 */
export const isValidObjectId = (id: string): boolean => {
  if (typeof id !== 'string') return false;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  const isUUID =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
      id
    );
  return isObjectId || isUUID;
};

/**
 * Returns true if the given string is a valid UUID v1–v5.
 */
export const isValidUUID = (id: string): boolean => {
  if (typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
    id
  );
};

/**
 * Returns true if the given string is a valid URL (http/https, localhost, IP, or domain).
 */
export const isValidURL = (url: string): boolean => {
  const pattern =
    /^(https?:\/\/)?(localhost|\d{1,3}(\.\d{1,3}){3}|\[[a-fA-F0-9:]+\]|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d{1,5})?(\/\S*)?$/;
  return !!pattern.test(url);
};

/**
 * Returns true if the value looks like a File object (browser) or a Node.js Readable stream.
 */
export const isFile = (file: unknown): boolean => {
  if (file && typeof file === 'object' && 'size' in file && 'type' in file) {
    return true;
  }
  if (
    typeof window === 'undefined' &&
    file &&
    typeof (file as Record<string, unknown>).pipe === 'function'
  ) {
    return true;
  }
  return false;
};

/* -------------------------------------------------------------------------- */
/*                               Primitives                                   */
/* -------------------------------------------------------------------------- */

/**
 * Truncates a string to `maxLength` characters, appending an ellipsis if needed.
 * Defaults to 25 characters.
 */
export const truncate = (text: string, maxLength: number = 25): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}…`;
};

/* -------------------------------------------------------------------------- */
/*                                   SSR                                      */
/* -------------------------------------------------------------------------- */

/**
 * Returns true when running on the server (no `window` object).
 */
export const isServer = (): boolean => typeof window === 'undefined';

/**
 * Returns true when running in the browser.
 */
export const isClient = (): boolean => !isServer();

/* -------------------------------------------------------------------------- */
/*                                  Maths                                     */
/* -------------------------------------------------------------------------- */

/**
 * Formats a number to one decimal place (e.g. `4.567` → `4.6`).
 * Returns `0` for `null` or `undefined` input.
 */
export const formatNumberToOneDecimal = (value: number | null | undefined): number =>
  parseFloat(value?.toFixed(1) ?? '0');

/* -------------------------------------------------------------------------- */
/*                               Navigation                                   */
/* -------------------------------------------------------------------------- */

/**
 * Returns the parent path of a given route string.
 * e.g. `"/a/b/c"` → `"/a/b"`
 */
export function getParentFolder(path: string): string {
  const parts = path.split('/').filter(Boolean);
  parts.pop();
  return `/${parts.join('/')}`;
}

/* -------------------------------------------------------------------------- */
/*                                Testing                                      */
/* -------------------------------------------------------------------------- */

/**
 * Returns true when the current page is running inside Storybook
 * (checks URL for localhost:6006 or the string "storybook").
 */
export const isStorybook = (): boolean => {
  const storybookPort = process.env.NEXT_PUBLIC_STORYBOOK_PORT || 6006;
  return (
    window.location.href.includes(`localhost:${storybookPort}`) ||
    window.location.href.includes('storybook')
  );
};

/* -------------------------------------------------------------------------- */
/*                                  Phone                                     */
/* -------------------------------------------------------------------------- */

import parsePhoneNumber from 'libphonenumber-js';

/**
 * Returns true if the given string is a valid international phone number.
 */
export const isValidPhone = (phoneNumberString: string): boolean =>
  parsePhoneNumber(phoneNumberString)?.isValid() ?? false;

/* -------------------------------------------------------------------------- */
/*                                   JWT                                      */
/* -------------------------------------------------------------------------- */

import jwt from 'jsonwebtoken';

/**
 * Signs a JWT with RS256 and returns the encoded token string.
 *
 * @param data         - Key/value payload to embed in the token.
 * @param secret       - The RSA private key (PEM) or HMAC secret used to sign.
 * @param expiresInHours - Token lifetime in hours (default: 1).
 */
export const getEncodedToken = (
  data: Record<string, string | number>,
  secret: string,
  expiresInHours: number = 1
): Promise<unknown> =>
  new Promise((resolve, reject) => {
    jwt.sign(
      data,
      secret,
      { algorithm: 'RS256', expiresIn: expiresInHours * 60 * 60 },
      (err, encoded) => {
        if (err) {
          reject(new Error('could not sign token'));
        } else {
          resolve(encoded);
        }
      }
    );
  });

/**
 * Verifies and decodes a JWT.
 *
 * @param token  - The encoded JWT string.
 * @param secret - The RSA public key (PEM) or HMAC secret used to verify.
 */
export const decodeToken = (token: string, secret: string): Promise<unknown> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(new Error('could not verify token'));
      } else {
        resolve(decoded);
      }
    });
  });

/* -------------------------------------------------------------------------- */
/*                                Location                                    */
/* -------------------------------------------------------------------------- */

interface GeocoderAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

/**
 * Parses a Google Maps Geocoder address components array into a flat address object
 * with fields: `home`, `postal_code`, `street`, `region`, `city`, `country`.
 */
export const getAddressFromComponents = (
  address_components: GeocoderAddressComponent[]
): {
  home: string;
  postal_code: string;
  street: string;
  region: string;
  city: string;
  country: string;
} => {
  const ShouldBeComponent: Record<string, string[]> = {
    home: ['street_number'],
    postal_code: ['postal_code'],
    street: ['street_address', 'route'],
    region: [
      'administrative_area_level_1',
      'administrative_area_level_2',
      'administrative_area_level_3',
      'administrative_area_level_4',
      'administrative_area_level_5',
    ],
    city: [
      'locality',
      'sublocality',
      'sublocality_level_1',
      'sublocality_level_2',
      'sublocality_level_3',
      'sublocality_level_4',
    ],
    country: ['country'],
  };

  const address = {
    home: '',
    postal_code: '',
    street: '',
    region: '',
    city: '',
    country: '',
  };

  address_components.forEach((component) => {
    for (const shouldBe in ShouldBeComponent) {
      if (ShouldBeComponent[shouldBe]!.indexOf(component.types[0]!) !== -1) {
        if (shouldBe === 'country') {
          address.country = component.short_name;
        } else {
          (address as Record<string, string>)[shouldBe] = component.long_name;
        }
      }
    }
  });

  return address;
};

/* -------------------------------------------------------------------------- */
/*                                  File                                      */
/* -------------------------------------------------------------------------- */

/**
 * Fetches a remote URL and returns a base64-encoded data URI.
 *
 * @param url       - The remote resource URL.
 * @param extension - Image extension for the data URI MIME type (default: `"jpeg"`).
 */
export const getBase64FromUrl = async (url: string, extension = 'jpeg'): Promise<string> => {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:image/${extension};base64,${buffer.toString('base64')}`;
};
