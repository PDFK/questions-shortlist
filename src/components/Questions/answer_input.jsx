import React from "react";
import Select from "react-select";
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
    const { t, selected_option } = this.props;
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
        const currency_value = Array.isArray(value)
          ? value[0] !== ""
            ? value[0]
            : value[1]
          : value;
        return (
          <CurrencyInput
            value={currency_value}
            precision="0"
            prefix="$"
            thousandSeparator="."
            onChangeEvent={this.handleInputChange}
            className="form-control"
          />
        );
      case "range":
      case "int":
        const int_value = Array.isArray(value)
          ? value[0] != ""
            ? value[0]
            : value[1]
          : value;
        return (
          <div className="col-sm-5 pr-0">
            <input
              onChange={this.handleInputChange}
              value={int_value}
              className="form-control"
              type="number"
              min="0"
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
              placeholder={t("questions.action.select")}
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
      case "option":
      case "multiple_option":
        const options = this.state.options;
        const is_multi = selected_option === "multiple_option";
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
              placeholder={t("questions.action.select")}
              noOptionsMessage={() => t("questions.action.no_options")}
            />
          </div>
        );
      case "audio":
        return null;
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
    Array.isArray(value) ? value.map(a => a.value).join(";") : value.value;

    this.setState({ answer: value });
  }

  handleInputChange(event) {
    let input = event.target;
    this.setState({ answer: input.value });
  }

  handleOptionsChange(value) {
    this.setState({ options: value });
  }

  evaluateRange(killer_value, value) {
    const min = killer_value[0].replace(/[\$,\.]/gi, "");
    const max = killer_value[1].replace(/[\$,\.]/gi, "");
    const answer = value.replace(/[\$,\.]/gi, "");
    let condition = false;

    if (min != "" && max != "") {
      condition =
        _.inRange(Number(answer), Number(min), Number(max) + 1) &&
        Number(min) < Number(max);
    } else if (min != "") {
      condition = eval(`${Number(min)} <= ${Number(answer)}`);
    } else if (max != "") {
      condition = eval(`${Number(max)} >= ${Number(answer)}`);
    }
    return condition;
  }

  evaluateAnswer(value) {
    const { killer_condition, selected_option, killer_value } = this.props;
    switch (selected_option) {
      case "currency":
      case "range":
      case "int":
        const answer = Array.isArray(value)
          ? value[0] != ""
            ? value[0]
            : value[1]
          : value;
        const condition = this.evaluateRange(killer_value, answer);
        return condition;
      case "boolean":
        return eval(
          `'${value.value}' ${killer_condition} '${killer_value.value}'`
        );
      case "date":
        const answer_date = Date.parse(value);
        const killer_date = Date.parse(killer_value);
        return eval(`${answer_date} ${killer_condition} ${killer_date}`);
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
          _.intersection(kv_set, answer_set).toString() === kv_set.toString()
        );
      case "arent_options?":
        return (
          _.intersection(kv_set, answer_set).toString() !== kv_set.toString()
        );
      case "some_option?":
      case "is_option?":
        return !!_.intersection(answer_set, kv_set).length;
      case "isnt_option?":
        return !_.intersection(answer_set, kv_set).length;
      default:
        return false;
    }
  }

  drawIsCorrect() {
    const { t } = this.props;
    if (String(this.state.answer).trim() !== "") {
      const correct = this.evaluateAnswer(this.state.answer);
      const icon = correct ? "up" : "down";
      const color = correct ? "success" : "danger";
      const text_helper = correct ? "approved" : "discarded";

      return (
        <span
          className={`small font-weight-bold text-${color}`}
          title={text_helper}
        >
          <i className={`fa far fa-thumbs-${icon} mr-2`} />
          {t(`questions.html_helpers.answer_preview.state.${text_helper}`)}
        </span>
      );
    } else {
      return null;
    }
  }

  resetValues() {
    this.setState({ killer_value: "", answer: "", options: [] });
  }

  drawHelpText() {
    const { killer_condition, killer_value, t } = this.props;
    let text = "";
    let info = "";

    switch (killer_condition) {
      case "<=":
        text = t(
          "questions.select_options.killer_condition_types.less_than_or_equal_to"
        );
        info = "info";
        break;
      case "==":
        text = t("questions.select_options.killer_condition_types.equal");
        info = "info";
        break;
      case "between?":
        const min = killer_value[0].replace(/[\$,\.]/gi, "");
        const max = killer_value[1].replace(/[\$,\.]/gi, "");

        if (min != "" && max != "") {
          text = t("questions.select_options.killer_condition_types.between");
          info = "info_2";
        } else if (min != "") {
          text = t(
            "questions.select_options.killer_condition_types.greater_than_or_equal"
          );
          info = "info";
        } else if (max != "") {
          text = t(
            "questions.select_options.killer_condition_types.less_than_or_equal_to"
          );
          info = "info";
        }

        break;
      case "are_options?":
        text = t("questions.select_options.killer_condition_types.are_options");
        info = "info_3";
        break;
      case "some_option?":
        text = t("questions.select_options.killer_condition_types.some_option");
        info = "info_3";
        break;
      default:
        text = t("questions.select_options.killer_condition_types.equal");
        info = "info";
        break;
    }

    return (
      <small
        dangerouslySetInnerHTML={{
          __html: t(`questions.html_helpers.answer_preview.${info}`, {
            v: text
          })
        }}
      ></small>
    );
  }

  drawExampleQuestion() {
    const { killer_value, killer_condition, t } = this.props;
    if (
      killer_condition.trim() !== "" &&
      String(killer_value).trim() !== "" &&
      this.props.disposable
    ) {
      return (
        <div className="card-footer">
          <div className="form-group">
            <p className="text-muted mb-2">{this.drawHelpText()}</p>
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
