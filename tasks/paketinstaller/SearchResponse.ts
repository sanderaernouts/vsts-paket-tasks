import {SearchData} from "./SearchData";

export interface SearchResponse {
    totalHits: number;
    data:SearchData[];
}