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
class PaketDownloadUrl {
    constructor(http) {
        this.repositoryUrl = "https://github.com/fsprojects/Paket";
        this.latestPath = "releases/latest";
        this.http = http;
    }
    resolve(versionSpec) {
        return __awaiter(this, void 0, void 0, function* () {
            let version;
            if (!versionSpec) {
                version = yield this.getLatestVersion();
            }
            else {
                version = versionSpec;
            }
            return `${this.repositoryUrl}/download/${version}/paket.exe`;
        });
    }
    getLatestVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            let headers = {
                accept: "application/json"
            };
            let url = `${this.repositoryUrl}/releases/latest`;
            let response = yield this.http.get(url, headers);
            if (!response.message.statusCode || response.message.statusCode >= 400) {
                throw Error(`Failed to get latest version information for Paket from "${url}". Code(${response.message.statusCode}) Message(${response.message.statusMessage})`);
            }
            let body = yield response.readBody();
            let obj = JSON.parse(body);
            return obj.tag_name;
        });
    }
}
exports.PaketDownloadUrl = PaketDownloadUrl;
