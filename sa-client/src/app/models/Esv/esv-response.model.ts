import { EsvPassageMetadata } from "./esv-passage-metadata.model";

export class EsvResponse {
    query: string;
    canonical: string;
    parsed: number[][];
    passage_meta:EsvPassageMetadata[];
    passages: string[];
}
