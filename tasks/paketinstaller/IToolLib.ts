export interface IToolLib {
    findLocalTool(toolName: string, versionSpec: string, arch?: string): string;
    downloadTool(url: string, fileName?: string): Promise<string>;
}