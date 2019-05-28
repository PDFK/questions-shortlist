import React from 'react';
import Select from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable';
import CurrencyInput from 'react-currency-input';
import InputError from './error.jsx';

class KillerValueInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: props.question.options || [],
      killer_value: props.question.killer_value,
      killer_value_multiple: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOptionsChange = this.handleOptionsChange.bind(this);
    this.handleKillerValueChange = this.handleKillerValueChange.bind(this);
    this.validOptions = this.validOptions.bind(this);
    this.handleInputRangeChange = this.handleInputRangeChange.bind(this);
  }

  drawKillerValue() {
    const value = this.state.killer_value;
    const {t,selected_option,name} = this.props;
    const boolean_options = [
                              {value: t("questions.html_helpers.boolean_option.positive"), label: t("questions.html_helpers.boolean_option.positive")},
                              {value: t("questions.html_helpers.boolean_option.negative"), label: t("questions.html_helpers.boolean_option.negative")}
                            ];
    const customStyles = {
      // none of react-select's styles are passed to <Control />
      width: 'calc(100% - 42px)',
    }

    switch(selected_option) {
      case "currency":
        return <CurrencyInput value={ value } precision="0" prefix="$" thousandSeparator="," onChangeEvent={this.handleInputChange} className="form-control" name={ `${name}[killer_value]` } />
      case "range":
          return (
          <div  style={ customStyles }>
            <input onChange={ this.handleInputRangeChange } data-edge="initial" value={ value[0] || 0  } className="form-control" type="number" min="0" placeholder={ t("questions.html_helpers.range_option.initial") } />
            <input onChange={ this.handleInputRangeChange } data-edge="final" value={ value[1]  || 1 } className="form-control" type="number" min={ value[0] } placeholder={ t("questions.html_helpers.range_option.final") } />
            <input type="hidden" name={ `${name}[killer_value]` } value={ value }/>
          </div>
          )
      case "boolean":
          return (
            <div style={ customStyles }>
              <Select options={ boolean_options }  value={ value }  onChange={ this.handleKillerValueChange } name={ `${name}[killer_value]` } />
            </div>
          )
      case "date":
        return <input onChange={ this.handleInputChange } value={ value } className="form-control" type="date" name={ `${name}[killer_value]` } />
      case "int":
          return <input onChange={ this.handleInputChange } value={ value } className="form-control" type="number"  name={ `${name}[killer_value]` } />
      case "option":
      case "multiple_option":
          const options = this.state.options;
          const multiple = selected_option == "multiple_option";
          return (
            <div style={ customStyles }>
              <Select isMulti={ multiple } ref={'inputSelect'} options={ options } value={ this.validOptions(value) } onChange={ this.handleKillerValueChange } />
              <input type="hidden" name={ `${name}[killer_value]` } value={ this.state.killer_value_multiple }/>
            </div>
          )
      default:
          return <input onChange={ this.handleInputChange } value={ value } className="form-control" type="text"  name={ `${name}[killer_value]` } />
    }
  }

  validOptions(value) {
    const killer_value = Array.isArray(value) ? value : typeof value === "object" ? [value] : [];
    const options = this.state.options.map(function(option){ return option.value });
    const valid_options = killer_value.filter(function(item){
      return options.includes(item.value)
    }) || [];
    return valid_options;
  }

  componentDidMount() {
    const killer_value_multiple = Array.isArray(this.state.killer_value) ? this.state.killer_value.map(a => a.value).join(";") : this.state.killer_value.value;
    if((this.props.selected_option == "option" || this.props.selected_option == "multiple_option") && typeof killer_value_multiple != "undefined")
      this.setState({killer_value_multiple: killer_value_multiple });
  }

  handleKillerValueChange(value) {
    const killer_value_multiple = Array.isArray(value) ? value.map(a => a.value).join(";") : value.value;

    if (typeof killer_value_multiple != "undefined"){
      this.setState({killer_value: value, killer_value_multiple: killer_value_multiple });
    }
  }

  handleInputChange(event) {
    let input = event.target;
    this.setState({killer_value: input.value});
  }

  handleInputRangeChange(event) {
    let killer_value = this.state.killer_value || [0,1];
    const input = event.target;
    const edge = event.target.getAttribute("data-edge") == "initial" ? 0 : 1;

    killer_value[edge] = input.value;
    this.setState({killer_value: killer_value});
  }

  handleOptionsChange(value) {
    this.setState({options: value});
  }

  drawOptionsInput() {
    let options = this.state.options || [];
    let selected_option = this.props.selected_option;
    const {t,name} = this.props;

    if(selected_option == "option" || selected_option == "multiple_option") {
      return(
        <div className="question-options">
          <label htmlFor="" className="label-bold">{ t("questions.attributes.options") }</label>
          <CreatableSelect
            isMulti
            options={ options }
            value={ options }
            className=""
            onChange={ this.handleOptionsChange }
            name={ `${name}[options][]` }
          />
          <InputError attr="options" errors={ this.props.question.errors } />
        </div>
      )
    }
    else{
      return null;
    }
  }

  render() {
    var selected_option = this.props.selected_option;
    var text_helper = (selected_option == "string" || selected_option == "boolean") ? "default" : selected_option;
    const {t} = this.props;
    const label = this.props.selected_option == "multiple_option" ? "killer_value_multiple" : "killer_value";

    return (
      <div className="form-group col-sm-3">
        { this.drawOptionsInput() }
        <label htmlFor="" className="label-bold">{ t(`questions.attributes.${label}`) }</label>
        <div className="input-group">
          { this.drawKillerValue() }
          <div className="input-group-append">
            <span className="input-group-text" title={ t(`questions.html_helpers.types.${text_helper}`) }>
              <i className="fas fa-info-circle"></i>
            </span>
          </div>
        </div>
        <InputError attr="killer_value" errors={ this.props.question.errors } />
      </div>
    );
  }
};

export default KillerValueInput;
