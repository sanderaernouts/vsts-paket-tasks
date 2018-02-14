import { PaketInstaller } from "../paketInstaller";
import { Options } from "../options";

import { IToolLib } from "../IToolLib";
import { ILogger } from "../ILogger";

import { expect } from 'chai';
import * as TypeMoq from "typemoq";


'use strict';

const assert = require('assert');

describe('L0', () => {
    describe('PaketInstaller', () => {
        let toolLibMock:TypeMoq.IMock<IToolLib>;
        let loggerMock:TypeMoq.IMock<ILogger>;


        beforeEach(() => {
            toolLibMock = TypeMoq.Mock.ofType<IToolLib>();
            loggerMock = TypeMoq.Mock.ofType<ILogger>();
        });

        after(() => {

        });

        describe ('constructor', function() {
            it('creates an instance when options are passed.', function(done: MochaDone) {
                let installer = new PaketInstaller(toolLibMock.object, loggerMock.object);
                
                expect(installer).to.not.equal(null);

                done();
            });  
        });

        describe('run', function () {
            
            let sut:PaketInstaller;
            let defaultOptions:Options;

            beforeEach(() => {
                defaultOptions = new Options("", "");
                sut = new PaketInstaller(toolLibMock.object, loggerMock.object)
            });

            after(() => {

            });

            it('checks local tools cache for requested version', async function() {
                //arrange
                let expectedVersion = "3.5.6"
                let expectedToolName = "pkcli"
                let options = new Options(expectedVersion, "");

                //act
                await sut.run(options);

                //assert
                toolLibMock.verify(t => t.findLocalTool(TypeMoq.It.isValue(expectedToolName), TypeMoq.It.isValue(expectedVersion)), TypeMoq.Times.once());
            });

            it('does not download tool when requested version is found in local tools cache', async function() {
                //arrange
                toolLibMock.setup(t => t.findLocalTool(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyString())).returns(() => "c:\\some\\fake\\path\\");

                //act
                await sut.run(defaultOptions);

                //assert
                toolLibMock.verify(t => t.downloadTool(TypeMoq.It.isAnyString()), TypeMoq.Times.never());
            });

            it('downloads tool when requested version is not found in local tools cache', async function() {
                //arrange

                //act
                await sut.run(defaultOptions);

                //assert
                toolLibMock.verify(t => t.downloadTool(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.once());
            });
        })
    });
});