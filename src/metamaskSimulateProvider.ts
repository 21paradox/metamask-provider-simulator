import { ethers } from 'ethers';
import * as sigUtil from 'eth-sig-util';
import * as ethUtil from 'ethereumjs-util';

export const initProviderOnly = ( 
  rpcUrl: string,
  chainid: number,
  privateKey: string,
  checker: () => boolean,
) => {
  let wallet = new ethers.Wallet(privateKey);
  const getPrivateKey = () => {
    return wallet.privateKey.replace(/^0x/, '');
  };

   class MetamaskSimulateProvider extends ethers.providers.JsonRpcProvider {
    constructor(rpcUrl: string, chainid: number) {
      super(rpcUrl, chainid);
      this.selectedAddress = wallet.address;
      this.isMetaMask = true;

      this.enable = function () {
        return this.request({ method: 'eth_requestAccounts' });
      };

      this.sendAsync = function (payload, callback) {
        const ret = this.request(payload);
        ret
          .then((res) => {
            callback(res);
          })
          .catch((err) => {
            callback(err);
          });
      };
    }

    selectedAddress: string;
    isMetaMask: true;

    enable() {
      return this.request({ method: 'eth_requestAccounts' });
    }

    sendAsync(payload: any, callback: (arg: any) => any) {
      const ret = this.request(payload);
      ret
        .then((res) => {
          callback(res);
        })
        .catch((err) => {
          callback(err);
        });
    }

    send(method: string, params: any[]) {
      // console.log({
      //   method
      // }, ...args)
      return super.send(method, params);
    }

    async request(args: { method: string; params?: any[] }) {
      const { method, params = [] } = args;
      // console.info(args)
      if (!checker()) {
        throw new Error('invalid checker, please provide c');
      }

      if (method === 'eth_requestAccounts') {
        return [this.selectedAddress];
      }

      if (method === 'eth_accounts') {
        return [this.selectedAddress];
      }

      if (
        method === 'wallet_requestPermissions' ||
        method === 'wallet_getPermissions'
      ) {
        return [
          {
            invoker: window.location.href,
            parentCapability: 'eth_accounts',
            caveats: [
              {
                type: 'filterResponse',
                value: [this.selectedAddress],
              },
            ],
          },
        ];
      }

      if (method === 'eth_getEncryptionPublicKey') {
        const response = sigUtil.getEncryptionPublicKey(
          wallet.privateKey.replace(/^0x/, ''),
        );
        return response;
      }

      if (method === 'eth_decrypt') {
        const intxt = params[0];
        const jsonStr = Buffer.from(intxt.replace(/^0x/, ''), 'hex').toString(
          'utf-8',
        );
        const parsed = JSON.parse(jsonStr);
        const response = sigUtil.decrypt(parsed, getPrivateKey());
        return response;
      }

      if (method === 'eth_sendTransaction') {
        const payload = {
          ...params[0],
        };
        payload.gasLimit = payload.gas;
        delete payload.gas;
        // if (payload.gasLimit) {
        //   payload.gasLimit = ethers.BigNumber.from(payload.gasLimit)
        // }
        // if (payload.gasPrice) {
        //   payload.gasPrice = ethers.BigNumber.from(payload.gasPrice)
        // }
        // payload.value = ethers.BigNumber.from(payload.value)
        // console.log(payload)
        const res = await wallet.sendTransaction(payload);
        return res.hash;
      }

      if (method === 'eth_sign') {
        const privKey = getPrivateKey();
        const pkeyarr = Buffer.from(privKey, 'hex');
        const message = params[1].replace(/^0x/, '');
        const msgarr = Buffer.from(message, 'hex');
        const msgSig = ethUtil.ecsign(msgarr, pkeyarr);

        const out = sigUtil.concatSig(
          ethUtil.toBuffer(msgSig.v),
          ethUtil.toBuffer(msgSig.r),
          ethUtil.toBuffer(msgSig.s),
        );
        const rawMsgSig = ethUtil.bufferToHex(ethUtil.toBuffer(out));
        return rawMsgSig;
      }

      if (method === 'personal_sign') {
        const privKey = getPrivateKey();
        const pkeyarr = Buffer.from(privKey, 'hex');
        const rawMsgSig = sigUtil.personalSign(pkeyarr, {
          data: params[0],
        });
        return rawMsgSig;
      }

      if (method === 'personal_ecRecover') {
        const rawMsgSig = sigUtil.recoverPersonalSignature({
          data: params[0],
          sig: params[1],
        });
        return rawMsgSig;
      }

      if (method === 'eth_signTypedData') {
        const privKey = getPrivateKey();
        const pkeyarr = Buffer.from(privKey, 'hex');
        const rawMsgSig = sigUtil.signTypedDataLegacy(pkeyarr, {
          data: params[0],
        });
        return rawMsgSig;
      }

      if (method === 'eth_signTypedData_v3') {
        const privKey = getPrivateKey();
        const pkeyarr = Buffer.from(privKey, 'hex');
        const rawMsgSig = sigUtil.signTypedData(pkeyarr, {
          data: JSON.parse(params[1]),
        });
        return rawMsgSig;
      }

      if (method === 'eth_signTypedData_v4') {
        const privKey = getPrivateKey();
        const pkeyarr = Buffer.from(privKey, 'hex');
        const rawMsgSig = sigUtil.signTypedData_v4(pkeyarr, {
          data: JSON.parse(params[1]),
        });
        return rawMsgSig;
      }

      return this.send(method, params);
    }

    isConnected() {
      return true;
    }
  }

  const simProvider = new MetamaskSimulateProvider(rpcUrl, chainid);
  wallet = wallet.connect(simProvider);

  // Object.assign(window, {
  //   ethereum: simProvider,
  // });
  // const event = new CustomEvent('ethereum#initialized', {});
  // window.dispatchEvent(event);

  return simProvider;
};

export const initProvider = (
  rpcUrl: string,
  chainid: number,
  privateKey: string,
  checker: () => boolean,
) => {
  const simProvider = initProviderOnly(rpcUrl, chainid, privateKey, checker);
  Object.assign(window, {
    ethereum: simProvider,
  });
  const event = new CustomEvent('ethereum#initialized', {});
  window.dispatchEvent(event);
  return simProvider;
};
