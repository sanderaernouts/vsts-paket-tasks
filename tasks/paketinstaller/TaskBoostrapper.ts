import * as taskLib from 'vsts-task-lib/task';
import * as toolLib from 'vsts-task-tool-lib/tool';
import * as trm from 'vsts-task-lib/toolrunner';

import * as os from 'os';
import * as path from 'path';

async function run() {
    let version = taskLib.getInput('version', true).trim();
    console.log("Installing Paket version:" + version);
    
}

var taskManifestPath = path.join(__dirname, "task.json");
taskLib.debug("Setting resource path to " + taskManifestPath);
taskLib.setResourcePath(taskManifestPath);


run().then((result) => {
    taskLib.setResult(taskLib.TaskResult.Succeeded, "Paket installer succeeded")
    }).catch((error) => {
        taskLib.setResult(taskLib.TaskResult.Failed, !!error.message ? error.message : error)
    }
);