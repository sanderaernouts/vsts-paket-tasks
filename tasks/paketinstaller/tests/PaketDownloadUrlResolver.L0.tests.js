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
const PaketDownloadUrl_1 = require("../PaketDownloadUrl");
const chai_1 = require("chai");
const TypeMoq = require("typemoq");
'use strict';
const assert = require('assert');
describe('L0', () => {
    let noVersion = undefined;
    let httpMock;
    let getResponseMock;
    function mockDefaultResponseForGet() {
        mockResponseForGet("fake");
    }
    function mockResponseForGet(version) {
        mockResponseWithStatusCodeForGet(version, 200);
    }
    function mockResponseWithStatusCodeForGet(version, statusCode) {
        getResponseMock.setup(x => x.readBody()).returns(() => Promise.resolve(`{"tag_name":"${version}"}`));
        let messageMock = TypeMoq.Mock.ofType();
        messageMock.setup(x => x.statusCode).returns(() => statusCode);
        getResponseMock.setup(x => x.message).returns(() => messageMock.object);
    }
    beforeEach(() => {
        httpMock = TypeMoq.Mock.ofType();
        getResponseMock = TypeMoq.Mock.ofType();
        //required to mock promises with TypeMoq
        getResponseMock.setup((x) => x.then).returns(() => undefined);
        httpMock.setup(mock => mock.get(TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.resolve(getResponseMock.object));
    });
    describe('PaketDownloadUrl', () => {
        describe('constructor', function () {
            it('creates an instance when http is passed.', function (done) {
                //arrange
                //act
                let url = new PaketDownloadUrl_1.PaketDownloadUrl(httpMock.object);
                //assert
                chai_1.expect(url).to.not.equal(null);
                done();
            });
        });
        describe('resolve', function () {
            let sut;
            beforeEach(() => {
                sut = new PaketDownloadUrl_1.PaketDownloadUrl(httpMock.object);
            });
            describe("when no version is supplied", function () {
                it('uses Paket github repository to resolve latest version', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        //arrange
                        mockDefaultResponseForGet();
                        let expectedUrl = "https://github.com/fsprojects/Paket/releases/latest";
                        //act
                        yield sut.resolve(noVersion);
                        //assert
                        httpMock.verify(mock => mock.get(TypeMoq.It.isValue(expectedUrl), TypeMoq.It.isAny()), TypeMoq.Times.once());
                    });
                });
                it('requests JSON from Paket github repository', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        //arrange
                        mockDefaultResponseForGet();
                        let expectedUrl = "https://github.com/fsprojects/Paket/releases/latest";
                        let expectedHeaders = {
                            accept: "application/json"
                        };
                        //act
                        yield sut.resolve(noVersion);
                        //assert
                        httpMock.verify(mock => mock.get(TypeMoq.It.isValue(expectedUrl), TypeMoq.It.isValue(expectedHeaders)), TypeMoq.Times.once());
                    });
                });
                /*
                Note that HTTP codes 1xx are acceptable as well but https://httpstat.us keeps returning the same 1xx code which leads the request to time out.
                In a real world situation an endpoint would at some point return a different HTTP status code.
                */
                let acceptableHttpStatusCodes = [200, 201, 202, 203, 204, 205, 206, 300, 301, 302, 303, 304, 305, 306, 307, 308];
                for (let statusCode of acceptableHttpStatusCodes) {
                    it('accepts HTTP status code ' + statusCode, function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                try {
                                    //arange
                                    mockResponseWithStatusCodeForGet(noVersion, statusCode);
                                    //act
                                    yield sut.resolve(noVersion);
                                    //assert
                                    resolve();
                                }
                                catch (err) {
                                    //assert                
                                    reject(err);
                                }
                            }));
                        });
                    });
                }
                let httpErrorCodes = [400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 422, 428, 429, 431, 451, 500, 501, 502, 503, 504, 505, 511, 520, 522, 524];
                for (let errorCode of httpErrorCodes) {
                    it('throws error on HTTP status code ' + errorCode, function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                try {
                                    //arange
                                    mockResponseWithStatusCodeForGet(noVersion, errorCode);
                                    //act
                                    yield sut.resolve(noVersion);
                                    //assert
                                    reject('an error was expected but it was not thrown');
                                }
                                catch (err) {
                                    //assert                
                                    resolve();
                                }
                            }));
                        });
                    });
                }
            });
            describe("when version is supplied", function () {
                it('does not use Paket github repository to resolve latest version when version is supplied', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        //arrange
                        //act
                        yield sut.resolve("1.2.3");
                        //assert
                        httpMock.verify(mock => mock.get(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
                    });
                });
                it('returns download URL for the supplied version of paket.exe when version is supplied', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        //arrange
                        let expectedVersion = "4.8.23";
                        let expectedDownloadUrl = `https://github.com/fsprojects/Paket/download/${expectedVersion}/paket.exe`;
                        //act
                        let actualDownloadUrl = yield sut.resolve(expectedVersion);
                        //assert
                        chai_1.expect(actualDownloadUrl).to.equal(expectedDownloadUrl);
                    });
                });
                it('returns download URL for the latest version of paket.exe when no version is supplied', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        //arrange
                        let expectedVersion = "4.8.23";
                        let expectedDownloadUrl = `https://github.com/fsprojects/Paket/download/${expectedVersion}/paket.exe`;
                        mockResponseForGet(expectedVersion);
                        getResponseMock.setup(x => x.readBody()).returns(() => Promise.resolve(`{"tag_name":"${expectedVersion}"}`));
                        //act
                        let actualDownloadUrl = yield sut.resolve(noVersion);
                        //assert
                        chai_1.expect(actualDownloadUrl).to.equal(expectedDownloadUrl);
                    });
                });
            });
        });
    });
});
