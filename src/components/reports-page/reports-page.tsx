import {
  Autocomplete,
  Card as MuiCard,
  Container,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useSelector } from "react-redux";
import selectors from "../../store/selectors";
import { Set, Card as ScryfallCard } from "scryfall-api";
import SetSymbol from "../common/set-symbol";
import Binder from "../virtual-binder/binder";
import { organizePages } from "./binder-page-generator";
import { getCardsFromBoxes } from "../../logic/card-filters";
import { BoxCard } from "../../logic/model";

type SetSelectorOption = {
    label: string,
    parent: Set
}

const SetSelectorOption = (props: any, option: SetSelectorOption, state: any) => {
  const classes = state.selected
    ? ["autocomplete-option", "selected", "set-container"]
    : ["autocomplete-option", "set-container"];

  return (
    <li {...props} key={option.parent.code} classes={classes}>
      <SetSymbol setAbbrev={option.parent.code} />
      <div>{`${option.parent.name} (${option.parent.code.toUpperCase()})`}</div>
    </li>
  );
};

const SetSelector = (props: {
  selectedSetCode: string | null;
  setSelectedSetCode: (code: string | null) => void;
}) => {
    const setGroupsInBoxes = useSelector(selectors.setGroupsInBoxes);
    const options = React.useMemo<SetSelectorOption[]>(
        () => setGroupsInBoxes.map((s) => ({ label: s.parent.name, parent: s.parent })),
        [setGroupsInBoxes]);
    const selectedOption = options.find(o => o.parent.code === props.selectedSetCode) ?? null;

    const onSelection = React.useCallback((e, value) => props.setSelectedSetCode(value?.parent.code ?? null), [props.setSelectedSetCode]);

    return (
        <Autocomplete
            className="control"
            options={options}
            sx={{ width: 300 }}
            renderInput={(params) => (
                <TextField {...params} label="Set" onFocus={(e) => e.target.select()} />
            )}
            onChange={onSelection}
            value={selectedOption}
            autoSelect
            autoHighlight
            selectOnFocus
            openOnFocus
            renderOption={SetSelectorOption}
        />);
};

type BinderProps = {
  parentSetCode: string | null
}

const BinderOfSet = (props: BinderProps) => {
  const boxes = useSelector(selectors.boxes);
  const sets = useSelector(selectors.sets);
  const setGroupsInBoxes = useSelector(selectors.setGroupsInBoxes);

  const pages = React.useMemo(() => {
    if (!props.parentSetCode) { return []; }
    const codes = [props.parentSetCode, ...sets.filter(s => s.parent_set_code === props.parentSetCode).map(s => s.code)];
    const selectedCards = getCardsFromBoxes(boxes).filter(c => codes.includes(c.setAbbrev));
    const selectedSetGroup = setGroupsInBoxes.find(sg => props.parentSetCode === sg.parent.code);
    const selectedSets = selectedSetGroup ? [ selectedSetGroup.parent, ...selectedSetGroup.children ] : [];
    const pages = organizePages(selectedCards, selectedSets);
    return pages;
  }, [props.parentSetCode]);

  return <Binder pages={pages}/>;
}

type SetCompletionModel = {
  set: Set,
  allCards: ScryfallCard[],
  ownedCards: BoxCard[]
}

type ParentSetCompletionModel = {
  parentSet: SetCompletionModel,
  tokenSet: SetCompletionModel | null,
  artSet: SetCompletionModel | null,
  promoSet: SetCompletionModel | null,
  commanderSet: SetCompletionModel | null,
  masterpieceSet: SetCompletionModel | null, // Mystic Archive, etc
}

type CheckListItem = {
  card: ScryfallCard,
  has: boolean
}

const createModel = (
  selectedSets: Set[],
  ownedCards: BoxCard[],
  encyclopediaCardsBySet: Record<string, ScryfallCard[]>)
  : ParentSetCompletionModel => {

  const parentSet = selectedSets.find(s => !s.parent_set_code)!;
  const tokenSet = selectedSets.find(s => s.set_type === 'token') ?? null;
  const masterpieceSet = selectedSets.find(s => s.set_type === 'masterpiece') ?? null;
  const promoSet = selectedSets.find(s => s.set_type === 'promo') ?? null;
  const commanderSet = selectedSets.find(s => s.set_type === 'commander') ?? null;
  // memorabilia also contains oversized cards and other things
  const artSet = selectedSets.find(s => s.set_type === 'memorabilia' && s.name.toLowerCase().includes('art')) ?? null;

  const getSetModel = (set: Set | null) => (
    set ?
    {
      set,
      allCards: encyclopediaCardsBySet[set.code],
      ownedCards: ownedCards.filter(c => c.setAbbrev === set.code)
    }: null);

  return {
    parentSet: getSetModel(parentSet)!,
    tokenSet: getSetModel(tokenSet),
    artSet: getSetModel(artSet),
    promoSet: getSetModel(promoSet),
    commanderSet: getSetModel(commanderSet),
    masterpieceSet: getSetModel(masterpieceSet)
  };
}

const createChecklist = (model: SetCompletionModel) : CheckListItem[] =>
  model.allCards.map(c => ({
      card: c,
      has: model.ownedCards.some(bc => bc.collectorsNumber === c.collector_number)
  }));

const CompletionCell = (props: { checkList: CheckListItem[] }) => {
  if (props.checkList.length === 0) {
      return <TableCell/>
  }

  const completion =
      props.checkList.filter(x => x.has).length
      / props.checkList.length
      * 100;

  return (
      <TableCell>
          <LinearProgress variant='determinate' value={completion}/>
          <Typography style={{ fontSize: ".75em" }}>
              {completion.toFixed(0)}%
          </Typography>
      </TableCell>
  );
};

const SetStats = (props: BinderProps) => {
  const boxes = useSelector(selectors.boxes);
  const sets = useSelector(selectors.sets);
  const cardsBySet = useSelector(selectors.setsWithCards);
  const setGroupsInBoxes = useSelector(selectors.setGroupsInBoxes);

  const selectedCards = React.useMemo(() =>{
    const codes = [props.parentSetCode, ...sets.filter(s => s.parent_set_code === props.parentSetCode).map(s => s.code)];
    return getCardsFromBoxes(boxes).filter(c => codes.includes(c.setAbbrev));
  }, [props.parentSetCode, boxes, sets]);

  const selectedSets = React.useMemo(() => {
    const selectedSetGroup = setGroupsInBoxes.find(sg => props.parentSetCode === sg.parent.code);
    return selectedSetGroup ? [ selectedSetGroup.parent, ...selectedSetGroup.children ] : [];
  }, [props.parentSetCode, setGroupsInBoxes]);

  const model = React.useMemo(() => createModel(selectedSets, selectedCards, cardsBySet),
    [selectedSets, selectedCards, cardsBySet]);

  return (
    <TableContainer>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Main set</TableCell>
            <CompletionCell checkList={createChecklist(model.parentSet)}/>
          </TableRow>
          {model.tokenSet ? <TableRow>
            <TableCell>Tokens</TableCell>
            <CompletionCell checkList={createChecklist(model.tokenSet)}/>
          </TableRow> : null}
          {model.promoSet ? <TableRow>
            <TableCell>Promos</TableCell>
            <CompletionCell checkList={createChecklist(model.promoSet)}/>
          </TableRow> : null}
          {model.commanderSet ? <TableRow>
            <TableCell>Commander cards</TableCell>
            <CompletionCell checkList={createChecklist(model.commanderSet)}/>
          </TableRow> : null }
          {model.masterpieceSet ? <TableRow>
            <TableCell>Masterpiece cards</TableCell>
            <CompletionCell checkList={createChecklist(model.masterpieceSet)}/>
          </TableRow> : null }
          {model.artSet ? <TableRow>
            <TableCell>Art cards</TableCell>
            <CompletionCell checkList={createChecklist(model.artSet)}/>
          </TableRow> : null }
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const ReportsPage = () => {
  const [selectedParentSetCode, setSelectedParentSetCode] = React.useState<string | null>('6ed');

  const onSetSelected = React.useCallback((code) => {
    if (code === selectedParentSetCode) return;
    setSelectedParentSetCode(code);
  }, [setSelectedParentSetCode]);

  return (
    <Container style={{ paddingTop: '12px' }} maxWidth="xl">
      <SetSelector
        selectedSetCode={selectedParentSetCode}
        setSelectedSetCode={onSetSelected}
      />
      <br/>
      <MuiCard>
        <Typography variant="h5">Binder</Typography>
        <BinderOfSet parentSetCode={selectedParentSetCode}/>
      </MuiCard>
      <br/>
      <MuiCard>
        <Typography variant="h5">Stats</Typography>
        <SetStats parentSetCode={selectedParentSetCode}/>
      </MuiCard>
    </Container>
  );
};
export default ReportsPage;
