# @emiketic/lib-utils

Shared utility functions for NodeJS and NextJS.
Covers validation, text, math, navigation, JWT, phone, color, image analysis, and more.

## Install

```bash
npm install @emiketic/lib-utils
# or
pnpm add @emiketic/lib-utils
```

## Entry Points

| Import path | Environment | Extra peer deps required |
|---|---|---|
| `@emiketic/lib-utils` | Isomorphic (Node + browser) | — |
| `@emiketic/lib-utils/server` | Node.js only | — |
| `@emiketic/lib-utils/client` | Browser + React only | `chroma-js`, `@mantine/core`, `react`, `next` |

---

## `@emiketic/lib-utils` — Isomorphic utilities

### Validation

```ts
import { isEmail, isValidObjectId, isValidUUID, isValidURL, isFile } from '@emiketic/lib-utils';
```

| Function | Signature | Description |
|---|---|---|
| `isEmail` | `(value?: string) => boolean` | Returns `true` if the string is a valid e-mail address. |
| `isValidObjectId` | `(id: string) => boolean` | Returns `true` if the string is a valid MongoDB ObjectId (24 hex chars) or UUID v1–v5. |
| `isValidUUID` | `(id: string) => boolean` | Returns `true` if the string is a valid UUID v1–v5. |
| `isValidURL` | `(url: string) => boolean` | Returns `true` for valid http/https URLs, localhost, IP addresses, and domains. |
| `isFile` | `(file: unknown) => boolean` | Returns `true` if the value is a `File`-like object (browser) or a Node.js Readable stream. |

### Primitives

```ts
import { truncate } from '@emiketic/lib-utils';
```

| Function | Signature | Description |
|---|---|---|
| `truncate` | `(text: string, maxLength?: number) => string` | Truncates a string to `maxLength` chars (default 25), appending `…` if needed. |

### SSR

```ts
import { isServer, isClient } from '@emiketic/lib-utils';
```

| Function | Signature | Description |
|---|---|---|
| `isServer` | `() => boolean` | Returns `true` when running in a Node.js / server context. |
| `isClient` | `() => boolean` | Returns `true` when running in the browser. |

### Maths

```ts
import { formatNumberToOneDecimal } from '@emiketic/lib-utils';
```

| Function | Signature | Description |
|---|---|---|
| `formatNumberToOneDecimal` | `(value?: number \| null) => number` | Rounds a number to 1 decimal place. Returns `0` for `null`/`undefined`. |

### Navigation

```ts
import { getParentFolder } from '@emiketic/lib-utils';
```

| Function | Signature | Description |
|---|---|---|
| `getParentFolder` | `(path: string) => string` | Returns the parent segment of a path string. `"/a/b/c"` → `"/a/b"`. |

### Testing

```ts
import { isStorybook } from '@emiketic/lib-utils';
```

| Function | Signature | Description |
|---|---|---|
| `isStorybook` | `() => boolean` | Returns `true` when the page is rendered inside Storybook (detects port 6006 or `"storybook"` in the URL). |

### Phone

```ts
import { isValidPhone } from '@emiketic/lib-utils';
```

| Function | Signature | Description |
|---|---|---|
| `isValidPhone` | `(phoneNumberString: string) => boolean` | Returns `true` if the string is a valid international phone number (via `libphonenumber-js`). |

### JWT

```ts
import { getEncodedToken, decodeToken } from '@emiketic/lib-utils';
```

| Function | Signature | Description |
|---|---|---|
| `getEncodedToken` | `(data, secret, expiresInHours?) => Promise<unknown>` | Signs a payload as a JWT using RS256. `secret` is a PEM private key or HMAC secret. Default expiry: 1 hour. |
| `decodeToken` | `(token, secret) => Promise<unknown>` | Verifies and decodes a JWT. `secret` is the corresponding public key or HMAC secret. |

### Location

```ts
import { getAddressFromComponents } from '@emiketic/lib-utils';
```

| Function | Signature | Description |
|---|---|---|
| `getAddressFromComponents` | `(components: GeocoderAddressComponent[]) => AddressObject` | Parses a Google Maps Geocoder `address_components` array into a flat object with `home`, `postal_code`, `street`, `region`, `city`, and `country` fields. |

### File

```ts
import { getBase64FromUrl } from '@emiketic/lib-utils';
```

| Function | Signature | Description |
|---|---|---|
| `getBase64FromUrl` | `(url: string, extension?: string) => Promise<string>` | Fetches a remote URL and returns a base64-encoded data URI (e.g. `data:image/jpeg;base64,...`). |

---

## `@emiketic/lib-utils/server` — Server-only utilities

Requires Node.js. Do not import in browser/client bundles.

```ts
import { getFileFromPath } from '@emiketic/lib-utils/server';
```

| Function | Signature | Description |
|---|---|---|
| `getFileFromPath` | `(filePath: string, type?: string) => Promise<File>` | Reads a file from disk and returns a `File`-like object compatible with browser `FormData` APIs. Useful for server-side form submissions. |

---

## `@emiketic/lib-utils/client` — Client/browser utilities

Requires browser DOM APIs. For Next.js apps, wrap in a Client Component (`"use client"`).

Peer dependencies: `chroma-js`, `@mantine/core >=7`, `react >=18`, `next >=14`

### Color

```ts
import { getPrimaryShadeColor, getBackgroundTextColor, getBackgroundColor } from '@emiketic/lib-utils/client';
```

| Function | Signature | Description |
|---|---|---|
| `getPrimaryShadeColor` | `(color: string) => string` | Returns a full-saturation, mid-lightness (55%) version of the color — suitable as a primary theme shade. |
| `getBackgroundTextColor` | `(color?, darkenAmount?, lightenAmount?) => string` | Returns a dark or light text color that contrasts well against the given background color. |
| `getBackgroundColor` | `(color?, darkenAmount?, lightenAmount?) => string` | Returns a complementary background color based on luminance contrast. |

### Image

```ts
import { getDominantColorFromImageUrl } from '@emiketic/lib-utils/client';
```

| Function | Signature | Description |
|---|---|---|
| `getDominantColorFromImageUrl` | `(imageUrl, fallbackDominant?, fallbackBackground?) => Promise<{ dominant: string, background: string }>` | Extracts the dominant foreground color and background color from an image via canvas pixel analysis with edge detection. Browser-only. |

### Navigation (Next.js)

```ts
import useQueryParamBuilder from '@emiketic/lib-utils/client';
```

| Hook | Returns | Description |
|---|---|---|
| `useQueryParamBuilder` | `{ createQueryString, deleteParamFromQueryString }` | React hook for building/modifying URL query strings. `createQueryString(name, value)` sets a param; `deleteParamFromQueryString(name)` removes one. Requires Next.js (`next/navigation`). |

---

## License

MIT © [EMIKETIC](https://emiketic.com)
