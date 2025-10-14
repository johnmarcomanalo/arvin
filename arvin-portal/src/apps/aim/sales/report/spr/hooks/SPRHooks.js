import { Description } from "@mui/icons-material";
import { cancelRequest } from "api/api";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";

const SPRHooks = (props) => {
  const warehouse = [
    { description: "BACOLOD" },
    { description: "CEBU" },
    { description: "ILOILO" },
    { description: "TABACO" },
    { description: "DAVAO" },
    { description: "GENSAN" },
    { description: "ZAMBO" },
    { description: "CAGAYAN" },
    { description: "ILIGAN" },
    { description: "MINDORO" },
    { description: "SURIGAO" },
  ];
  const spr_data = useSelector((state) => state.SalesDailyOutReducer.spr);
  React.useEffect(() => {
    props.initialize({
      warehouse: "",
      date_start: moment(new Date()).format("YYYY-MM-DD"),
      date_end: moment(new Date()).format("YYYY-MM-DD"),
    });
    return () => cancelRequest();
  }, []);
  return {
    warehouse,
    spr_data,
  };
};

export default SPRHooks;
