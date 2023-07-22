import { CircularProgress, Sheet, useTheme } from "@mui/joy";
import * as React from "react";

export default function Loading() {
  const theme = useTheme();

  return (
    <Sheet
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress size="lg" />
    </Sheet>
  );
}
