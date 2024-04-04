export const required = (v: any) => {
  if (!v || v === "") {
    return "This field is required";
  }
};
