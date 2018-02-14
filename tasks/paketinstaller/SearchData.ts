import {PackageVersion} from "./PackageVersion"

export interface SearchData {
    id:string;
    version:string;
    versions:PackageVersion[]
}