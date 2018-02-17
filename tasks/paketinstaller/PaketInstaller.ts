import { Options } from "./Options";
import { IToolLib } from "./IToolLib";
import { ILogger } from "./ILogger"
import { PaketDownloadUrl } from './PaketDownloadUrl';
import { IPaketDownloadUrlResolver } from "./IPaketDownloadUrlResolver";
import { Logger } from './Logger';
import { PackageVersion } from './PackageVersion';

export class PaketInstaller {
    private cachedToolName:string = "pkcli";
    private toolLib:IToolLib;
    private logger:ILogger;
    private resolver:IPaketDownloadUrlResolver;
    
    constructor(toolLib: IToolLib, logger:ILogger, resolver:IPaketDownloadUrlResolver) {
        this.toolLib = toolLib;
        this.logger = logger;
        this.resolver = resolver;
    }

    public async run(version:string) {
        this.getPaket(version);
    }

    private async getPaket(version:string|undefined): Promise<void> {
        var downloadUrl = await this.resolver.resolve(version);

        // check cache
        let toolPath: string|undefined;
        toolPath = this.toolLib.findLocalTool(this.cachedToolName, downloadUrl.version);


        if (!toolPath) {
            this.logger.log(`installing paket.exe`)
            toolPath = await this.acquirePaket(downloadUrl);
        }else{
            this.logger.log(`using cached tool ${toolPath}`);
        }

        // prepend the tools path. instructs the agent to prepend for future tasks
        this.toolLib.prependPath(toolPath);
    }

    private async acquirePaket(downloadUrl:PaketDownloadUrl): Promise<string> {
        var downloadPath = await this.toolLib.downloadTool(downloadUrl.url);

        // cache tool
        this.logger.log("caching tool");
        let cachedDir =  await this.toolLib.cacheDir(downloadPath, this.cachedToolName, downloadUrl.version);
        this.logger.log(`successfully installed Paket version ${downloadUrl.version}`);
        return cachedDir;
    }
}