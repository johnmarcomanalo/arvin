import { Link, Grid, Typography } from "@mui/material";
import * as React from "react";
import UnderDevelopment from "../../../../media/backgrounds/underdevelopment.jpg";
export default function NoMatch() {
  return (
    <React.Fragment>
      <Grid container spacing={0} w>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Typography paragraph sx={{ fontWeight: 900, fontSize: 50 }}>
            404
            <br /> Looks like you're lost in the woods.
          </Typography>
          <Link
            href="/"
            variant="body2"
            sx={{ fontWeight: 600, fontSize: 20, color: "#F1FAFF" }}
          >
            Let's go back home
          </Link>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Typography paragraph sx={{ fontWeight: 900, fontSize: 50 }}>
            
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
