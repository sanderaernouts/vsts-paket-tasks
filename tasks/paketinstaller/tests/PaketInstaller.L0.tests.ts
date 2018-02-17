import { Options } from "../options";

import { IToolLib } from "../IToolLib";
import { ILogger } from "../ILogger";

import { expect } from 'chai';
import * as TypeMoq from "typemoq";
import { IPaketDownloadUrlResolver } from '../IPaketDownloadUrlResolver';
import { PaketInstaller } from '../PaketInstaller';
import { PaketDownloadUrlResolver } from '../PaketDownloadUrlResolver';
import { PaketDownloadUrl } from '../PaketDownloadUrl';


'use strict';

const assert = require('assert');

describe('L0', () => {
    describe('PaketInstaller', () => {
        let toolLibMock:TypeMoq.IMock<IToolLib>;
        let loggerMock:TypeMoq.IMock<ILogger>;
        let resolverMock:TypeMoq.IMock<IPaketDownloadUrlResolver>;


        beforeEach(() => {
            toolLibMock = TypeMoq.Mock.ofType<IToolLib>();
            loggerMock = TypeMoq.Mock.ofType<ILogger>();
            resolverMock = TypeMoq.Mock.ofType<IPaketDownloadUrlResolver>();

            resolverMock.setup((x: any) => x.then).returns(() => undefined);
        });

        function create():PaketInstaller {
            return new PaketInstaller(toolLibMock.object, loggerMock.object, resolverMock.object);
        }

        after(() => {

        });

        describe ('constructor', function() {
            it('creates an instance when options are passed.', function(done: MochaDone) {
                let installer = create();
                
                expect(installer).to.not.equal(null);

                done();
            });  
        });

        describe('run', function () {
            
            let sut:PaketInstaller;

            beforeEach(() => {
                sut = create();
            });

            after(() => {

            });

            it('checks local tools cache for requested version', async function() {
                //arrange
                let expectedVersion = "3.5.6"
                let expectedToolName = "pkcli"
                let options = new Options(expectedVersion, "");

                //act
                await sut.run(expectedVersion);

                //assert
                toolLibMock.verify(t => t.findLocalTool(TypeMoq.It.isValue(expectedToolName), TypeMoq.It.isValue(expectedVersion)), TypeMoq.Times.once());
            });

            it('does not download tool when requested version is found in local tools cache', async function() {
                //arrange
                toolLibMock.setup(t => t.findLocalTool(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyString())).returns(() => "c:\\some\\fake\\path\\");

                //act
                await sut.run("1.2.3");

                //assert
                toolLibMock.verify(t => t.downloadTool(TypeMoq.It.isAnyString()), TypeMoq.Times.never());
            });

            it('downloads tool when requested version is not found in local tools cache', async function() {
                //arrange
                toolLibMock.setup(t => t.findLocalTool(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyString())).returns(() => undefined);
                resolverMock.setup(r => r.resolve(TypeMoq.It.isAnyString())).returns(() => Promise.resolve(new PaketDownloadUrl("1.2.3", "")));

                //act
                await sut.run("1.2.3");

                //assert
                toolLibMock.verify(t => t.downloadTool(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.once());
            });
        })
    });
});