import * as React from 'react';
import { Language } from '../../logic/model';

import britishFlag from '../../images/flags/gb.svg';
import chineseFlag from '../../images/flags/cn.svg';
import frenchFlag from '../../images/flags/fr.svg';
import germanFlag from '../../images/flags/de.svg';
import spanishFlag from '../../images/flags/es.svg';
import italianFlag from '../../images/flags/it.svg';
import russianFlag from '../../images/flags/ru.svg';
import portugueseFlag from '../../images/flags/pt.svg';
import japaneseFlag from '../../images/flags/jp.svg';
import southKoreanFlag from '../../images/flags/kr.svg';

type Props = {
    lang: Language
}

function getLanguageIcon(lang: string) {
    switch(lang) {
        case Language.English: return britishFlag;
        case Language.ChineseSimplified: return chineseFlag;
        case Language.ChineseTraditional: return chineseFlag;
        case Language.French: return frenchFlag;
        case Language.German: return germanFlag;
        case Language.Italian: return italianFlag;
        case Language.Japanese: return japaneseFlag;
        case Language.Korean: return southKoreanFlag;
        case Language.Portuguese: return portugueseFlag;
        case Language.Russian: return russianFlag;
        case Language.Spanish: return spanishFlag;
        default: throw "Invalid language " + lang;
    }
}

function getLanguageHint(lang: string) {
    switch (lang) {
        case Language.ChineseSimplified: return " (Simp.)";
        case Language.ChineseTraditional: return " (Trad.)";
        default: return "";
    }
}

const FlagIcon = (props: Props) => {
    return (<span>
        <img
            src={getLanguageIcon(props.lang)}
            alt=""
            width="20px"
        />
        {getLanguageHint(props.lang)}
    </span>);
}
export default FlagIcon;