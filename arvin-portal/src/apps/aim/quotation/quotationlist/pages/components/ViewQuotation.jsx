import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import * as React from "react";
import { connect } from "react-redux";
import HelpIcon from "@mui/icons-material/Help";
import { Field, formValueSelector, reduxForm } from "redux-form";
import configure from "../../../../../configure/configure.json";
import InputField from "../../../../../../components/inputFIeld/InputField";
import ButtonComponent from "../../../../../../components/button/Button";
import { cancelRequest } from "../../../../../../api/api";
import swal from "sweetalert";
import { Constants } from "../../../../../../reducer/Contants";
const formName = "ViewQuotation";
const Demo = styled("div")(({ theme }) => ({
  backgroundColor: configure.primary_color,
}));
const submit = async (values, dispatch, props) => {
  try {
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};
const NoMaxWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: "none",
  },
});
const timeline = (hierarchy_structure) => {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineOppositeContent
          color={configure.primary_color}
        ></TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot sx={{ backgroundColor: configure.primary_color }} />
          <TimelineConnector
            sx={{ backgroundColor: configure.secondary_color }}
          />
        </TimelineSeparator>
        <TimelineContent>
          <Card
            sx={{
              boxShadow: configure.box_shadow,
            }}
          >
            <CardContent>
              <Typography
                color={configure.primary_color}
                sx={{ fontWeight: 600 }}
              >
                Start
              </Typography>
            </CardContent>
          </Card>
        </TimelineContent>
      </TimelineItem>
      {hierarchy_structure.map((value, index) => {
        const { level_description, approver, status } = value;
        console.log(value);
        return (
          <TimelineItem key={`timeline-item-${index}`}>
            <TimelineOppositeContent color={configure.primary_color}>
              {"(" + status + ") " + level_description}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot sx={{ backgroundColor: configure.primary_color }} />
              <TimelineConnector
                sx={{ backgroundColor: configure.secondary_color }}
              />
            </TimelineSeparator>
            <TimelineContent>
              <Card
                sx={{
                  boxShadow: configure.box_shadow,
                }}
              >
                <CardContent>
                  <Typography
                    color={configure.primary_color}
                    sx={{ fontWeight: 600 }}
                  >
                    Approver/s
                  </Typography>
                  {approver.map(({ full_name }, approver_index) => (
                    <Typography key={`approver-${index}-${approver_index}`}>
                      {approver_index + 1 + ". " + full_name}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        );
      })}
      <TimelineItem>
        <TimelineOppositeContent
          color={configure.primary_color}
        ></TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot sx={{ backgroundColor: configure.primary_color }} />
        </TimelineSeparator>
        <TimelineContent>
          <Card
            sx={{
              boxShadow: configure.box_shadow,
            }}
          >
            <CardContent>
              <Typography
                color={configure.primary_color}
                sx={{ fontWeight: 600 }}
              >
                End
              </Typography>
            </CardContent>
          </Card>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
};
let ViewQuotation = (props) => {
  const { ...param } = props;
  const selected_data = param.selected_data;
  React.useEffect(() => {
    props.initialize({
      code: selected_data?.code,
      customer_representative: selected_data?.customer_representative,
      customer_description: selected_data?.customer_description,
      customer_address: selected_data?.customer_address,
      currency_type: selected_data?.currency_type,
      request_date: selected_data?.request_date,
      quotation_opening_letter: selected_data?.quotation_opening_letter,
      quotation_closing_letter: selected_data?.quotation_closing_letter,
      products: selected_data?.products,
      notes: selected_data?.notes,
      requestor_name: selected_data?.requestor_name,
      term: selected_data?.term,
      date_requested: selected_data?.date_requested,
    });
    return () => cancelRequest();
  }, []);
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
              spacing={2}
            >
              <NoMaxWidthTooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      width: 500,
                      backgroundColor: configure.tertiary_color, // Set your custom background color here
                      color: configure.primary_color, // Optional: set the text color to ensure contrast
                    },
                  },
                }}
                title={
                  <React.Fragment>
                    {timeline(JSON.parse(selected_data.request_hierarchy))}
                  </React.Fragment>
                }
              >
                <Button sx={configure.default_button} startIcon={<HelpIcon />}>
                  Request Hierarchy Status
                </Button>
              </NoMaxWidthTooltip>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Field
              id="requestor_name"
              name="requestor_name"
              label="Requestor"
              component={InputField}
              required={true}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Field
              id="term"
              name="term"
              label="Term"
              component={InputField}
              required={true}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Field
              id="customer_description"
              name="customer_description"
              label="Customer"
              component={InputField}
              required={true}
              disabled={true}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Field
              id="date_requested"
              name="date_requested"
              label="Date Requested"
              component={InputField}
              required={true}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Field
              id="customer_representative"
              name="customer_representative"
              label="Attention"
              component={InputField}
              required={true}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              id="request_date"
              name="request_date"
              label="Letter Date"
              component={InputField}
              required={true}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="customer_address"
              name="customer_address"
              label="Address"
              component={InputField}
              required={true}
              disabled={true}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <Field
              id="quotation_opening_letter"
              name="quotation_opening_letter"
              label="Opening Letter"
              component={InputField}
              required={true}
              disabled={true}
              multiline={true}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TableContainer
              sx={{
                // maxHeight: screenHeight - 300,
                whiteSpace: "nowrap",
                overflowX: "auto",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      PRODUCT DESCRIPTION
                    </TableCell>

                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                      align="center"
                    >
                      PROJECTED QUANTITY
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                      align="center"
                    >
                      DESTINATION
                    </TableCell>

                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                      align="center"
                    >
                      MINIMUM ORDER QUANTITY
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                      align="center"
                    >
                      PICKUP PRICE
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                      align="center"
                    >
                      PRICE PER UNIT
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                      align="center"
                    >
                      TAX CODE
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selected_data?.products?.map((value, index) => {
                    return (
                      <TableRow>
                        <TableCell>{value.product_description}</TableCell>
                        <TableCell>
                          {value.projected_quantity +
                            " " +
                            value.projected_quantity_unit}
                        </TableCell>
                        <TableCell>{value.destination}</TableCell>
                        <TableCell>
                          {value.minimum_order_quantity +
                            " " +
                            value.minimum_order_quantity_unit}
                        </TableCell>
                        <TableCell>
                          {value.pickup_price + " " + value.pickup_price_unit}
                        </TableCell>
                        <TableCell>
                          {value.price_per_unit + " " + value.price_unit}
                        </TableCell>
                        <TableCell>{value.tax_code}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TableContainer
              sx={{
                // maxHeight: screenHeight - 300,
                whiteSpace: "nowrap",
                overflowX: "auto",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Notes
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selected_data?.notes?.map((value, index) => {
                    return (
                      <TableRow>
                        <TableCell>{value.description}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TableContainer
              sx={{
                // maxHeight: screenHeight - 300,
                whiteSpace: "nowrap",
                overflowX: "auto",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Notes
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selected_data?.notes?.map((value, index) => {
                    return (
                      <TableRow>
                        <TableCell>{value.description}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          
          <Grid item xs={12} md={12}>
            <Field
              id="quotation_closing_letter"
              name="quotation_closing_letter"
              label="Closing Letter"
              component={InputField}
              required={true}
              disabled={true}
              multiline={true}
            />
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};
const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(ViewQuotation);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
