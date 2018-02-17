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
const options_1 = require("../options");
const chai_1 = require("chai");
const TypeMoq = require("typemoq");
const PaketInstaller_1 = require("../PaketInstaller");
const PaketDownloadUrl_1 = require("../PaketDownloadUrl");
'use strict';
const assert = require('assert');
describe('L0', () => {
    describe('PaketInstaller', () => {
        let toolLibMock;
        let loggerMock;
        let resolverMock;
        beforeEach(() => {
            toolLibMock = TypeMoq.Mock.ofType();
            loggerMock = TypeMoq.Mock.ofType();
            resolverMock = TypeMoq.Mock.ofType();
            resolverMock.setup((x) => x.then).returns(() => undefined);
        });
        function create() {
            return new PaketInstaller_1.PaketInstaller(toolLibMock.object, loggerMock.object, resolverMock.object);
        }
        after(() => {
        });
        describe('constructor', function () {
            it('creates an instance when options are passed.', function (done) {
                let installer = create();
                chai_1.expect(installer).to.not.equal(null);
                done();
            });
        });
        describe('run', function () {
            let sut;
            beforeEach(() => {
                sut = create();
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
                    yield sut.run(expectedVersion);
                    //assert
                    toolLibMock.verify(t => t.findLocalTool(TypeMoq.It.isValue(expectedToolName), TypeMoq.It.isValue(expectedVersion)), TypeMoq.Times.once());
                });
            });
            it('does not download tool when requested version is found in local tools cache', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    //arrange
                    toolLibMock.setup(t => t.findLocalTool(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyString())).returns(() => "c:\\some\\fake\\path\\");
                    //act
                    yield sut.run("1.2.3");
                    //assert
                    toolLibMock.verify(t => t.downloadTool(TypeMoq.It.isAnyString()), TypeMoq.Times.never());
                });
            });
            it('downloads tool when requested version is not found in local tools cache', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    //arrange
                    toolLibMock.setup(t => t.findLocalTool(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyString())).returns(() => undefined);
                    resolverMock.setup(r => r.resolve(TypeMoq.It.isAnyString())).returns(() => Promise.resolve(new PaketDownloadUrl_1.PaketDownloadUrl("1.2.3", "")));
                    //act
                    yield sut.run("1.2.3");
                    //assert
                    toolLibMock.verify(t => t.downloadTool(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.once());
                });
            });
        });
    });
});
