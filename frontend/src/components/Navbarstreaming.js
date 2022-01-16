import React from "react";
import { NavLink } from "react-router-dom";

const Navbarstreaming = () => {
  return (
    <div className="ui two item menu">
      <NavLink to="/streaming/tweets" className="item">
        New Tweets
      </NavLink>
      <NavLink to="/streaming/rules" className="item">
        Manage Rules
      </NavLink>
    </div>
  );
};

export default Navbarstreaming;
