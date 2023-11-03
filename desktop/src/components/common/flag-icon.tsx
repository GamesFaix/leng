import * as React from 'react';
import { Language } from "leng-core/src/logic/model";

import britishFlag from 'leng-core/src/images/flags/gb.svg';
import chineseFlag from 'leng-core/src/images/flags/cn.svg';
import frenchFlag from 'leng-core/src/images/flags/fr.svg';
import germanFlag from 'leng-core/src/images/flags/de.svg';
import spanishFlag from 'leng-core/src/images/flags/es.svg';
import italianFlag from 'leng-core/src/images/flags/it.svg';
import russianFlag from 'leng-core/src/images/flags/ru.svg';
import portugueseFlag from 'leng-core/src/images/flags/pt.svg';
import japaneseFlag from 'leng-core/src/images/flags/jp.svg';
import southKoreanFlag from 'leng-core/src/images/flags/kr.svg';

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

const FlagIcon = (props: Props) => {
    return (<img
        src={getLanguageIcon(props.lang)}
        alt=""
        width="20px"
    />);
}
export default FlagIcon;