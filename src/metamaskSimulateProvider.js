"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initProvider = exports.initProviderOnly = void 0;
var tslib_1 = require("tslib");
var ethers_1 = require("ethers");
var sigUtil = tslib_1.__importStar(require("eth-sig-util"));
var ethUtil = tslib_1.__importStar(require("ethereumjs-util"));
var initProviderOnly = function (rpcUrl, chainid, privateKey, checker) {
    var wallet = new ethers_1.ethers.Wallet(privateKey);
    var getPrivateKey = function () {
        return wallet.privateKey.replace(/^0x/, '');
    };
    var MetamaskSimulateProvider = /** @class */ (function (_super) {
        tslib_1.__extends(MetamaskSimulateProvider, _super);
        function MetamaskSimulateProvider(rpcUrl, chainid) {
            var _this = _super.call(this, rpcUrl, chainid) || this;
            _this.selectedAddress = wallet.address;
            _this.isMetaMask = true;
            _this.enable = function () {
                return this.request({ method: 'eth_requestAccounts' });
            };
            _this.sendAsync = function (payload, callback) {
                var ret = this.request(payload);
                ret
                    .then(function (res) {
                    callback(res);
                })
                    .catch(function (err) {
                    callback(err);
                });
            };
            return _this;
        }
        MetamaskSimulateProvider.prototype.enable = function () {
            return this.request({ method: 'eth_requestAccounts' });
        };
        MetamaskSimulateProvider.prototype.sendAsync = function (payload, callback) {
            var ret = this.request(payload);
            ret
                .then(function (res) {
                callback(res);
            })
                .catch(function (err) {
                callback(err);
            });
        };
        MetamaskSimulateProvider.prototype.send = function (method, params) {
            // console.log({
            //   method
            // }, ...args)
            return _super.prototype.send.call(this, method, params);
        };
        MetamaskSimulateProvider.prototype.request = function (args) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var method, _a, params, response, intxt, jsonStr, parsed, response, payload, res, privKey, pkeyarr, message, msgarr, msgSig, out, rawMsgSig, privKey, pkeyarr, rawMsgSig, rawMsgSig, privKey, pkeyarr, rawMsgSig, privKey, pkeyarr, rawMsgSig, privKey, pkeyarr, rawMsgSig;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            method = args.method, _a = args.params, params = _a === void 0 ? [] : _a;
                            // console.info(args)
                            if (!checker()) {
                                throw new Error('invalid checker, please provide c');
                            }
                            if (method === 'eth_requestAccounts') {
                                return [2 /*return*/, [this.selectedAddress]];
                            }
                            if (method === 'eth_accounts') {
                                return [2 /*return*/, [this.selectedAddress]];
                            }
                            if (method === 'wallet_requestPermissions' ||
                                method === 'wallet_getPermissions') {
                                return [2 /*return*/, [
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
                                    ]];
                            }
                            if (method === 'eth_getEncryptionPublicKey') {
                                response = sigUtil.getEncryptionPublicKey(wallet.privateKey.replace(/^0x/, ''));
                                return [2 /*return*/, response];
                            }
                            if (method === 'eth_decrypt') {
                                intxt = params[0];
                                jsonStr = Buffer.from(intxt.replace(/^0x/, ''), 'hex').toString('utf-8');
                                parsed = JSON.parse(jsonStr);
                                response = sigUtil.decrypt(parsed, getPrivateKey());
                                return [2 /*return*/, response];
                            }
                            if (!(method === 'eth_sendTransaction')) return [3 /*break*/, 2];
                            payload = tslib_1.__assign({}, params[0]);
                            payload.gasLimit = payload.gas;
                            delete payload.gas;
                            return [4 /*yield*/, wallet.sendTransaction(payload)];
                        case 1:
                            res = _b.sent();
                            return [2 /*return*/, res.hash];
                        case 2:
                            if (method === 'eth_sign') {
                                privKey = getPrivateKey();
                                pkeyarr = Buffer.from(privKey, 'hex');
                                message = params[1].replace(/^0x/, '');
                                msgarr = Buffer.from(message, 'hex');
                                msgSig = ethUtil.ecsign(msgarr, pkeyarr);
                                out = sigUtil.concatSig(ethUtil.toBuffer(msgSig.v), ethUtil.toBuffer(msgSig.r), ethUtil.toBuffer(msgSig.s));
                                rawMsgSig = ethUtil.bufferToHex(ethUtil.toBuffer(out));
                                return [2 /*return*/, rawMsgSig];
                            }
                            if (method === 'personal_sign') {
                                privKey = getPrivateKey();
                                pkeyarr = Buffer.from(privKey, 'hex');
                                rawMsgSig = sigUtil.personalSign(pkeyarr, {
                                    data: params[0],
                                });
                                return [2 /*return*/, rawMsgSig];
                            }
                            if (method === 'personal_ecRecover') {
                                rawMsgSig = sigUtil.recoverPersonalSignature({
                                    data: params[0],
                                    sig: params[1],
                                });
                                return [2 /*return*/, rawMsgSig];
                            }
                            if (method === 'eth_signTypedData') {
                                privKey = getPrivateKey();
                                pkeyarr = Buffer.from(privKey, 'hex');
                                rawMsgSig = sigUtil.signTypedDataLegacy(pkeyarr, {
                                    data: params[0],
                                });
                                return [2 /*return*/, rawMsgSig];
                            }
                            if (method === 'eth_signTypedData_v3') {
                                privKey = getPrivateKey();
                                pkeyarr = Buffer.from(privKey, 'hex');
                                rawMsgSig = sigUtil.signTypedData(pkeyarr, {
                                    data: JSON.parse(params[1]),
                                });
                                return [2 /*return*/, rawMsgSig];
                            }
                            if (method === 'eth_signTypedData_v4') {
                                privKey = getPrivateKey();
                                pkeyarr = Buffer.from(privKey, 'hex');
                                rawMsgSig = sigUtil.signTypedData_v4(pkeyarr, {
                                    data: JSON.parse(params[1]),
                                });
                                return [2 /*return*/, rawMsgSig];
                            }
                            return [2 /*return*/, this.send(method, params)];
                    }
                });
            });
        };
        MetamaskSimulateProvider.prototype.isConnected = function () {
            return true;
        };
        return MetamaskSimulateProvider;
    }(ethers_1.ethers.providers.JsonRpcProvider));
    var simProvider = new MetamaskSimulateProvider(rpcUrl, chainid);
    wallet = wallet.connect(simProvider);
    // Object.assign(window, {
    //   ethereum: simProvider,
    // });
    // const event = new CustomEvent('ethereum#initialized', {});
    // window.dispatchEvent(event);
    return simProvider;
};
exports.initProviderOnly = initProviderOnly;
var initProvider = function (rpcUrl, chainid, privateKey, checker) {
    var simProvider = exports.initProviderOnly(rpcUrl, chainid, privateKey, checker);
    Object.assign(window, {
        ethereum: simProvider,
    });
    var event = new CustomEvent('ethereum#initialized', {});
    window.dispatchEvent(event);
    return simProvider;
};
exports.initProvider = initProvider;
//# sourceMappingURL=metamaskSimulateProvider.js.map