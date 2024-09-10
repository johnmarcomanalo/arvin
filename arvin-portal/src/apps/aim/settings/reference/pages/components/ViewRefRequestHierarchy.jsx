import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form";
import swal from "sweetalert";
import { Constants } from "../../../../../../reducer/Contants";
import { putRefUnitOfMeasurements } from "../../actions/ReferenceActions";
import configure from "../../../../../configure/configure.json";
const formName = "ViewRefRequestHierarchy";
const submit = async (values, dispatch, props) => {
  try {
    const res = await dispatch(putRefUnitOfMeasurements(values));
    await dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        refresh: !props.refresh,
        updateModal: false,
      },
    });
    swal(res.data.title, res.data.message, res.data.icon);
  } catch (error) {
    console.log(error);
  }
};
let ViewRefRequestHierarchy = ({ selected_ref }) => {
  let hierarchy_structure = selected_ref?.hierarchy_structure
    ? JSON.parse(selected_ref.hierarchy_structure)
    : [];
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Description"
            size="small"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            defaultValue="Hello World"
            value={selected_ref?.description}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Request Type"
            size="small"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            defaultValue="Hello World"
            value={selected_ref?.ref_request_types_description}
          />
        </Grid>
      </Grid>
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
          const { level_description, approver } = value;
          const isLast = index === hierarchy_structure.length - 1;
          return (
            <TimelineItem key={`timeline-item-${index}`}>
              <TimelineOppositeContent color={configure.primary_color}>
                {level_description}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  sx={{ backgroundColor: configure.primary_color }}
                />
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
    </React.Fragment>
  );
};
const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(ViewRefRequestHierarchy);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.ReferenceReducer.refresh;
  const selected_ref = state.ReferenceReducer.selected_ref;

  return { refresh, selected_ref };
}, {})(ReduxFormComponent);
