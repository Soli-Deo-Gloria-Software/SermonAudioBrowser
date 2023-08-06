export class SermonAudioV2ResponseWrapper<T> {
    nodeType: string;
    nodeDisplayName: string;
    results: T[];
    totalCount: number;
    next: string;
}