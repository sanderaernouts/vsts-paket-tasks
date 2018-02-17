import { PaketDownloadUrl } from "../PaketDownloadUrl";
import * as ifm from 'typed-rest-client/Interfaces';
import http = require("http");

import { expect } from 'chai';
import * as TypeMoq from "typemoq";
import { debug } from "util";
import { PaketDownloadUrlResolver } from '../PaketDownloadUrlResolver';


'use strict';

const assert = require('assert');

describe('L0', () => {
    let noVersion:string|undefined = undefined;
    let httpMock:TypeMoq.IMock<ifm.IHttpClient>;
    let getResponseMock:TypeMoq.IMock<ifm.IHttpClientResponse>;

    function mockDefaultResponseForGet() {
        mockResponseForGet("fake");
    }

    function mockResponseForGet(version:string|undefined) {
        mockResponseWithStatusCodeForGet(version, 200);
    }

    function mockResponseWithStatusCodeForGet(version:string|undefined, statusCode:number) {
        getResponseMock.setup(x => x.readBody()).returns(() => Promise.resolve(`{"tag_name":"${version}"}`));

        let messageMock:TypeMoq.IMock<http.IncomingMessage> = TypeMoq.Mock.ofType<http.IncomingMessage>();

        messageMock.setup(x => x.statusCode).returns(() => statusCode);
        getResponseMock.setup(x => x.message).returns(() => messageMock.object);
    }

    beforeEach(() => {
        httpMock = TypeMoq.Mock.ofType<ifm.IHttpClient>();
        getResponseMock = TypeMoq.Mock.ofType<ifm.IHttpClientResponse>();
        
        //required to mock promises with TypeMoq
        getResponseMock.setup((x: any) => x.then).returns(() => undefined);

        httpMock.setup(mock => mock.get(TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.resolve(getResponseMock.object));
    });

    describe('PaketDownloadUrl', () => {
        describe ('constructor', function() {
            it('creates an instance when http is passed.', function(done: MochaDone) {
                //arrange
                //act
                let url = new PaketDownloadUrlResolver(httpMock.object)

                //assert
                expect(url).to.not.equal(null);
                done();
            });  
        });

        describe ('resolve', function() {
            let sut:PaketDownloadUrlResolver;

            beforeEach(() =>  {
                sut = new PaketDownloadUrlResolver(httpMock.object)
            });

            describe("when no version is supplied", function() {
                it('uses Paket github repository to resolve latest version', async function() {
                    //arrange
                    mockDefaultResponseForGet();
                    let expectedUrl:string = "https://github.com/fsprojects/Paket/releases/latest";
                    
                    //act
                    await sut.resolve(noVersion);
    
                    //assert
                    httpMock.verify(mock => mock.get(TypeMoq.It.isValue(expectedUrl), TypeMoq.It.isAny()), TypeMoq.Times.once());
                }); 
    
                it('requests JSON from Paket github repository', async function() {
                    //arrange
                    mockDefaultResponseForGet();
                    let expectedUrl:string = "https://github.com/fsprojects/Paket/releases/latest";
                    let expectedHeaders = {
                        accept: "application/json"
                    } as ifm.IHeaders;
                    //act
                    await sut.resolve(noVersion);
    
                    //assert
                    httpMock.verify(mock => mock.get(TypeMoq.It.isValue(expectedUrl), TypeMoq.It.isValue(expectedHeaders)), TypeMoq.Times.once());
                }); 

                /*
                Note that HTTP codes 1xx are acceptable as well but https://httpstat.us keeps returning the same 1xx code which leads the request to time out. 
                In a real world situation an endpoint would at some point return a different HTTP status code.
                */
                let acceptableHttpStatusCodes:number[] = [200,201,202,203,204,205,206,300,301,302,303,304,305,306,307,308];
                for (let statusCode of acceptableHttpStatusCodes) {
                    it('accepts HTTP status code ' + statusCode, async function() {
                        return new Promise<void>(async(resolve, reject)=> {
                            try {
                                //arange
                                mockResponseWithStatusCodeForGet(noVersion, statusCode);

                                //act
                                await sut.resolve(noVersion);
                                
                                //assert
                                resolve();
                            } 
                            catch (err){

                                //assert                
                                reject(err);
                            }
                        });
                    });
                }

                let httpErrorCodes:number[] = [400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,422,428,429,431,451,500,501,502,503,504,505,511,520,522,524];
                for (let errorCode of httpErrorCodes) {
                    it('throws error on HTTP status code ' + errorCode, async function() {

                        return new Promise<void>(async(resolve, reject)=> {
                            try {
                                //arange
                                mockResponseWithStatusCodeForGet(noVersion, errorCode);

                                //act
                                await sut.resolve(noVersion);
                                
                                //assert
                                reject('an error was expected but it was not thrown');
                            } 
                            catch (err){

                                //assert                
                                resolve();
                            }
                        });
                    });
                }
            });

            describe("when version is supplied", function() {

                it('does not use Paket github repository to resolve latest version when version is supplied', async function() {
                    //arrange

                    //act
                    await sut.resolve("1.2.3");

                    //assert
                    httpMock.verify(mock => mock.get(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
                }); 
                
                it('returns download URL for the supplied version of paket.exe when version is supplied', async function() {
                    //arrange
                    let expectedVersion = "4.8.23";
                    let expectedDownloadUrl = `https://github.com/fsprojects/Paket/download/${expectedVersion}/paket.exe`;
                    
                    //act
                    let actualDownloadUrl = await sut.resolve(expectedVersion);

                    //assert
                    expect(actualDownloadUrl.url).to.equal(expectedDownloadUrl);
                }); 

                it('returns download URL for the latest version of paket.exe when no version is supplied', async function() {
                    //arrange
                    let expectedVersion = "4.8.23";
                    let expectedDownloadUrl = `https://github.com/fsprojects/Paket/download/${expectedVersion}/paket.exe`

                    mockResponseForGet(expectedVersion);

                    getResponseMock.setup(x => x.readBody()).returns(() => Promise.resolve(`{"tag_name":"${expectedVersion}"}`));
                    //act
                    let actualDownloadUrl = await sut.resolve(noVersion);

                    //assert
                    expect(actualDownloadUrl.url).to.equal(expectedDownloadUrl);
                }); 
            });
        });
    });
});