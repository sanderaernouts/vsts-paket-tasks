export class PaketDownloadUrl {
    constructor (version:string,  url:string) {
        this.version = version;
        this.url = url;
    }

    url:string;
    version:string;
}