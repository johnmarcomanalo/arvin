import Cookies from "universal-cookie";
import React from "react";

const cookies = new Cookies();
export const isExist = (value: any) => {
  return value !== null && typeof value !== "undefined" ? true : false;
};
export const jwtAuth = () => {
  const token = cookies.get("jwt_authorization");
  if (token == undefined) {
    //Clear the credentials
    localStorage.clear();
    window.location.reload();
  }
  return token;
};
export const capitalize = (word: string) => {
  const spliceword = String(word).split(" ");
  let complete = "";
  spliceword.forEach((val, index) => {
    let newWord = String(val);
    if (newWord) {
      if (index > 0) {
        complete += " ";
      }
      newWord = newWord[0].toUpperCase() + newWord.slice(1).toLowerCase();
    }
    complete += newWord;
  });
  return complete;
};
export const useDebounce = (value: any, delay: any) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export const formatNumber = (num: any) => {
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};
