import { SyncAlt } from "@mui/icons-material";
import { Box, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useValue } from "../../../context/ContextProvider";
import PieTransaction from "./PieTransaction";

const Main = ({ setSelectedLink, link }) => {
  const {
    state: { currentUser },
    dispatch,
  } = useValue();

  useEffect(() => {
    setSelectedLink(link);
  }, []);
  return (
    <Box
      sx={{
        display: { xs: "flex", md: "grid" },
        gridTemplateColumns: "repeat(3,1fr)",
        gridAutoRows: "minmax(100px, auto)",
        gap: 3,
        textAlign: "center",
        flexDirection: "column",
      }}
    >
      <Stack direction="row">
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4">Total Transactions</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SyncAlt sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }} />
            <Typography variant="h4">15</Typography>
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, gridColumn: "1/3" }}>
          <PieTransaction />
        </Paper>
      </Stack>
    </Box>
  );
};

export default Main;
