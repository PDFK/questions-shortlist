import React from "react";
import Select from "react-select";
import CreatableSelect from "react-select/lib/Creatable";
import CurrencyInput from "react-currency-input";
import InputError from "./error.jsx";
import * as commonFunctions from "./common.js";

class KillerValueInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: props.question.options || [],
      killer_value: props.question.killer_value,
      killer_value_multiple: [],
      enable_min: true,
      enable_max: true,
      range_error: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOptionsChange = this.handleOptionsChange.bind(this);
    this.handleKillerValueChange = this.handleKillerValueChange.bind(this);
    this.resetValues = this.resetValues.bind(this);
    this.handleInputRangeChange = this.handleInputRangeChange.bind(this);
  }

  drawKillerValue() {
    const value = this.state.killer_value;
    const { t, selected_option, name, disposable } = this.props;
    const boolean_options = [
      {
        value: t("questions.html_helpers.boolean_option.positive"),
        label: t("questions.html_helpers.boolean_option.positive")
      },
      {
        value: t("questions.html_helpers.boolean_option.negative"),
        label: t("questions.html_helpers.boolean_option.negative")
      }
    ];
    const customStyles = {
      // none of react-select's styles are passed to <Control />
      width: "calc(100% - 42px)"
    };
    const text_helper =
      selected_option === "string" || selected_option === "boolean"
        ? "default"
        : selected_option;

    if (disposable) {
      switch (selected_option) {
        case "currency":
          return (
            <div className="row">
              <div className="col">
                <div className="input-group">
                  {this.drawLabelInput(text_helper, "enable_min")}
                  <CurrencyInput
                    allowEmpty={true}
                    disabled={!this.state.enable_min}
                    value={value[0] || ""}
                    data-edge="initial"
                    precision="0"
                    prefix="$"
                    thousandSeparator="."
                    onChangeEvent={this.handleInputRangeChange}
                    className={`form-control ${
                      this.state.range_error ? "is-invalid" : ""
                    }`}
                    name={`${name}[killer_value]`}
                    placeholder={t(
                      "questions.html_helpers.range_option.initial"
                    )}
                  />
                  {this.drawEnableInput("enable_min")}
                </div>
                {this.drawHelperText("min")}
              </div>
              <div className="col">
                <div className="input-group">
                  {this.drawLabelInput(text_helper, "enable_max")}
                  <CurrencyInput
                    allowEmpty={true}
                    disabled={!this.state.enable_max}
                    value={value[1]}
                    data-edge="final"
                    precision="0"
                    prefix="$"
                    thousandSeparator="."
                    onChangeEvent={this.handleInputRangeChange}
                    className={`form-control ${
                      this.state.range_error ? "is-invalid" : ""
                    }`}
                    name={`${name}[killer_value]`}
                    placeholder={t("questions.html_helpers.range_option.final")}
                  />
                  {this.drawEnableInput("enable_max")}
                </div>
                {this.drawHelperText("max")}
              </div>
              <input
                type="hidden"
                name={`${name}[killer_value]`}
                value={value || "0,0"}
              />
            </div>
          );
        case "date":
          return (
            <div className="input-group">
              <input
                onChange={this.handleInputChange}
                value={value}
                className="form-control"
                type="date"
                name={`${name}[killer_value]`}
              />
              {this.drawLabelInput(text_helper)}
            </div>
          );
        case "int":
          return (
            <div className="row">
              <div className="col">
                <div className="input-group">
                  {this.drawLabelInput(text_helper, "enable_min")}
                  <input
                    onChange={this.handleInputRangeChange}
                    disabled={!this.state.enable_min}
                    data-edge="initial"
                    value={value[0]}
                    className={`form-control ${
                      this.state.range_error ? "is-invalid" : ""
                    }`}
                    type={
                      selected_option == "int" || selected_option == "range"
                        ? "number"
                        : selected_option
                    }
                    min="0"
                    placeholder={t(
                      "questions.html_helpers.range_option.initial"
                    )}
                  />
                  {this.drawEnableInput("enable_min")}
                </div>
                {this.drawHelperText("min")}
              </div>
              <div className="col">
                <div className="input-group">
                  {this.drawLabelInput(text_helper, "enable_max")}
                  <input
                    onChange={this.handleInputRangeChange}
                    data-edge="final"
                    disabled={!this.state.enable_max}
                    value={value[1]}
                    className={`form-control ${
                      this.state.range_error ? "is-invalid" : ""
                    }`}
                    type={
                      selected_option == "int" || selected_option == "range"
                        ? "number"
                        : selected_option
                    }
                    min={value[0]}
                    placeholder={t("questions.html_helpers.range_option.final")}
                  />
                  {this.drawEnableInput("enable_max")}
                </div>
                {this.drawHelperText("max")}
              </div>
              <input
                type="hidden"
                name={`${name}[killer_value]`}
                value={value}
              />
            </div>
          );
        case "boolean":
          return (
            <div className="input-group">
              <div style={customStyles} className="input-group">
                <Select
                  className="w-100"
                  options={boolean_options}
                  value={value}
                  onChange={this.handleKillerValueChange}
                  name={`${name}[killer_value]`}
                />
              </div>
              {this.drawLabelInput(text_helper)}
            </div>
          );
        case "option":
        case "multiple_option":
          const options = this.state.options;

          return (
            <div className="input-group">
              <div style={customStyles} className="input-group">
                <Select
                  isMulti={true}
                  ref={"inputSelect"}
                  options={options}
                  value={commonFunctions.validOptions(value, this)}
                  onChange={this.handleKillerValueChange}
                  placeholder={t("questions.action.select")}
                  noOptionsMessage={() => t("questions.action.no_options")}
                  className="w-100"
                />
                <input
                  type="hidden"
                  name={`${name}[killer_value]`}
                  value={this.state.killer_value_multiple}
                />
              </div>
              {this.drawLabelInput(text_helper)}
            </div>
          );
        default:
          return (
            <div className="input-group">
              <input
                onChange={this.handleInputChange}
                value={value}
                className="form-control"
                type="text"
                name={`${name}[killer_value]`}
              />
              {this.drawLabelInput(text_helper)}
            </div>
          );
      }
    }
  }

  componentDidMount() {
    const { killer_value } = this.state || ["0", "0"];
    const killer_value_multiple = Array.isArray(killer_value)
      ? killer_value.map(a => a.value).join(";")
      : killer_value.value;
    if (
      (this.props.selected_option === "option" ||
        this.props.selected_option === "multiple_option") &&
      typeof killer_value_multiple !== "undefined"
    )
      this.setState({ killer_value_multiple: killer_value_multiple });
  }

  handleKillerValueChange(value) {
    const killer_value_multiple = Array.isArray(value)
      ? value.map(a => a.value).join(";")
      : value.value;

    if (typeof killer_value_multiple !== "undefined") {
      this.setState({
        killer_value: value,
        killer_value_multiple: killer_value_multiple
      });
    }
    // value.map(function(obj,i) { return obj.value })
    this.props.handleChangeStatus("killer_value", value);
  }

  resetValues() {
    this.setState({ killer_value: "", killer_value_multiple: "", options: [] });
  }

  handleEnableInputs(input) {
    const edge = input === "enable_min" ? 0 : 1;
    let killer_value = this.state.killer_value || ["0", "0"];

    killer_value[edge] = !this.state[input] ? "0" : "";
    this.setState({
      [input]: !this.state[input],
      killer_value: killer_value,
      range_error: this.validateRangeInput(killer_value)
    });
    this.props.handleChangeStatus("killer_value", killer_value);
  }

  handleInputChange(event) {
    let input = event.target;
    this.setState({ killer_value: input.value });
    this.props.handleChangeStatus("killer_value", input.value);
  }

  handleInputRangeChange(event) {
    let killer_value = this.state.killer_value || ["0", "0"];
    const input = event.target;
    const edge = event.target.getAttribute("data-edge") === "initial" ? 0 : 1;

    killer_value[edge] = input.value;

    const range_error = this.validateRangeInput(killer_value);
    this.setState({ killer_value: killer_value, range_error: range_error });
    this.props.handleChangeStatus("killer_value", killer_value);
  }

  validateRangeInput(killer_value) {
    if (this.state.enable_min && this.state.enable_max) {
      const min = killer_value[0].replace(/[\$,\,]/gi, "");
      const max = killer_value[1].replace(/[\$,\,]/gi, "");

      return parseFloat(min) >= parseFloat(max);
    }
    return false;
  }

  handleOptionsChange(value) {
    this.setState({ options: value });
    this.props.handleChangeStatus("options", value);
  }

  drawHelperText(enabled) {
    const option = !this.state[`enable_${enabled}`] ? "disabled" : "enabled";
    const { t } = this.props;
    return (
      <span className="text-danger">
        {t(`questions.html_helpers.${option}.${enabled}`)}
      </span>
    );
  }

  drawEnableInput(enabled) {
    return (
      <div className="input-group-prepend">
        <div className="input-group-text">
          <input
            type="checkbox"
            onChange={this.handleEnableInputs.bind(this, enabled)}
            checked={this.state[enabled]}
            aria-label="Checkbox for following text input"
          />
        </div>
      </div>
    );
  }

  drawLabelInput(text_helper, enabled) {
    const { t } = this.props;
    const text = enabled
      ? t(`questions.html_helpers.${enabled}`)
      : "<i class='fas fa fa-info-circle' />";
    return (
      <div className="input-group-append">
        <a
          className="input-group-text tooltip-info"
          title={t(`questions.html_helpers.types.${text_helper}`)}
          data-toggle="tooltip"
          data-placement="top"
          dangerouslySetInnerHTML={{ __html: text }}
        ></a>
      </div>
    );
  }

  drawOptionsInput() {
    let options = this.state.options || [];
    let selected_option = this.props.selected_option;
    const { t, name } = this.props;
    const customStyles = {
      // none of react-select's styles are passed to <Control />
      width: "calc(100% - 42px)"
    };
    if (selected_option === "option" || selected_option === "multiple_option") {
      return (
        <div className="input-group">
          <label htmlFor="" className="label-bold">
            {t("questions.attributes.options")}
          </label>
          <div style={customStyles} className="question-options input-group">
            <CreatableSelect
              isMulti
              options={options}
              value={options}
              className=""
              onChange={this.handleOptionsChange}
              name={`${name}[options][]`}
              placeholder={t("questions.action.no_options")}
              noOptionsMessage={() => t("questions.action.no_options")}
              className="w-100"
            />
          </div>
          {this.drawLabelInput("default")}
          <InputError attr="options" errors={this.props.question.errors} />
        </div>
      );
    } else {
      return null;
    }
  }

  drawLabel() {
    const { t, selected_option, disposable } = this.props;
    const label =
      selected_option === "multiple_option" || selected_option === "option"
        ? "killer_value_multiple"
        : "killer_value";

    if (disposable) {
      return (
        <label htmlFor="" className="label-bold">
          {t(`questions.attributes.${label}`)}
        </label>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="form-group flex-fill px-3">
        {this.drawOptionsInput()}
        {this.drawLabel()}
        {this.drawKillerValue()}
        <InputError attr="killer_value" errors={this.props.question.errors} />
      </div>
    );
  }
}

export default KillerValueInput;
