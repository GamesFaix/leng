import { LinearProgress, TableCell, TableRow, Typography } from "@mui/material";
import * as React from "react";
import ChecklistView from "./checklist-view";
import {
  CheckListItem,
  CheckListVisibility,
  SetCompletionModel,
} from "./model";

const createChecklist = (model: SetCompletionModel): CheckListItem[] =>
  model.allCards.map((c) => ({
    card: c,
    has: model.ownedCards.some(
      (bc) => bc.collectorsNumber === c.num
    ),
  }));

const CompletionCell = (props: { checkList: CheckListItem[] }) => {
  if (props.checkList.length === 0) {
    return <TableCell />;
  }

  const numerator = props.checkList.filter((x) => x.has).length;
  const denominator = props.checkList.length;
  const completion = (numerator / denominator) * 100;

  return (
    <TableCell>
      <LinearProgress variant="determinate" value={completion} />
      <Typography style={{ fontSize: ".75em" }}>
        {`${completion.toFixed(0)}% (${numerator} of ${denominator})`}
      </Typography>
    </TableCell>
  );
};

const ChecklistCell = (props: { checklist: CheckListItem[], visibility: CheckListVisibility }) => {
  return (
    <TableCell>
      <ChecklistView
        checklist={props.checklist}
        visibility={props.visibility}
      />
    </TableCell>
  );
};

type Props = {
    label: string;
    model: SetCompletionModel | null;
    visibility: CheckListVisibility;
};

const SetStatsRow = (props: Props) => {
  if (!props.model || props.model.allCards.length === 0) {
    return <></>;
  }

  const checklist = createChecklist(props.model);

  const [expanded, setExpanded] = React.useState(false);

  return (
    <TableRow onClick={() => setExpanded(!expanded)}>
      <TableCell width="sm" style={{ verticalAlign: "top" }}>
        {props.label}
      </TableCell>
      {expanded ? (
        <ChecklistCell checklist={checklist} visibility={props.visibility}/>
      ) : (
        <CompletionCell checkList={checklist} />
      )}
    </TableRow>
  );
};
export default SetStatsRow;
