export class SermonAudioSermonRequest {
    book:string = '';
    chapter: number = 0;
    chapterEnd: number = 0;
    verse: number = 0;
    verseEnd: number  = 0;
    eventType: string  = '';
    languageCode: string  = '';
    requireAudo: boolean  = false;
    requireVideo: boolean  = false;
    includeDrafts:boolean  = false;
    includeScheduled: boolean  = false;
    includePublished: boolean  = false;
    series: string  = '';
    broadcasterID: string  = '';
    speakerName: string  = '';
    staffPick: boolean  = false;
    year: number  = 0;
    sortBy: string  = '';
    page: number  = 0;
    searchKeyword: string  = '';
}
