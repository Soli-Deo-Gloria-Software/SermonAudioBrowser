import { SermonAudioBroadcaster } from './sermon-audio-broadcaster.model';
import { SermonAudioMediaCollection } from './sermon-audio-media-collection.model';
import { SermonAudioSeries } from './sermon-audio-series.model';
import { SermonAudioSocialSharing } from './sermon-audio-social-sharing.model';
import { SermonAudioSpeaker } from './sermon-audio-speaker.model';

export class SermonAudioSermon {
    archiveWebcastID: number = 0;
    bibleText: string = '';
    broadCaster: SermonAudioBroadcaster|undefined;
    displayEventType: string = '';
    displayTitle: string = '';
    documentDownloadCount: number = 0;
    downloadCount: number = 0;
    eventType: string = '';
    externalLink: string = '';
    fullTitle: string = '';
    keywords: string = '';
    languageCode: string = '';
    lastFeatureDate: Date = new Date();
    media: SermonAudioMediaCollection|undefined;
    moreInfoText: string = '';
    pickDate: Date = new Date();
    preachDate: Date = new Date();
    publishDate: Date = new Date();
    publishTimestamp: number = 0;
    series: SermonAudioSeries|undefined;
    sermonID: string = '';
    socialSharing: SermonAudioSocialSharing|undefined;
    speaker: SermonAudioSpeaker|undefined;
    subtitle: string = '';
    type: string = '';
    updateDate: number = 0;
    videoDownloadCount: number = 0;
    thumbnailImageURL: string = '';
    waveformPeaksURL: string = '';
    waveform: number[] = [];
}
