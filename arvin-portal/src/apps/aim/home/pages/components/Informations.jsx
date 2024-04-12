import {
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import * as React from "react";
import configure from "../../../../configure/configure.json";

export default function Information() {
  return (
    <React.Fragment>
      <Grid container spacing={2} columns={24}>
        <Grid item xs={24} sm={24} md={8} lg={8}>
          <Stack direction="row" justifyContent="flex-start" spacing={2}>
            <FormTitle title="Personal Information" />
          </Stack>
          <Card
            sx={{
              boxShadow: configure.box_shadow,
            }}
          >
            <CardContent>
              <TableContainer>
                <Table size="small" aria-label="simple table">
                  <TableBody>
                    <TableRow>
                      <TableCell align="left">
                        <Typography>Name:</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>John Doe</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="left">
                        <Typography>Email:</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>johndoe@example.com</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="left">
                        <Typography>Phone:</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>09123456789</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="left">
                        <Typography>Birthday:</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>26th Oct</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="left">
                        <Typography>Gender:</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>Male</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={24} sm={24} md={8} lg={8}>
          <Stack direction="row" justifyContent="flex-start" spacing={2}>
            <FormTitle title="Emergency Contact" />
          </Stack>
          <Card
            sx={{
              boxShadow: configure.box_shadow,
            }}
          >
            <CardContent>qwrewq</CardContent>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
