'use strict';

const assert = require('assert');
const tl = require('vsts-task-lib');
const ttm = require('vsts-task-lib/mock-test');
const path = require('path');

function setResponseFile(name) {
    process.env['MOCK_RESPONSES'] = path.join(__dirname, name);
}

function runValidations(validator: () => void, tr, done) {
    try {
        validator();
        done();
    }
    catch (error) {
        console.log("STDERR", tr.stderr);
        console.log("STDOUT", tr.stdout);
        done(error);
    }
}

describe('DotNetCoreInstaller', function() {
    this.timeout(30000);
    before((done) => {
        done();
    });
    after(function() {
    });

    if(tl.osType().match(/^Win/)) {
        it("[windows]should succeed if sdk installed successfully", (done) => {
            let tp = path.join(__dirname, "InstallWindows.js");
            let tr = new ttm.MockTestRunner(tp);
            tr.run();
            runValidations(() => {
                assert(tr.succeeded, "Should have succeeded");
                assert(tr.stdout.indexOf("loc_mock_ToolToInstall sdk 1.0.4") > -1, "should print to-be-installed info");
                assert(tr.stdout.indexOf("Checking local tool for dncs and version 1.0.4") > -1, "should check for local cached tool");
                assert(tr.stdout.indexOf("loc_mock_InstallingAfresh") > -1, "should install fresh if cache miss");
                assert(tr.stdout.indexOf("Downloading tool from https://primary-url") > -1, "should download from correct url");
                assert(tr.stdout.indexOf("Extracting zip archieve from C:\\agent\\_temp\\someArchieve") > -1, "Should extract downloaded archieve corectly");
                assert(tr.stdout.indexOf("Caching dir C:\\agent\\_temp\\someDir for tool dncs version 1.0.4") > -1, "should cache correctly");
                assert(tr.stdout.indexOf("loc_mock_SuccessfullyInstalled sdk 1.0.4") > -1, "should print installed tool info");
                assert(tr.stdout.indexOf("prepending path: C:\\agent\\_tools\\cacheDir") > -1, "should pre-prend to PATH");
            }, tr, done);
        });

    } else {
    }
});
