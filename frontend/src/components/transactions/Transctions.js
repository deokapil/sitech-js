import { useEffect, useMemo, useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { useValue } from "../../context/ContextProvider";
import { grey } from "@mui/material/colors";
import { getTransactions } from "../../actions/transactions";
import { DateTime } from "luxon";
import S3DownloadButton from "../S3DownloadButton";

const Transactions = () => {
  const {
    state: { transactions },
    dispatch,
  } = useValue();

  useEffect(() => {
    getTransactions(dispatch);
  }, []);

  const [pageSize, setPageSize] = useState(10);
  const [rowId, setRowId] = useState(null);

  const columns = useMemo(
    () => [
      { field: "tranSet", headerName: "Tran Set", width: 100 },
      { field: "direction", headerName: "Direction", width: 90 },
      { field: "tradingPartner", headerName: "Trading Partner", width: 220 },
      {
        field: "recTime",
        headerName: "Recieved On",
        width: 250,
        renderCell: (params) => DateTime.fromMillis(params.row.recTime).toISO(),
      },
      { field: "status", headerName: "Status", width: 220 },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        renderCell: (params) => <S3DownloadButton {...{ params }} />,
        width: 220,
      },
    ],
    [rowId]
  );

  return (
    <Box
      sx={{
        height: 400,
        width: "100%",
      }}
    >
      <DataGrid
        columns={columns}
        rows={transactions}
        getRowId={(row) => row._id}
        rowsPerPageOptions={[5, 10, 20]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        sx={{
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? grey[200] : grey[900],
          },
        }}
      />
    </Box>
  );
};

export default Transactions;
