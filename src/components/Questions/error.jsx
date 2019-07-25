import React from "react";

const InputError = props => {
  const attr = props.attr;
  const errors = props.errors || {};
  const withErrors = errors.hasOwnProperty(attr);
  if (withErrors) {
    return (
      <div className="has-error">
        {errors[attr].map(function(error, index) {
          return (
            <span
              key={`${attr}-${index}`}
              className="help-block mr-1 invalid-feedback"
              style={{ display: "block" }}
            >
              {error}
            </span>
          );
        })}
      </div>
    );
  } else {
    return null;
  }
};

export default InputError;
