import * as taskLib from 'vsts-task-lib/task';
import * as toolLib from 'vsts-task-tool-lib/tool';
import * as trm from 'vsts-task-lib/toolrunner';

async function run() {
    let version = taskLib.getInput('version', true).trim();
    console.log(taskLib.loc("ToolToInstall Paket", version));
}

run()