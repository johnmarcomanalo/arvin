import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Grid,
  Typography,
  Tooltip,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import swal from "sweetalert";
import { styled } from "@mui/material/styles";
import configure from "../../apps/configure/configure.json";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const Filter = (props: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, setState] = useState({
    conditions: [
      { column: "", condition: "", value: "", connector: "&&", type: "" },
    ],
    valuePicker: [] as string[],
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value: string) => {};

  const addCondition = () => {
    const newConditions = [
      ...state.conditions,
      { column: "", condition: "", value: "", connector: "&&", type: "" },
    ];

    setState((prev) => ({
      ...prev,
      conditions: newConditions,
    }));
  };

  const onChangeColumnFilter = (value: any, index: any, column: any) => {
    const matchColumn = props.options.filter((val: any) => val.value === value);

    setState((prev) => ({
      ...prev,
      valuePicker: matchColumn[0].conditionValue,
      conditions: state.conditions.map((val, valIndex) =>
        valIndex === index
          ? { ...val, [column]: value, type: matchColumn[0].type, value: "" }
          : val
      ),
    }));
  };

  const onChangeValueFilter = (
    value: string,
    index: number,
    column: string,
    columnValue?: string
  ) => {
    if (
      columnValue !== undefined &&
      typeof props.onChangeValueFilter !== "undefined"
    ) {
      props.onChangeValueFilter(value, columnValue);
    }

    setState((prev) => ({
      ...prev,
      conditions: state.conditions.map((val, valIndex) =>
        valIndex === index ? { ...val, [column]: value } : val
      ),
    }));
  };

  const onFilter = () => {
    let query = "";
    let emptyText = false;

    state.conditions.forEach((val, index) => {
      if (val.column === "" || val.condition === "" || val.value === "") {
        emptyText = true;
      }

      query += val.column + " " + val.condition + " " + "'" + val.value + "'";

      if (state.conditions.length - 1 > index) {
        query += " " + val.connector + " ";
      }
    });

    if (emptyText) {
      swal("Warning", "Please complete the details!", "warning");
    } else {
      localStorage.setItem("filterQuery", JSON.stringify(state.conditions));
      props.onFilterData(query);
      handleCancel();
    }
  };

  const removeQuery = (index: number) => {
    const newCondition = [...state.conditions];
    newCondition.splice(index, 1);

    setState((prev) => ({
      ...prev,
      conditions: newCondition,
    }));
  };

  useEffect(() => {
    const filterQuery = localStorage.getItem("filterQuery");

    if (filterQuery !== null) {
      const matchColumn = props.options.filter(
        (val: any) => val.value === JSON.parse(filterQuery)[0]?.column
      );

      setState((prev) => ({
        ...prev,
        conditions: JSON.parse(filterQuery),
        valuePicker: matchColumn[0]?.conditionValue || [],
      }));
    }
  }, []);

  const reset = () => {
    setState((prev) => ({
      ...prev,
      conditions: [
        { column: "", condition: "", value: "", connector: "&&", type: "" },
      ],
      valuePicker: [],
    }));

    props.onFilterData("");
    localStorage.removeItem("filterQuery");
    handleCancel();
  };
  return (
    <div>
      <Button
        id="onFilter"
        style={configure.default_button}
        onClick={showModal}
      >
        Open Modal
      </Button>
      <BootstrapDialog
        onClose={handleCancel}
        aria-labelledby="customized-dialog-title"
        open={isModalOpen}
        fullWidth
        maxWidth={"md"}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Filter
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{
            display: isModalOpen ? undefined : "none",
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <form>
            {state.conditions.map((val: any, index: any) => {
              if (index === 0)
                return (
                  <Grid container spacing={1} key={index}>
                    <Grid item xs={3} md={3}>
                      <Typography>WHERE</Typography>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <Select
                        style={{
                          width: "100%",
                        }}
                        onChange={(e) =>
                          onChangeColumnFilter(
                            e.target.value as string,
                            0,
                            "column"
                          )
                        }
                        value={val.column}
                      >
                        {props.options.map((option: any) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <Select
                        style={{
                          width: "100%",
                        }}
                        value={val.condition}
                        onChange={(e) =>
                          onChangeValueFilter(
                            e.target.value as string,
                            0,
                            "condition"
                          )
                        }
                      >
                        {[
                          { value: "=", label: "equal to" },
                          { value: ">", label: "greater than" },
                          { value: "<", label: "less than" },
                          { value: ">=", label: "greater than or equal to" },
                          { value: "<=", label: "less than or equal to" },
                        ].map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid
                      item
                      xs={state.conditions.length > 1 ? 7 : 9}
                      md={state.conditions.length > 1 ? 7 : 9}
                    >
                      {val.type === "text" || val.type === "" ? (
                        <Select
                          style={{
                            width: "100%",
                          }}
                          onChange={(e) =>
                            onChangeValueFilter(
                              e.target.value as string,
                              0,
                              "value",
                              val.column
                            )
                          }
                          value={val.value}
                        >
                          {state.valuePicker.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <Input
                          type={val.type}
                          onChange={(e) =>
                            onChangeValueFilter(
                              e.target.value,
                              index,
                              "value",
                              val.column
                            )
                          }
                          value={val.value}
                        />
                      )}
                    </Grid>
                    {state.conditions.length > 1 ? (
                      <Grid item xs={2} md={2}>
                        <Select
                          value={val.connector}
                          defaultValue="And"
                          style={{
                            width: "100%",
                          }}
                          onChange={(e) =>
                            onChangeValueFilter(
                              e.target.value as string,
                              0,
                              "connector"
                            )
                          }
                        >
                          {[
                            { value: "And", label: "&&" },
                            { value: "Or", label: "||" },
                          ].map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                    ) : null}
                  </Grid>
                );
            })}

            {state.conditions.map((val, index) => {
              if (index > 0)
                return (
                  <WhereColumn
                    {...props}
                    type={val.type}
                    length={state.conditions.length}
                    index={index}
                    onChangeColumnFilter={onChangeColumnFilter}
                    onChangeValueFilter={onChangeValueFilter}
                    removeQuery={removeQuery}
                    connector={val.connector}
                    column={val.column}
                    condition={val.condition}
                    value={val.value}
                    key={index}
                  />
                );
            })}

            <Grid container>
              <Grid item xs={12} md={12}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button onClick={reset} color="secondary" variant="text">
                    Reset
                  </Button>
                  <Button onClick={addCondition} color="primary" variant="text">
                    Add Condition
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};

const WhereColumn = (props: any) => {
  const [state, setState] = useState({
    valuePicker: [] as string[],
  });

  const onChangeColumnFilterWhere = (value: any, index: any, column: any) => {
    const matchColumn = props.options.filter((val: any) => val.value === value);
    props.onChangeColumnFilter(value, index, column);

    setState((prev) => ({
      ...prev,
      valuePicker: matchColumn[0]?.conditionValue || [],
    }));
  };

  useEffect(() => {
    if (props.column !== "") {
      const matchColumn = props.options.filter(
        (val: any) => val.value === props.column
      );

      setState((prev) => ({
        ...prev,
        valuePicker: matchColumn[0]?.conditionValue || [],
      }));
    }
  }, []);

  return (
    <Grid container spacing={1} style={{ marginTop: 7 }} key={props.index}>
      <Grid item xs={8} md={8}>
        <Select
          value={props.column}
          style={{
            width: "100%",
          }}
          onChange={(e) =>
            onChangeColumnFilterWhere(
              e.target.value as string,
              props.index,
              "column"
            )
          }
        >
          {props.options.map((option: any) => {
            return (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            );
          })}
        </Select>
      </Grid>
      <Grid item xs={7} md={7}>
        <Select
          style={{
            width: "100%",
          }}
          onChange={(e) => {
            props.onChangeValueFilter(
              e.target.value as string,
              props.index,
              "condition"
            );
          }}
          value={props.condition}
        >
          {[
            { value: "=", label: "equal to" },
            { value: ">", label: "greater than" },
            { value: "<", label: "less than" },
            { value: ">=", label: "greater than or equal to" },
            { value: "<=", label: "less than or equal to" },
          ].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid
        item
        xs={props.length - 1 > props.index ? 6 : 8}
        md={props.length - 1 > props.index ? 6 : 8}
      >
        {props.type === "text" || props.type === "" ? (
          <Select
            style={{
              width: "100%",
            }}
            value={props.value}
            onChange={(e) =>
              props.onChangeValueFilter(
                e.target.value as string,
                props.index,
                "value"
              )
            }
          >
            {state.valuePicker.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Input
            type={props.type}
            onChange={(e) =>
              props.onChangeValueFilter(e.target.value, props.index, "value")
            }
            value={props.value}
          />
        )}
      </Grid>
      {props.length - 1 > props.index ? (
        <Grid item xs={2} md={2}>
          <Select
            value={props.connector}
            defaultValue="And"
            style={{
              width: "100%",
            }}
            onChange={(e) =>
              props.onChangeValueFilter(
                e.target.value as string,
                props.index,
                "connector"
              )
            }
          >
            {[
              { value: "And", label: "&&" },
              { value: "Or", label: "||" },
            ].map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      ) : null}
      <Grid item xs={1} md={1}>
        <div
          onClick={() => props.removeQuery(props.index)}
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Tooltip title={"Remove"}>
            <DeleteOutline style={{ fontSize: 20 }} />
          </Tooltip>
        </div>
      </Grid>
    </Grid>
  );
};

export default Filter;
