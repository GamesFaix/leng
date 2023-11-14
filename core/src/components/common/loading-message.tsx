import { CircularProgress } from "@mui/material";

type Props = {
  message: string;
};

export const LoadingMessage = (props: Props) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <CircularProgress />
      <div style={{ padding: "10px" }}>{props.message}</div>
    </div>
  );
};
