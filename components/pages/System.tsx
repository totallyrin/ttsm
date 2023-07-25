import { Sheet } from "@mui/joy";
import CPU from "../CPU";
import Memory from "../Memory";

export default function System({ theme }) {
  return (
    <Sheet
      sx={{
        display: "grid",
        gridTemplateColumns: "auto",
        gridTemplateRows: "1fr 1fr",
        gridRowGap: theme.spacing(4),
      }}
    >
      <CPU />
      <Memory />
    </Sheet>
  );
}
