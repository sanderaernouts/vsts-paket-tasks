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
const taskLib = require("vsts-task-lib/task");
const path = require("path");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let version = taskLib.getInput('version', true).trim();
        console.log("Installing Paket version:" + version);
    });
}
var taskManifestPath = path.join(__dirname, "task.json");
taskLib.debug("Setting resource path to " + taskManifestPath);
taskLib.setResourcePath(taskManifestPath);
run().then((result) => {
    taskLib.setResult(taskLib.TaskResult.Succeeded, "Paket installer succeeded");
}).catch((error) => {
    taskLib.setResult(taskLib.TaskResult.Failed, !!error.message ? error.message : error);
});
