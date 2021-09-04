<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->

    <div>
      <p>
        <button @click="requestAccounts()">requestAccounts</button>
        <span> ---- </span>
        <button @click="requestAccounts1()">requestAccounts1</button>
      </p>

      <p>
        <button @click="accounts()">accounts</button>
        <span> ---- </span>
        <button @click="accounts1()">accounts1</button>
      </p>

      <p>
        <button @click="wallet_requestPermissions()">
          wallet_requestPermissions
        </button>
        <span> ---- </span>
        <button @click="wallet_requestPermissions1()">
          wallet_requestPermissions1
        </button>
      </p>

      <p>
        <button @click="eth_getEncryptionPublicKey()">
          eth_getEncryptionPublicKey
        </button>
        <span> ---- </span>
        <button @click="eth_getEncryptionPublicKey1()">
          eth_getEncryptionPublicKey1
        </button>
      </p>

      <p>
        <button @click="eth_decrypt()">
          eth_decrypt
        </button>
        <span> ---- </span>
        <button @click="eth_decrypt1()">
          eth_decrypt1
        </button>
      </p>

      <p>
        <button @click="eth_sendTransaction()">
          eth_sendTransaction
        </button>
        <span> ---- </span>
        <button @click="eth_sendTransaction1()">
          eth_sendTransaction1
        </button>
      </p>

      <p>
        <button @click="sendTransaction()">
          sendTransaction
        </button>
        <span> ---- </span>
        <button @click="sendTransaction1()">
          sendTransaction1
        </button>
      </p>

      <p>
        <button @click="eth_sign()">
          eth_sign
        </button>
        <span> ---- </span>
        <button @click="eth_sign1()">
          eth_sign1
        </button>
      </p>

      <p>
        <button @click="personal_sign()">
          personal_sign
        </button>
        <span> ---- </span>
        <button @click="personal_sign1()">
          personal_sign1
        </button>
      </p>

      <p>
        <button @click="personal_ecRecover()">
          personal_ecRecover
        </button>
        <span> ---- </span>
        <button @click="personal_ecRecover1()">
          personal_ecRecover1
        </button>
      </p>

      <p>
        <button @click="eth_signTypedData()">
          eth_signTypedData
        </button>
        <span> ---- </span>
        <button @click="eth_signTypedData1()">
          eth_signTypedData1
        </button>
      </p>

      <p>
        <button @click="eth_signTypedData_v3()">
          eth_signTypedData_v3
        </button>
        <span> ---- </span>
        <button @click="eth_signTypedData_v3_1()">
          eth_signTypedData_v3_1
        </button>
      </p>

      <p>
        <button @click="eth_signTypedData_v4()">
          eth_signTypedData_v4
        </button>
        <span> ---- </span>
        <button @click="eth_signTypedData_v4_1()">
          eth_signTypedData_v4_1
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';
// import * as conf from './config'
import * as sigUtil from 'eth-sig-util'
import {
  initProvider
} from './metamaskSimulateProvider'

const chainid = Number(process.env.VUE_APP_chainid)

const myProvider = initProvider(
  process.env.VUE_APP_rpcUrl,
  Number(process.env.VUE_APP_chainid), 
  process.env.VUE_APP_privateKey
);

export default {
  name: 'App',
  components: {
    // HelloWorld,
  },
  methods: {
    async requestAccounts() {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log(accounts);
    },

    async requestAccounts1() {
      const accounts = await myProvider.request({
        method: 'eth_requestAccounts',
      });
      console.log(accounts);
    },

    async accounts() {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      console.log(accounts);
    },
    async accounts1() {
      const accounts = await myProvider.request({
        method: 'eth_accounts',
      });
      console.log(accounts);
    },

    async wallet_requestPermissions() {
      const response = await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
      console.log(response);
    },
    async wallet_requestPermissions1() {
      const accounts = await myProvider.request({
        method: 'wallet_requestPermissions',
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
      console.log(accounts);
    },

    async eth_getEncryptionPublicKey() {
      const response = await window.ethereum.request({
        method: 'eth_getEncryptionPublicKey',
        params: [window.ethereum.selectedAddress],
      });
      console.log(response);
    },

    async eth_getEncryptionPublicKey1() {
      const res = await myProvider.request({
        method: 'eth_getEncryptionPublicKey',
        params: [myProvider.selectedAddress],
      });
      console.log(res);
      return res;
    },

    async getDecMsg() {
      const msg = 'rand-msg';
      const pubkey = await this.eth_getEncryptionPublicKey1();

      const encJson = sigUtil.encrypt(
        pubkey,
        { data: msg },
        'x25519-xsalsa20-poly1305',
      );

      console.log(encJson);

      const buf = Buffer.from(JSON.stringify(encJson), 'utf8');
      const intxt = '0x' + buf.toString('hex');
      return intxt;
    },

    async eth_decrypt() {
      const intxt = await this.getDecMsg();
      console.log(intxt);

      const response = await window.ethereum.request({
        method: 'eth_decrypt',
        params: [intxt, window.ethereum.selectedAddress],
      });
      console.log(response);
    },

    async eth_decrypt1() {
      const intxt = await this.getDecMsg();
      console.log(intxt);
      //  const jsonStr = Buffer.from(intxt.replace(/^0x/, ''), 'hex').toString('utf-8');
      //  const parsed = JSON.parse(jsonStr)

      const response = await myProvider.request({
        method: 'eth_decrypt',
        params: [intxt, myProvider.selectedAddress],
      });
      console.log(response);
    },

    async eth_sendTransaction() {
      const unit = ethers.utils.parseEther('0.01');
      const unitHex = ethers.utils.hexValue(unit);

      const result = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: window.ethereum.selectedAddress,
            to: window.ethereum.selectedAddress,
            // gas: '0x76c0', // 30400
            // gasPrice: '0x9184e72a000', // 10000000000000
            value: unitHex, // 2441406250
            // data:
            //   '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
          },
        ],
      });
      console.log(result, '111');
    },

    async eth_sendTransaction1() {
      const unit = ethers.utils.parseEther('0.01');
      const unitHex = ethers.utils.hexValue(unit);

      const response = await myProvider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: window.ethereum.selectedAddress,
            to: window.ethereum.selectedAddress,
            value: unitHex,
          },
        ],
      });
      console.log(response);
      // const result = signer.
      return response;
    },

    async sendTransaction() {
      const ethersProvider = new ethers.providers.Web3Provider(
        window.ethereum,
        'any',
      );

      const unit = ethers.utils.parseEther('0.01');
      const unitHex = ethers.utils.hexValue(unit);

      const signer = ethersProvider.getSigner();
      const result = await signer.sendTransaction({
        to: window.ethereum.selectedAddress,
        value: unitHex,
        gasLimit: 21000,
        gasPrice: 20000000000,
      });
      console.log(result);
    },

    async sendTransaction1() {
      const ethersProvider = new ethers.providers.Web3Provider(
        myProvider,
        'any',
      );
      const unit = ethers.utils.parseEther('0.005');
      const unitHex = ethers.utils.hexValue(unit);

      const signer = ethersProvider.getSigner();
      const result = await signer.sendTransaction({
        to: myProvider.selectedAddress,
        value: unitHex,
        gasLimit: 21000,
        gasPrice: 20000000000,
      });
      console.log(result);
    },

    async eth_sign() {
      const msg =
        '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0';
      const ethResult = await window.ethereum.request({
        method: 'eth_sign',
        params: [window.ethereum.selectedAddress, msg],
      });
      console.log(ethResult);
    },

    async eth_sign1() {
      const msg =
        '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0';
      const ethResult = await myProvider.request({
        method: 'eth_sign',
        params: [myProvider.selectedAddress, msg],
      });
      console.log(ethResult);
    },

    async personal_sign() {
      const exampleMessage = 'Example `personal_sign` message';
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
      const sign = await window.ethereum.request({
        method: 'personal_sign',
        params: [msg, window.ethereum.selectedAddress, 'Example password'],
      });
      console.log(sign);
    },

    async personal_sign1() {
      const exampleMessage = 'Example `personal_sign` message';
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
      const sign = await myProvider.request({
        method: 'personal_sign',
        params: [msg, myProvider.selectedAddress, 'Example password'],
      });
      console.log(sign);
      return sign;
    },

    async personal_ecRecover() {
      const signed = await this.personal_sign1();
      const exampleMessage = 'Example `personal_sign` message';
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;

      const ecRecoverAddr = await window.ethereum.request({
        method: 'personal_ecRecover',
        params: [msg, signed],
      });
      console.log(ecRecoverAddr);
    },
    async personal_ecRecover1() {
      const signed = await this.personal_sign1();
      const exampleMessage = 'Example `personal_sign` message';
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;

      const ecRecoverAddr = await myProvider.request({
        method: 'personal_ecRecover',
        params: [msg, signed],
      });
      console.log(ecRecoverAddr);
    },

    async eth_signTypedData() {
      const msgParams = [
        {
          type: 'string',
          name: 'Message',
          value: 'Hi, Alice!',
        },
        {
          type: 'uint32',
          name: 'A number',
          value: '1337',
        },
      ];
      const sign = await window.ethereum.request({
        method: 'eth_signTypedData',
        params: [msgParams, window.ethereum.selectedAddress],
      });
      console.log(sign);
    },

    async eth_signTypedData1() {
      const msgParams = [
        {
          type: 'string',
          name: 'Message',
          value: 'Hi, Alice!',
        },
        {
          type: 'uint32',
          name: 'A number',
          value: '1337',
        },
      ];
      const sign = await myProvider.request({
        method: 'eth_signTypedData',
        params: [msgParams, myProvider.selectedAddress],
      });
      console.log(sign);
    },

    async eth_signTypedData_v3() {
      const msgParams = {
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' },
          ],
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person' },
            { name: 'contents', type: 'string' },
          ],
        },
        primaryType: 'Mail',
        domain: {
          name: 'Ether Mail',
          version: '1',
          chainId: chainid,
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        },
        message: {
          sender: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
          },
          recipient: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
          },
          contents: 'Hello, Bob!',
        },
      };
      const sign = await window.ethereum.request({
        method: 'eth_signTypedData_v3',
        params: [window.ethereum.selectedAddress, JSON.stringify(msgParams)],
      });
      console.log(sign);
    },

    async eth_signTypedData_v3_1() {
      const msgParams = {
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' },
          ],
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person' },
            { name: 'contents', type: 'string' },
          ],
        },
        primaryType: 'Mail',
        domain: {
          name: 'Ether Mail',
          version: '1',
          chainId: chainid,
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        },
        message: {
          sender: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
          },
          recipient: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
          },
          contents: 'Hello, Bob!',
        },
      };
      const sign = await myProvider.request({
        method: 'eth_signTypedData_v3',
        params: [myProvider.selectedAddress, JSON.stringify(msgParams)],
      });
      console.log(sign);
    },

    async eth_signTypedData_v4() {
      const msgParams = {
        domain: {
          chainId: chainid.toString(),
          name: 'Ether Mail',
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
          version: '1',
        },
        message: {
          contents: 'Hello, Bob!',
          from: {
            name: 'Cow',
            wallets: [
              '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
              '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
            ],
          },
          to: [
            {
              name: 'Bob',
              wallets: [
                '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
                '0xB0B0b0b0b0b0B000000000000000000000000000',
              ],
            },
          ],
        },
        primaryType: 'Mail',
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Group: [
            { name: 'name', type: 'string' },
            { name: 'members', type: 'Person[]' },
          ],
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person[]' },
            { name: 'contents', type: 'string' },
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallets', type: 'address[]' },
          ],
        },
      };
      const sign = await window.ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [window.ethereum.selectedAddress, JSON.stringify(msgParams)],
      });
      console.log(sign);
    },

    async eth_signTypedData_v4_1() {
      const msgParams = {
        domain: {
          chainId: chainid.toString(),
          name: 'Ether Mail',
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
          version: '1',
        },
        message: {
          contents: 'Hello, Bob!',
          from: {
            name: 'Cow',
            wallets: [
              '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
              '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
            ],
          },
          to: [
            {
              name: 'Bob',
              wallets: [
                '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
                '0xB0B0b0b0b0b0B000000000000000000000000000',
              ],
            },
          ],
        },
        primaryType: 'Mail',
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Group: [
            { name: 'name', type: 'string' },
            { name: 'members', type: 'Person[]' },
          ],
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person[]' },
            { name: 'contents', type: 'string' },
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallets', type: 'address[]' },
          ],
        },
      };
      const sign = await myProvider.request({
        method: 'eth_signTypedData_v4',
        params: [myProvider.selectedAddress, JSON.stringify(msgParams)],
      });
      console.log(sign);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

