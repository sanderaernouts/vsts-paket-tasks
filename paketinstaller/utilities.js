"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
function getCurrentDir() {
    return __dirname;
}
exports.getCurrentDir = getCurrentDir;
function setFileAttribute(file, mode) {
    fs_1.chmodSync(file, mode);
}
exports.setFileAttribute = setFileAttribute;
