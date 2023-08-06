export class SermonAudioSermonRequest {
    book:string;
    chapter: number;
    chapterEnd: number;
    verse: number;
    verseEnd: number;
    eventType: string;
    languageCode: string;
    requireAudo: boolean;
    requireVideo: boolean;
    includeDrafts:boolean;
    includeScheduled: boolean;
    includePublished: boolean;
    series: string;
    broadcasterID: string;
    speakerName: string;
    staffPick: boolean;
    year: number;
    sortBy: string;
    page: number;
    searchKeyword: string;
}
