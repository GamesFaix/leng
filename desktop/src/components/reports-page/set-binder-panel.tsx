import * as React from "react";
import { useSelector } from "react-redux";
import selectors from "leng-core/src/store/selectors";
import Binder from "../virtual-binder/binder";
import { organizePages } from "leng-core/src/logic/binder-page-generator";
import { getCardsFromBoxes } from "leng-core/src/logic/card-filters";

type Props = {
  parentSetCode: string | null;
};

const SetBinderPanel = (props: Props) => {
  const boxes = useSelector(selectors.boxes);
  const sets = useSelector(selectors.sets);
  const setGroupsInBoxes = useSelector(selectors.setGroupsInBoxes);

  const pages = React.useMemo(() => {
    if (!props.parentSetCode) {
      return [];
    }
    const codes = [
      props.parentSetCode,
      ...sets
        .filter((s) => s.parent_set_code === props.parentSetCode)
        .map((s) => s.code),
    ];
    const selectedCards = getCardsFromBoxes(boxes).filter((c) =>
      codes.includes(c.setAbbrev)
    );
    const selectedSetGroup = setGroupsInBoxes.find(
      (sg) => props.parentSetCode === sg.parent.code
    );
    const selectedSets = selectedSetGroup
      ? [selectedSetGroup.parent, ...selectedSetGroup.children]
      : [];
    const pages = organizePages(selectedCards, selectedSets);
    return pages;
  }, [props.parentSetCode]);

  return <Binder pages={pages} />;
};
export default SetBinderPanel;