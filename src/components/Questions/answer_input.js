import React from "react";
import Select from "react-select";
import CreatableSelect from "react-select/lib/Creatable";
import CurrencyInput from "react-currency-input";
import * as commonFunctions from "./common.js";
import _ from "lodash";

class AnswerInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: props.options || [],
      killer_value: props.killer_value,
      answer: props.killer_value,
      killer_condition: props.killer_condition
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKillerValueChange = this.handleKillerValueChange.bind(this);
    this.evaluateAnswer = this.evaluateAnswer.bind(this);
  }

  drawExampleInput() {
    const value = this.state.answer;
    const { t, selected_option, name } = this.props;
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

    switch (selected_option) {
      case "currency":
        return (
          <CurrencyInput
            value={value}
            precision="0"
            prefix="$"
            thousandSeparator=","
            onChangeEvent={this.handleInputChange}
            className="form-control"
          />
        );
      case "range":
        let answer_value = Array.isArray(value) ? value[0] : value;
        return (
          <div className="col-sm-5 pr-0">
            <input
              onChange={this.handleInputChange}
              value={answer_value}
              className="form-control"
              type="number"
              min="0"
              placeholder={t("questions.html_helpers.range_option.initial")}
            />
          </div>
        );
      case "boolean":
        return (
          <div className="col-sm-5 pr-0">
            <Select
              options={boolean_options}
              value={value}
              onChange={this.handleKillerValueChange}
              placeholder= {t("questions.action.select")}
            />
          </div>
        );
      case "date":
        return (
          <input
            onChange={this.handleInputChange}
            value={value}
            className="form-control"
            type="date"
          />
        );
      case "int":
        return (
          <input
            onChange={this.handleInputChange}
            value={value}
            className="form-control"
            type="number"
          />
        );
      case "option":
      case "multiple_option":
        const options = this.state.options;
        const is_multi = selected_option == "multiple_option" ? true : false;
        const k_value = is_multi
          ? value
          : Array.isArray(value)
          ? value[0]
          : value;
        return (
          <div className="col-sm-5 pr-0">
            <Select
              isMulti={is_multi}
              ref={"inputSelect"}
              options={options}
              value={commonFunctions.validOptions(k_value, this)}
              onChange={this.handleKillerValueChange}
              placeholder= {t("questions.action.select")}
              noOptionsMessage= {() => t("questions.action.no_options")}
            />
          </div>
        );
      default:
        return (
          <input
            onChange={this.handleInputChange}
            value={value}
            className="form-control"
            type="text"
          />
        );
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.options !== prevState.options) {
      return { options: nextProps.options };
    } else if (nextProps.killer_value !== prevState.killer_value) {
      return {
        killer_value: nextProps.killer_value,
        answer: nextProps.killer_value
      };
    } else if (nextProps.killer_condition !== prevState.killer_condition) {
      return { killer_condition: nextProps.killer_condition };
    } else return null;
  }

  handleKillerValueChange(value) {
    const killer_value_multiple = Array.isArray(value)
      ? value.map(a => a.value).join(";")
      : value.value;

    this.setState({ answer: value });
  }

  handleInputChange(event) {
    let input = event.target;
    this.setState({ answer: input.value });
  }

  handleOptionsChange(value) {
    this.setState({ options: value });
  }

  evaluateAnswer(value) {
    const { killer_condition, selected_option, killer_value } = this.props;
    switch (selected_option) {
      case "currency":
        const amount = value.replace(/[\$,\,]/gi, "");
        const question_amount = killer_value.replace(/[\$,\,]/gi, "");
        return eval(`${amount} ${killer_condition} ${question_amount}`);
      case "range":
        const condition = _.inRange(
          parseFloat(value),
          parseFloat(killer_value[0]),
          parseFloat(killer_value[1]) + 1
        );
        if (killer_condition == "between?") {
          return condition;
        } else {
          return !condition;
        }
      case "boolean":
        return eval(
          `'${value.value}' ${killer_condition} '${killer_value.value}'`
        );
      case "date":
        const answer_date = Date.parse(value);
        const killer_date = Date.parse(killer_value);
        return eval(`${answer_date} ${killer_condition} ${killer_date}`);
      case "int":
        return eval(`${value} ${killer_condition} ${killer_value}`);
      case "option":
      case "multiple_option":
        const answer_options = Array.isArray(value)
          ? value
          : typeof value === "object"
          ? [value]
          : [];
        return this.checkMultipleOption(
          killer_value,
          answer_options,
          killer_condition
        );
      default:
        return eval(`'${value}' ${killer_condition} '${killer_value}'`);
    }
  }

  formatOptions(elements) {
    const options = elements.map(function(option) {
      return option.value;
    });

    return options;
  }

  checkMultipleOption(killer_value, answer, killer_condition) {
    const kv_set = this.formatOptions(killer_value);
    const answer_set = this.formatOptions(answer);
    switch (killer_condition) {
      case "are_options?":
        return (
          _.intersection(kv_set, answer_set).toString() == kv_set.toString()
        );
      case "arent_options?":
        return (
          _.intersection(kv_set, answer_set).toString() != kv_set.toString()
        );
      case "some_option?":
      case "is_option?":
        return !!_.intersection(answer_set, kv_set).length;
      case "some_option?":
      case "isnt_option?":
        return !_.intersection(answer_set, kv_set).length;
      default:
        return false;
    }
  }

  drawIsCorrect() {
    const {t} = this.props;
    if (String(this.state.answer).trim() != "") {
      const is_wrong = this.evaluateAnswer(this.state.answer);
      const icon = is_wrong ? "down" : "up";
      const color = is_wrong ? "danger" : "success";
      const text_helper = is_wrong ? "discarded" : "approved";

      return (
        <span className={`small font-weight-bold text-${color}`} title={text_helper}>
          <i className={`far fa-thumbs-${icon} mr-2`} />
          {t(`questions.html_helpers.answer_preview.state.${text_helper}`)}
        </span>
      );
    } else {
      return null
    }
  }

  resetValues() {
    this.setState({ killer_value: "", answer: "", options: [] });
  }

  drawExampleQuestion() {
    const { killer_value, killer_condition, t } = this.props;
    if (killer_condition.trim() != "" && String(killer_value).trim() != "") {
      return (
        <div className="card-footer">
          <div className="form-group">
            <p className="text-muted mb-2">
              <small>{t("questions.html_helpers.answer_preview.info")}</small>
            </p>
            <div className="row d-flex align-items-center">
              <div className="col-sm-4 __force-text_break-word">
                <label htmlFor="" className="label-bold">
                  {this.props.description}
                </label>
              </div>
              <div className="col-sm-8">
                <div className="input-group d-flex align-items-center">
                  {this.drawExampleInput()}
                  <div className="col-sm-7">{this.drawIsCorrect()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else return null;
  }

  render() {
    return <div className="">{this.drawExampleQuestion()}</div>;
  }
}

export default AnswerInput;
