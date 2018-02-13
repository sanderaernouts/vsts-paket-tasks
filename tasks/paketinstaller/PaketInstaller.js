"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class PaketInstaller {
    constructor(toolLib, logger) {
        this.cachedToolName = "pkcli";
        this.toolLib = toolLib;
        this.logger = logger;
    }
    run(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let localTool = this.toolLib.findLocalTool(this.cachedToolName, options.version);
                if (!localTool) {
                    debugger;
                    this.toolLib.downloadTool("bla");
                }
                resolve();
            });
        });
    }
}
exports.PaketInstaller = PaketInstaller;
