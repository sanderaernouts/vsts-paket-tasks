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
const paketInstaller_1 = require("../paketInstaller");
const options_1 = require("../options");
const chai_1 = require("chai");
const TypeMoq = require("typemoq");
'use strict';
const assert = require('assert');
describe('L0', () => {
    describe('PaketInstaller', () => {
        let toolLibMock;
        let loggerMock;
        beforeEach(() => {
            toolLibMock = TypeMoq.Mock.ofType();
            loggerMock = TypeMoq.Mock.ofType();
        });
        after(() => {
        });
        describe('constructor', function () {
            it('creates an instance when options are passed.', function (done) {
                let installer = new paketInstaller_1.PaketInstaller(toolLibMock.object, loggerMock.object);
                chai_1.expect(installer).to.not.equal(null);
                done();
            });
        });
        describe('run', function () {
            let sut;
            let defaultOptions;
            beforeEach(() => {
                defaultOptions = new options_1.Options("", "");
                sut = new paketInstaller_1.PaketInstaller(toolLibMock.object, loggerMock.object);
            });
            after(() => {
            });
            it('checks local tools cache for requested version', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    //arrange
                    let expectedVersion = "3.5.6";
                    let expectedToolName = "pkcli";
                    let options = new options_1.Options(expectedVersion, "");
                    //act
                    yield sut.run(options);
                    //assert
                    toolLibMock.verify(t => t.findLocalTool(TypeMoq.It.isValue(expectedToolName), TypeMoq.It.isValue(expectedVersion)), TypeMoq.Times.once());
                });
            });
            it('does not download tool when requested version is found in local tools cache', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    //arrange
                    toolLibMock.setup(t => t.findLocalTool(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyString())).returns(() => "c:\\some\\fake\\path\\");
                    //act
                    yield sut.run(defaultOptions);
                    //assert
                    toolLibMock.verify(t => t.downloadTool(TypeMoq.It.isAnyString()), TypeMoq.Times.never());
                });
            });
            it('downloads tool when requested version is not found in local tools cache', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    //arrange
                    //act
                    yield sut.run(defaultOptions);
                    //assert
                    toolLibMock.verify(t => t.downloadTool(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.once());
                });
            });
        });
    });
});
