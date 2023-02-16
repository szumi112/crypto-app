import React from "react";

const CoinSearchBar = ({ name, id }) => {
  return (
    <div className="searchbarComponent" key={id}>
      <p>{name}</p>
      <span className="searchbarSuggestionAdd">+</span>
    </div>
  );
};

export default CoinSearchBar;
