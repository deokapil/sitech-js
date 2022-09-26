import { SyncAlt } from "@mui/icons-material";
import { Box, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Transactions from "../../../components/transactions/Transctions";
import { useValue } from "../../../context/ContextProvider";
import PieTransaction from "./PieTransaction";

const Main = ({ setSelectedLink, link }) => {
  const {
    state: { currentUser, transactions },
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
          <Typography variant="h4">{transactions.length}</Typography>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 2 }}>
        <PieTransaction />
      </Paper>
      <Paper elevation={3} sx={{ p: 2, gridColumn: "1/3" }}>
        <Transactions />
      </Paper>
    </Box>
  );
};

export default Main;
