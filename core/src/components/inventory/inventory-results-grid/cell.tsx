import { CSSProperties, FC, useCallback } from "react";
import { ResultCard } from "./result-card";
import {
  InventoryResult,
  haveMatchingKeys,
} from "../../../domain/inventory-search";

type Props = {
  result?: InventoryResult;
  inspected: InventoryResult | null;
  setInspected: (result: InventoryResult | null) => void;
  style?: CSSProperties;
};

export const Cell: FC<Props> = ({ style, result, inspected, setInspected }) => {
  const toggleInspected = useCallback(
    (result: InventoryResult) => {
      if (inspected && haveMatchingKeys(result, inspected)) {
        setInspected(null);
      } else {
        setInspected(result);
      }
    },
    [inspected, setInspected]
  );

  if (!result) {
    return <span></span>;
  }

  return (
    <ResultCard
      result={result}
      style={style}
      onClick={() => toggleInspected(result)}
    />
  );
};
