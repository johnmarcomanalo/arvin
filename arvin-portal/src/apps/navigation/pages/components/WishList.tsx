import {
  Grid,
  Card,
  CardContent,
  Chip,
  Typography,
  Box,
  CardActionArea,
} from "@mui/material";
import { Rating } from "react-simple-star-rating";
import React from "react";
import { capitalize } from "../../../../../utils/HelperUtils";
import NavigationHooks from "../../hooks/NavigationHooks";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import moment from "moment";
import CardServiceWishList from "../../../../../components/card/CardServiceWishList";
import HomeAppWorkHooks from "../../../home/hooks/HomeAppWorkHooks";
const WishList = (props: any) => {
  const { ...navigation } = NavigationHooks(props);
  const { ...homeAppWork } = HomeAppWorkHooks(props);
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        {navigation?.wishlist?.map((val: any, index: any) => {
          return (
            <Grid item xs={12} md={4}>
              <CardServiceWishList
                {...val.service}
                handleClick={() => homeAppWork.onOpenServiceModal(val.service)}
                handleClickDelete={() => navigation.deleteSelectedWishList(val)}
              />
            </Grid>
          );
        })}
      </Grid>
    </React.Fragment>
  );
};

export default WishList;
