import React from "react";

export const Rule = ({ data, onRuleDelete }) => {
  return (
    <div className="ui segment">
      <div className="ui label">rule: {data.value}</div>
      <button
        className="ui right floated negative button"
        onClick={() => onRuleDelete(data.id)}
      >
        Delete
      </button>
    </div>
  );
};

export default Rule;
