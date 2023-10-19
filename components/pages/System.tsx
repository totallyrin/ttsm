import { Box } from "@mui/joy";
import CPU from "../CPU";
import Memory from "../Memory";

export default function System({ theme }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "auto",
        gridTemplateRows: "1fr 1fr",
        gridRowGap: { xs: theme.spacing(2), md: theme.spacing(4) },
      }}
    >
      <CPU />
      <Memory />
    </Box>
  );
}
