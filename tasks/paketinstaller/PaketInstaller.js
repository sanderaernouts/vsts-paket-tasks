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
    constructor(toolLib, logger, resolver) {
        this.cachedToolName = "pkcli";
        this.toolLib = toolLib;
        this.logger = logger;
        this.resolver = resolver;
    }
    run(version) {
        return __awaiter(this, void 0, void 0, function* () {
            this.getPaket(version);
        });
    }
    getPaket(version) {
        return __awaiter(this, void 0, void 0, function* () {
            var downloadUrl = yield this.resolver.resolve(version);
            // check cache
            let toolPath;
            toolPath = this.toolLib.findLocalTool(this.cachedToolName, downloadUrl.version);
            if (!toolPath) {
                this.logger.log(`installing paket.exe`);
                toolPath = yield this.acquirePaket(downloadUrl);
            }
            else {
                this.logger.log(`using cached tool ${toolPath}`);
            }
            // prepend the tools path. instructs the agent to prepend for future tasks
            this.toolLib.prependPath(toolPath);
        });
    }
    acquirePaket(downloadUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            var downloadPath = yield this.toolLib.downloadTool(downloadUrl.url);
            // cache tool
            this.logger.log("caching tool");
            let cachedDir = yield this.toolLib.cacheDir(downloadPath, this.cachedToolName, downloadUrl.version);
            this.logger.log(`successfully installed Paket version ${downloadUrl.version}`);
            return cachedDir;
        });
    }
}
exports.PaketInstaller = PaketInstaller;
