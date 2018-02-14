import { Options } from "./Options";
import { IToolLib } from "./IToolLib";
import { ILogger } from "./ILogger"

export class PaketInstaller {
    private cachedToolName:string = "pkcli";
    private toolLib:IToolLib;
    private logger:ILogger;
    
    constructor(toolLib: IToolLib, logger:ILogger) {
        this.toolLib = toolLib;
        this.logger = logger;
    }

    public async run(options: Options) {
        return new Promise((resolve, reject) => {
            let localTool = this.toolLib.findLocalTool(this.cachedToolName, options.version);

            if(!localTool) {
                this.toolLib.downloadTool("bla");
            }

            resolve();
        });
    }
}