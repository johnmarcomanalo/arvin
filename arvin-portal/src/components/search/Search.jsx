import React from "react";

const Search = (props) => {
  return (
    <div className="width-100-percent padding-5px bg-color-gray-light border-radius-20px border-style-solid border-width border-color">
      <input
        {...props}
        placeholder="Search"
        className="width-100-percent bg-color-gray-light border-none outlined-none "
      />
    </div>
  );
};

export default Search;
