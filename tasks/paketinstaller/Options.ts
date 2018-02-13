export class Options {
    version: string;
    targetDirectory:string
    constructor(version: string, targetDirectory:string) {
        this.version = version;
        this.targetDirectory = targetDirectory;
    }
}