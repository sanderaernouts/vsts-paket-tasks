export interface IPaketDownloadUrl {
    resolve(versionSpec:string|undefined): Promise<string>;
}