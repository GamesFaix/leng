import * as React from 'react';
import { Language } from "../../logic/model";
import FlagIcons from '../../images/flags';

type Props = {
    lang: Language
}

function getLanguageIcon(lang: string) {
    switch(lang) {
        case Language.English: return FlagIcons.british;
        case Language.ChineseSimplified: return FlagIcons.chinese;
        case Language.ChineseTraditional: return FlagIcons.chinese;
        case Language.French: return FlagIcons.french;
        case Language.German: return FlagIcons.german;
        case Language.Italian: return FlagIcons.italian;
        case Language.Japanese: return FlagIcons.japanese;
        case Language.Korean: return FlagIcons.southKorean;
        case Language.Portuguese: return FlagIcons.portuguese;
        case Language.Russian: return FlagIcons.russian;
        case Language.Spanish: return FlagIcons.spanish;
        default: throw "Invalid language " + lang;
    }
}

const FlagIcon = (props: Props) => {
    return (<img
        src={getLanguageIcon(props.lang)}
        alt=""
        width="20px"
    />);
}
export default FlagIcon;