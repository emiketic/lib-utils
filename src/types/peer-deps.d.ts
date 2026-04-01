// Minimal type stubs for optional peer dependencies.
// These allow DTS generation without requiring the full packages as devDependencies.

declare module '@mantine/core' {
  export function darken(color: string, amount: number): string;
  export function lighten(color: string, amount: number): string;
  export function isLightColor(color: string): boolean;
}

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: unknown[]): T;
}

declare module 'next/navigation' {
  export function useSearchParams(): {
    toString(): string;
  };
}
