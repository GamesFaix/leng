import { groupBy, orderBy, uniq } from "lodash";
import { RootState } from ".";
import { organizePages } from "../domain/binder-report";
import { getCardsFromBoxes } from "../domain/filters";
import { Card, SetGroup } from "../domain/encyclopedia";

export const selectors = {
  preload: (state: RootState) => state.preload,
  boxes: (state: RootState) => state.inventory.boxes ?? [],
  settings: (state: RootState) => state.settings.settings ?? { dataPath: "" },
  cardIndex: (state: RootState) => state.encyclopedia.cardIndex,
  sets: (state: RootState) => state.encyclopedia.sets,
  setsOfCard(cardName: string | null) {
    return (state: RootState) => {
      const cards = state.encyclopedia.cards.filter((c) => c.name === cardName);
      let sets = cards.map((c) => state.encyclopedia.setIndex[c.set]);
      sets = uniq(sets);
      return orderBy(sets, (s) => s.name);
    };
  },
  setsWithCards: (state: RootState) : Record<string, Card[]>=> {
    const allCards = state.encyclopedia.cards;
    const bySet = groupBy(allCards, (c) => c.set);
    return bySet;
  },
  setsGroupedByParent: (state: RootState): SetGroup[] => {
    const { sets } = state.encyclopedia;
    const groupedByParent = groupBy(sets, (s) => s.parent_set_code);
    const parentSets = sets.filter((s) => !s.parent_set_code);
    return parentSets.map((s) => ({
      parent: s,
      children: groupedByParent[s.code] ?? [],
    }));
  },
  cardNames: (state: RootState) => state.encyclopedia.cardNames,
  cardsOfNameAndSetName(cardName: string | null, setName: string | null) {
    return (state: RootState) => {
      const cards = state.encyclopedia.cards.filter(
        (c) => c.name === cardName && c.set_name === setName
      );
      return cards;
    };
  },
  box(name: string | null) {
    return (state: RootState) => {
      return state.inventory.boxes?.find((b) => b.name === name) ?? null;
    };
  },
  set(abbrev: string) {
    return (state: RootState) => {
      return state.encyclopedia.setIndex[abbrev] ?? null;
    };
  },
  card(scryfallId: string) {
    return (state: RootState) => {
      return state.encyclopedia.cardIndex[scryfallId] ?? null;
    };
  },
  isCardImageLoaded(scryfallId: string) {
    return (state: RootState) => {
      return state.encyclopedia.cachedCardImageIds.includes(scryfallId);
    };
  },
  unsavedChanges: (state: RootState) => state.editing.unsavedChanges,
  formats: (state: RootState) => state.encyclopedia.formats,
  boxCardsOfParentSet(code: string | null) {
    return (state: RootState) => {
      if (!code) return [];

      const codes = [
        code,
        ...state.encyclopedia.sets
          .filter((s) => s.parent_set_code === code)
          .map((s) => s.code),
      ];
      return getCardsFromBoxes(state.inventory.boxes ?? []).filter((c) =>
        codes.includes(c.setAbbrev)
      );
    };
  },
  setGroupsInBoxes(state: RootState) {
    const { sets } = state.encyclopedia;
    const groupedByParent = groupBy(sets, (s) => s.parent_set_code);
    const parentSets = sets.filter((s) => !s.parent_set_code);
    const setGroups = parentSets.map((s) => ({
      parent: s,
      children: groupedByParent[s.code] ?? [],
    }));

    const boxes = state.inventory.boxes ?? [];
    const setCodesInBoxes = uniq(
      boxes
        .map((b) => b.cards?.map((c) => c.setAbbrev) ?? [])
        .reduce((a, b) => a.concat(b), [])
    );
    return setGroups.filter((sg) =>
      [sg.parent, ...sg.children].some((s) => setCodesInBoxes.includes(s.code))
    );
  },
  binderPagesOfParentSet(parentSetCode: string | null) {
    return (state: RootState) => {
      const selectedCards = selectors.boxCardsOfParentSet(parentSetCode)(state);
      const setGroupsInBoxes = selectors.setGroupsInBoxes(state);
      const selectedSetGroup = setGroupsInBoxes.find(
        (sg) => parentSetCode === sg.parent.code
      );
      const selectedSets = selectedSetGroup
        ? [selectedSetGroup.parent, ...selectedSetGroup.children]
        : [];
      return organizePages(selectedCards, selectedSets);
    };
  },
  searchResults(state: RootState) {
    return state.search.results;
  },
};
