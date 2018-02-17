import { PaketDownloadUrl } from "./PaketDownloadUrl";

export interface IPaketDownloadUrlResolver {
    resolve(versionSpec:string|undefined): Promise<PaketDownloadUrl>;
}