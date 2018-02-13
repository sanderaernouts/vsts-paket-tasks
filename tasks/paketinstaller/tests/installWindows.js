"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmrm = require("vsts-task-lib/mock-run");
const path = require("path");
const os = require("os");
let taskPath = path.join(__dirname, '..', 'paketinstaller.js');
let tr = new tmrm.TaskMockRunner(taskPath);
tr.setInput("version", "1.0.4");
process.env["AGENT_TOOLSDIRECTORY"] = "C:\\agent\\_tools";
process.env["AGENT_TEMPDIRECTORY"] = "C:\\agent\\_temp";
let a = {
    "exec": {
        "C:\\somedir\\powershell.exe -NoLogo -Sta -NoProfile -NonInteractive -ExecutionPolicy Unrestricted -Command & 'C:\\currDir\\externals\\install-dotnet.ps1' -Version 1.0.4 -DryRun": {
            "code": 0,
            "stdout": "",
            "stderr": ""
        },
        "C:\\somedir\\powershell.exe -NoLogo -Sta -NoProfile -NonInteractive -ExecutionPolicy Unrestricted -Command & 'C:\\currDir\\externals\\install-dotnet.ps1' -Version 1.0.4 -DryRun -SharedRuntime": {
            "code": 0,
            "stdout": "dotnet-install: Payload URLs:" + os.EOL + "dotnet-install: Primary - https://primary-runtime-url" + os.EOL + "dotnet-install: Legacy - https://legacy-runtime-url" + os.EOL + "dotnet-install: Repeatable invocation: .\install-dotnet.ps1 -Version 1.1.2 -Channel 1.1 -Architecture x64 -InstallDir <auto>"
        }
    },
    "osType": {
        "osType": "Windows_NT"
    },
    "which": {
        "powershell": "C:\\somedir\\powershell.exe"
    },
    "checkPath": {
        "C:\\somedir\\powershell.exe": true
    }
};
/*
var ut = require('../utilities');
tr.registerMock('./utilities', {
    getCurrentDir : function() {
        return "C:\\currDir";
    },
    setFileAttribute: ut.setFileAttribute
});
*/
process.env["MOCK_NORMALIZE_SLASHES"] = "true";
tr.setAnswers(a);
tr.registerMock('vsts-task-lib/toolrunner', require('vsts-task-lib/mock-toolrunner'));
//tr.registerMock('vsts-task-tool-lib/tool', require('./mock_node_modules/tool'));
tr.run();
