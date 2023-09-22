import Sidebar from "./Sidebar";
import { Button, Drawer, Sheet } from "@mui/joy";
import { KeyboardArrowRightRounded } from "@mui/icons-material";
import { useState } from "react";

export default function SidebarDrawer({ role, serverList, onPageChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (page: string) => {
    onPageChange(page);
    setIsOpen(false);
  };

  return (
    <div>
      <Sheet
        variant="outlined"
        sx={{
          mr: { xs: 2, s: 3, md: 4 },
          borderRadius: "sm",
          boxShadow: "sm",
          flexGrow: 0,
          display: "inline-flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Button
          color="neutral"
          variant="plain"
          onClick={() => setIsOpen(true)}
          sx={{
            p: 0.5,
            m: 0,
            height: "100%",
          }}
        >
          <KeyboardArrowRightRounded />
        </Button>
        <Drawer
          variant="plain"
          open={isOpen}
          onClose={() => setIsOpen(false)}
          slotProps={{
            content: {
              sx: {
                m: 2,
                width: "fit-content",
                borderRadius: "md",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                height: "96%",
                overflow: "scroll",
              },
            },
          }}
        >
          <Sidebar
            role={role}
            serverList={serverList}
            onPageChange={handleChange}
          />
        </Drawer>
      </Sheet>
    </div>
  );
}
