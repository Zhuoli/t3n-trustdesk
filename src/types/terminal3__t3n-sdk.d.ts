/** Ambient stub so typecheck passes when optionalDependency is not installed. */
declare module "@terminal3/t3n-sdk" {
  export function setEnvironment(env: string): void;
  export function loadWasmComponent(): Promise<unknown>;
  export function eth_get_address(key: string): string;
  export function metamask_sign(
    address: string,
    unused: undefined,
    key: string,
  ): unknown;
  export function createEthAuthInput(address: string): unknown;
  export class T3nClient {
    constructor(opts: Record<string, unknown>);
    handshake(): Promise<void>;
    authenticate(input: unknown): Promise<{ value?: string } | string>;
  }
}
