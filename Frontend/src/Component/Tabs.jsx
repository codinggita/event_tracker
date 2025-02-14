import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";

export default function TabsComponent() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ width: "100%", textAlign: "center", bgcolor: "#121212", color: "white", p: 2 }}>
      {/* Tabs Header */}
      <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} centered>
        <Tab label="EVENTS" />
        <Tab label="CURATED LIST" />
      </Tabs>

      {/* Tabs Content */}
      <Box sx={{ mt: 3 }}>
        {tabIndex === 0 ? <Typography>🔥 Events yahan dikhayenge.</Typography> 
                        : <Typography>📌 Aapke curated lists yahan aayenge.</Typography>}
      </Box>
    </Box>
  );
}
