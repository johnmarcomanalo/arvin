import { Link, Grid, Typography } from "@mui/material";
import * as React from "react";
import No_Match from "../../../../media/backgrounds/nomatch.jpg";
export default function NoAccess() {
  return (
    <React.Fragment>
      <Grid
        container
        spacing={0}
        style={{
          backgroundImage: `url(${No_Match})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "100vh", // Ensures full height
          width: "100vw", // Ensures full width
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "white",
          fontSize: "2rem",
          overflow: "hidden",
        }}
      >
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography paragraph sx={{ fontWeight: 900, fontSize: 50 }}>
            401
            <br /> Looks like you took a wrong turn!
          </Typography>
          <Link
            href="/"
            variant="body2"
            sx={{ fontWeight: 600, fontSize: 20, color: "#F1FAFF" }}
          >
            Let's go back home
          </Link>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
