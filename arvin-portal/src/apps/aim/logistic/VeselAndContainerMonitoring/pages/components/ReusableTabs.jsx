import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";

// TabPanel helper
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ mt:2  }}>{children}</Box>}
    </div>
  );
}

// Reusable Tabs
export default function ReusableTabs({ tabs }) {
  const [value, setValue] = useState(0);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Tab Header */}
      <Tabs
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "12px",
          p: 0.5,
          "& .MuiTab-root": {
            textTransform: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            color: "black",
          },
          "& .Mui-selected": {
            backgroundColor: "white",
            boxShadow: "1px 5px 6px rgba(0,0,0,0.1)",
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab sx={{fontSize:13}} key={index} label={tab.label} />
        ))}
      </Tabs>

      {/* Tab Content */}
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
}
