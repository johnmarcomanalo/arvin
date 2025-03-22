import {
  Grid,
  Stack,
  Typography
} from "@mui/material";
import * as React from "react";
import { connect } from "react-redux"; 
import TableComponent from "components/table/Table";
import { formValueSelector, reduxForm } from "redux-form";
    //component
        //hoooks and configuration 
    import CheckForApprovalHooks from "../../hooks/CheckForApprovalHooks";
    let formName = "ViewRemarks";
    let ViewRemarks = (props) => { 
      const { selectedItem,dataList2,columns2 } = CheckForApprovalHooks(props);
      return (
        <React.Fragment> 
          <Grid container spacing={2}>  
              <Grid  item xs={12} sm={12} md={12} lg={12}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Stack spacing={1}>
                      <Typography variant="p">Remarks</Typography>
                      <Typography>- {selectedItem.message}</Typography>
                      <Typography variant="p">Customer</Typography>
                      <Typography>- {selectedItem.card_name}</Typography>
                      <Typography variant="p">Clerk Remarks</Typography>
                      <Typography>- {selectedItem.remarks}</Typography>
                    </Stack>
                  </Grid> 
                  <br />
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TableComponent
                          columns={columns2}
                          dataList={dataList2} 
                          id={"home_attendance"}
                          localStorage={""} 
                          actionshow={false}
                          paginationShow={false}
                          subAction1Show={false}
                          subAction2Show={false} 
                      /> 
                  </Grid>
              </Grid>  
          </Grid> 
        </React.Fragment>
      );
  }
  
  const ReduxFormComponent = reduxForm({
    form: formName,
  })(ViewRemarks);
  const selector = formValueSelector(formName);
  export default connect((state) => {
    const refresh = state.EpayCheckReducer.refresh;
    return {refresh};
  }, {})(ReduxFormComponent);
  
      