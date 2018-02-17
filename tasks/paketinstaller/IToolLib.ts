export interface IToolLib {
    findLocalTool(toolName: string, versionSpec: string, arch?: string): string|undefined;
    downloadTool(url: string, fileName?: string): Promise<string>;
    cacheDir(sourceDir: string, tool: string, version: string, arch?: string): Promise<string>;
    prependPath(toolPath: string):void;
}