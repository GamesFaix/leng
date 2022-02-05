import { Card, Color } from 'scryfall-api';
import { orderBy, uniqBy } from 'lodash';
import { ColorFilterRule } from '../components/collection-page/color-rule-selector';
import { ColorFilter } from '../components/collection-page/color-selector';

export enum AsyncRequestStatus {
    NotStarted = 'NOT_STARTED',
    Started = 'STARTED',
    Success = 'SUCCESS',
    Failure = 'FAILURE'
}

export type NotStartedAsyncRequest = {
    status: AsyncRequestStatus.NotStarted
}

export type StartedAsyncRequest<T> = {
    status: AsyncRequestStatus.Started,
    data: T
}

export type SuccessfulAsyncRequest<T> = {
    status: AsyncRequestStatus.Success,
    data: T
}

export type FailedAsyncRequest = {
    status: AsyncRequestStatus.Failure,
    error: string
}

export type AsyncRequest<TBody, TResult> =
    NotStartedAsyncRequest |
    StartedAsyncRequest<TBody> |
    SuccessfulAsyncRequest<TResult> |
    FailedAsyncRequest

export const asyncRequest = {
    notStarted() : NotStartedAsyncRequest {
        return { status: AsyncRequestStatus.NotStarted };
    },
    started<T>(data: T) : StartedAsyncRequest<T> {
        return {
            status: AsyncRequestStatus.Started,
            data
        };
    },
    success<T>(data: T) : SuccessfulAsyncRequest<T> {
        return {
            status: AsyncRequestStatus.Success,
            data
        };
    },
    failure(error: string) : FailedAsyncRequest {
        return {
            status: AsyncRequestStatus.Failure,
            error
        };
    }
}

export enum Language {
    English = 'English',
    ChineseSimplified = 'ChineseSimplified',
    ChineseTraditional = 'ChineseTraditional',
    French = 'French',
    German = 'German',
    Italian = 'Italian',
    Japanese = 'Japanese',
    Korean = 'Korean',
    Portuguese = 'Portuguese',
    Russian = 'Russian',
    Spanish = 'Spanish'
}

export const AllLanguages = [
    Language.English,
    Language.ChineseSimplified,
    Language.ChineseTraditional,
    Language.French,
    Language.German,
    Language.Italian,
    Language.Japanese,
    Language.Korean,
    Language.Portuguese,
    Language.Russian,
    Language.Spanish
];

export type FileBoxCard = {
    scryfallId: string,
    name: string,
    setAbbrev: string,
    collectorsNumber: string,
    lang: Language | null,
    foil: boolean,
    count: number,
}

export type FileBox = {
    name: string,
    lastModified: Date,
    description: string,
    cards: FileBoxCard[]
}

/* Represents the number of copies of a given printing of a card in a box. */
export type BoxCard = {
    scryfallId: string,
    name: string,
    setAbbrev: string,
    collectorsNumber: string,
    lang: Language,
    foil: boolean,
    count: number,
    setName: string,
    color: Color[],
    colorIdentity: Color[],
    versionLabel: string,
    normalizedName: string
}

/* A group of cards in a collection, saved in a single box file. (It could represent a binder, bulk box, deck, etc.) */
export type Box = {
    name: string,
    lastModified: Date,
    description: string,
    cards: BoxCard[]
}

/* Basic info about a box file on disk. */
export type BoxInfo = {
    name: string
    lastModified: Date
}

export type SetInfo = {
    name: string,
    normalizedName: string,
    abbrev: string
}

export function normalizeName(name: string) : string {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, " ");
}

export function getVersionLabel(card: Card) : string {
    const numberStr = `#${card.collector_number}`;

    let frameEffectsStr = "";
    if (card.frame_effects?.includes("showcase")) {
        frameEffectsStr += " Showcase";
    }
    if (card.frame_effects?.includes("extendedart")){
        frameEffectsStr += " Extended Art"
    }

    return `${numberStr}${frameEffectsStr}`;
}

export const CardModule = {
    toSetInfo(card: Card) : SetInfo {
        return {
            name: card.set_name,
            abbrev: card.set,
            normalizedName: normalizeName(card.set_name)
        };
    },

    toSetInfos(cards: Card[]) : SetInfo[] {
        const oneCardPerSet = uniqBy(cards, c => c.set);
        const setInfos = oneCardPerSet.map(CardModule.toSetInfo);
        return orderBy(setInfos, s => s.name);
    }
}

export const BoxCardModule = {
    getKey(card: BoxCard) : string {
        return `${card.scryfallId}|${card.foil}|${card.lang}`;
    },

    areSame(a: BoxCard, b: BoxCard) : boolean {
        return this.getKey(a) === this.getKey(b);
    }
}

export type AppSettings = {
    dataPath: string
};

export type CardIndex = {
    [id: string]: Card
}

export type CardFilter = {
    nameQuery: string,
    setAbbrevs: string[]
    colors: ColorFilter[],
    colorRule: ColorFilterRule,
    fromBoxes: string[],
    exceptBoxes: string[]
}

export const defaultCardFilter : CardFilter = {
    nameQuery: '',
    setAbbrevs: [],
    colors: [],
    colorRule: ColorFilterRule.IdentityContainsOnly,
    fromBoxes: [],
    exceptBoxes: []
}

export type BoxTransferBulkRequest = {
    fromBoxName: string,
    toBoxName: string,
    cardKeys: string[]
}