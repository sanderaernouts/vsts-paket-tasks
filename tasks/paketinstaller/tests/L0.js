"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paketInstaller_1 = require("../paketInstaller");
const options_1 = require("../options");
const chai_1 = require("chai");
'use strict';
const assert = require('assert');
describe('Sample task tests', function () {
    before(() => {
    });
    after(() => {
    });
    it('should succeed with simple inputs', (done) => {
        let options = new options_1.Options("", "");
        let installer = new paketInstaller_1.PaketInstaller(options);
        chai_1.expect(installer).to.be.null;
        done();
    });
});
