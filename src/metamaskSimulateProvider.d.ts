import { ethers } from 'ethers';
declare class MetamaskSimulateProvider extends ethers.providers.JsonRpcProvider {
    constructor(rpcUrl: string, chainid: number, wallet: ethers.Wallet);
    selectedAddress: string;
    isMetaMask: true;
    wallet: ethers.Wallet;
    getPrivateKey(): string;
    enable(): Promise<any>;
    sendAsync(payload: any, callback: (arg: any) => any): void;
    send(method: string, params: any[]): Promise<any>;
    request(args: {
        method: string;
        params?: any[];
    }): Promise<any>;
    isConnected(): boolean;
}
export declare const initProvider: (rpcUrl: string, chainid: number, privateKey: string) => MetamaskSimulateProvider;
export {};
