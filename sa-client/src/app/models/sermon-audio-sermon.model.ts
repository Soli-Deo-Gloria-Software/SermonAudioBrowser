import { SermonAudioBroadcaster } from './sermon-audio-broadcaster.model';
import { SermonAudioMediaCollection } from './sermon-audio-media-collection.model';
import { SermonAudioSeries } from './sermon-audio-series.model';
import { SermonAudioSocialSharing } from './sermon-audio-social-sharing.model';
import { SermonAudioSpeaker } from './sermon-audio-speaker.model';

export class SermonAudioSermon {
    archiveWebcastID: number;
    bibleText: string;
    broadCaster: SermonAudioBroadcaster;
    displayEventType: string;
    displayTitle: string;
    documentDownloadCount: number;
    downloadCount: number;
    eventType: string;
    externalLink: string;
    fullTitle: string;
    keywords: string;
    languageCode: string;
    lastFeatureDate: Date;
    media: SermonAudioMediaCollection;
    moreInfoText: string;
    pickDate: Date;
    preachDate: Date;
    publishDate: Date;
    publishTimestamp: number;
    series: SermonAudioSeries;
    sermonID: string;
    socialSharing: SermonAudioSocialSharing;
    speaker: SermonAudioSpeaker;
    subtitle: string;
    type: string;
    updateDate: number;
    videoDownloadCount: number;
    thumbnailImageURL: string;
    waveformPeaksURL: string;
    waveform: number[];
}
