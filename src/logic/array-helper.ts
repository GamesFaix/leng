import { groupBy } from "lodash";

export function innerJoin<TLeft, TRight, TResult>(
    left: TLeft[],
    right: TRight[],
    leftSelector: (l:TLeft) => string,
    rightSelector: (r:TRight) => string,
    resultSelector: (l:TLeft, r:TRight) => TResult
) : TResult[] {
    const rightCache = groupBy(right, rightSelector);
    return left
        .map(l => {
            const key = leftSelector(l);
            const matches = rightCache[key];
            if (matches) {
                return matches.map(r => resultSelector(l,r))
            }
            else {
                return [];
            }
        })
        .reduce((a,b) => a.concat(b), []);
}