"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vue_1 = tslib_1.__importDefault(require("vue"));
var App_vue_1 = tslib_1.__importDefault(require("./App.vue"));
vue_1.default.config.productionTip = false;
new vue_1.default({
    render: function (h) { return h(App_vue_1.default); },
}).$mount('#app');
//# sourceMappingURL=main.js.map