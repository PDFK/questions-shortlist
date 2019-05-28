import React from 'react';

class InputError extends React.Component {
  constructor(props) {
    super(props);
    this.drawErrors = this.drawErrors.bind(this);
  }

  drawErrors() {
    const attr = this.props.attr;
    const errors = this.props.errors || {};
    const with_errors = errors.hasOwnProperty(attr);
    if(with_errors) {
      return(
        <div className="has-error">
          {
            errors[attr].map(function (error, index) {
              return (
                <span key={ `${attr}-${index}` } className="help-block mr-1">{ error }</span>
              )
            })
          }
        </div>
      )
    }
    else{
      return null;
    }
  }

  render() {
    return (
        this.drawErrors()
    )
  }
};

export default InputError;
