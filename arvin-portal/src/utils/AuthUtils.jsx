import React from "react";
import Cookies from "universal-cookie";
import jwt from "jwt-decode";
import { withRouter } from "./WithRouter";
const cookies = new Cookies();

const AuthUtils = (props) => {
  let location = props.router.location;
  React.useEffect(() => {
    // const userAccount = localStorage.getItem("u");
    const token = cookies.get("jwt_authorization");
    if (token == undefined) {
      props.logout();
    }
  }, [location]);
  return <div></div>;
};
export default withRouter(AuthUtils);
