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
    { description: "ZAMBOANGA" },
    { description: "CAGAYAN" },
    { description: "ILIGAN" },
    { description: "MINDORO" },
    { description: "SURIGAO" },
  ];
  const spr_data = useSelector((state) => state.SalesDailyOutReducer.spr);

  const getLastThursdayToThisWednesday = (date = moment()) => {
    const current = moment(date);
  
    // Get this week's Wednesday
    const end = current.clone().isoWeekday(3); // Wednesday
  
    // If today is before Wednesday, use previous week's Wednesday
    if (current.isoWeekday() < 3) {
      end.subtract(7, 'days');
    }
  
    // Last week's Thursday = this week's Thursday - 7 days
    const start = end.clone().isoWeekday(4).subtract(7, 'days');
  
    return {
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
    };
  }

  React.useEffect(() => {
    props.initialize({
      warehouse: "",
      date_start: getLastThursdayToThisWednesday().start,
      date_end: getLastThursdayToThisWednesday().end,
    });
    return () => cancelRequest();
  }, []);
  return {
    warehouse,
    spr_data,
  };
};

export default SPRHooks;
