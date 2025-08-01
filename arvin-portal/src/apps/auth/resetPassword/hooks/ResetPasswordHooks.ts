import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptoJSAesDecrypt } from "../../../../utils/Encryption";

const ResetPasswordHooks = (props: any) => {
  const [state, setState] = useState({
    minUpperCase: false,
    minLowerCase: false,
    minNumber: false,
    minSymbol: false,
    minLength: false,
    match: false,
  });
  const { id } = useParams();
  const [pwdInput, initValue] = useState({
    password: "",
  });
  useEffect(() => {
    const user_id = CryptoJSAesDecrypt(String(id));
    props.initialize({ id: user_id });
  }, []);
  useEffect(() => {
    let match = false;
    if (
      props?.password != undefined &&
      props?.password != undefined &&
      props?.password === props?.confirm_password
    ) {
      match = true;
    }
    setState((prev) => ({
      ...prev,
      match: match,
    }));
  }, [props?.confirm_password, props?.password]);
  const [isError, setError] = useState("");
  const onChange = (e: any) => {
    let password = e.target.value;
    initValue({
      ...pwdInput,
      password: e.target.value,
    });
    setError("");
    let caps, small, num, specialSymbol;
    let minLength = false;
    if (password.length >= 8) {
      minLength = true;
    } else {
      minLength = false;
    }
    caps = (password.match(/[A-Z]/g) || []).length;
    small = (password.match(/[a-z]/g) || []).length;
    num = (password.match(/[0-9]/g) || []).length;
    specialSymbol = (password.match(/\W/g) || []).length;
    let minUpperCase = false;
    let minLowerCase = false;
    let minNumber = false;
    let minSymbol = false;

    if (caps >= 1) {
      minUpperCase = true;
    } else {
      minUpperCase = false;
    }
    if (small >= 1) {
      minLowerCase = true;
    } else {
      minLowerCase = false;
    }
    if (num >= 1) {
      minNumber = true;
    } else {
      minNumber = false;
    }
    if (specialSymbol >= 1) {
      minSymbol = true;
    } else {
      minSymbol = false;
    }
    setState((prev) => ({
      ...prev,
      minUpperCase: minUpperCase,
      minLowerCase: minLowerCase,
      minNumber: minNumber,
      minSymbol: minSymbol,
      minLength: minLength,
    }));
  };
  return { onChange, isError, ...state };
};

export default ResetPasswordHooks;
