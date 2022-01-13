import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Search from "./search";
import { orderBy, uniqBy } from "lodash";
import { currentSelectionActions } from "../store/currentSelection";
import { RootState } from "../store";

type Props = {
};

type SetInfo = {
    name: string,
    normalizedName: string,
    abbrev: string
}

function searchSets(query: string, sets: SetInfo[]) : SetInfo[] {
    const q = query.toLowerCase().trim();
    if (q === "") { return sets; }

    const matches = sets.filter(s => s.normalizedName.includes(q) || s.abbrev.includes(q));
    const sorted = orderBy(matches, x => x);
    return sorted;
}

const SetSearch = (props: Props) => {
    const dispatch = useDispatch();

    const selectedCardName = useSelector(
        (state: RootState) => state.currentSelection.cardName
    );

    let setInfos : SetInfo[] = [];

    if (selectedCardName !== null) {
        let sets = selectedCardName.cards.map(c => [c.set, c.set_name]);
        sets = uniqBy(sets, tup => tup[0]);

        setInfos = sets.map(s => {
            return {
                abbrev: s[0],
                name: s[1],
                normalizedName: s[1].toLowerCase()
            };
        });
        setInfos = orderBy(setInfos, "name");
    }

    return (
        <Search
            items={setInfos}
            getLabel={setInfo => setInfo.name}
            search={searchSets}
            debounceMinLength={0}
            showEmptyIfNoQuery={false}
            placeholder="Enter set name..."
            disabled={selectedCardName === null}
            onSuggestionClicked={set => {
                console.log(`You clicked ${set}`);
                dispatch(currentSelectionActions.selectSetAbbrev(set.abbrev));
            }}
            onQueryChanged={() => { return; }}
        />
    )
};
export default SetSearch;
