import * as React from 'react';
import Suggestion from './suggestion';

type Props<T> = {
    items: T[],
    activeIndex: number | null,
    getItemLabel: (item: T) => string,
    onItemClicked: (item: T) => void
}

function SuggestionList<T> (props: Props<T>) {
    return (
        <div className="search-result-list">
            {props.items.map((item, i) =>
                <Suggestion
                    key={i.toString()}
                    item={item}
                    label={props.getItemLabel(item)}
                    onClick={props.onItemClicked}
                    isActive={props.activeIndex === i}
                />
            )}
        </div>
    );
};
export default SuggestionList;