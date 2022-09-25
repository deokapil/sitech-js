import { Box } from "@mui/material";
import React from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";

const PieTransaction = () => {
  const data = [
    { name: "InBound", value: 400 },
    { name: "OutBound", value: 100 },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        flexWrap: "wrap",
      }}
    >
      <PieChart width={230} height={230}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        />
      </PieChart>
    </Box>
  );
};

export default PieTransaction;
