import * as ifm from "typed-rest-client/Interfaces";
import * as httpm from "typed-rest-client/HttpClient";
import { IPaketDownloadUrlResolver } from "./IPaketDownloadUrlResolver";
import { PaketDownloadUrl } from './PaketDownloadUrl';

export class PaketDownloadUrlResolver implements IPaketDownloadUrlResolver {
  private repositoryUrl: string = "https://github.com/fsprojects/Paket";
  private latestPath: string = "releases/latest";
  private http: ifm.IHttpClient;

  constructor(http: ifm.IHttpClient) {
    this.http = http;
  }

  async resolve(versionSpec: string | undefined): Promise<PaketDownloadUrl> {
    let version: string;

    if (!versionSpec) {
      version = await this.getLatestVersion();
    } else {
      version = versionSpec;
    }
    var url = `${this.repositoryUrl}/download/${version}/paket.exe`;
    return new PaketDownloadUrl(version, url);
  }

  private async getLatestVersion(): Promise<string> {
    let headers = {
      accept: "application/json"
    } as ifm.IHeaders;

    let url = `${this.repositoryUrl}/releases/latest`;
    let response: httpm.HttpClientResponse = await this.http.get(url, headers);

    if (!response.message.statusCode || response.message.statusCode >= 400) {
      throw Error(
        `Failed to get latest version information for Paket from "${url}". Code(${
          response.message.statusCode
        }) Message(${response.message.statusMessage})`
      );
    }

    let body: string = await response.readBody();
    let obj: any = JSON.parse(body);

    return obj.tag_name;
  }
}
