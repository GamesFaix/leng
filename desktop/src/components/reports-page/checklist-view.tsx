import { Checkbox, Typography } from "@mui/material";
import * as React from "react";
import { normalizeCollectorsNumber } from "leng-core/src/logic/binder-page-generator";
import { orderBy } from "lodash";
import { CheckListItem, CheckListVisibility } from "./model";

type Props = {
  checklist: CheckListItem[];
  visibility: CheckListVisibility;
};

const ChecklistView = (props: Props) => {
  const items = React.useMemo(() => {
    let filtered = props.checklist;
    switch (props.visibility) {
      case CheckListVisibility.owned:
        filtered = filtered.filter((x) => x.has);
        break;
      case CheckListVisibility.missing:
        filtered = filtered.filter((x) => !x.has);
        break;
    }
    return orderBy(filtered, (x) =>
      normalizeCollectorsNumber(x.card.collector_number)
    );
  }, [props]);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.card.id} style={{ display: "flex" }}>
          <Checkbox checked={item.has} readOnly disabled />
          <Typography variant="body2">{`${item.card.name} (${item.card.collector_number})`}</Typography>
        </li>
      ))}
    </ul>
  );
};
export default ChecklistView;
