import React from "react";
import Select from "react-select";
import InputError from "./error.jsx";

class KillerConditionSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      killer_condition: props.question.killer_condition || ""
    };
    this.handleKillerValue = this.handleKillerValue.bind(this);
  }

  validOptions(selected_option) {
    const { t } = this.props;
    const killer_condition_types = [
      {
        value: "<",
        label: t("questions.select_options.killer_condition_types.smaller_than")
      },
      {
        value: "<=",
        label: t(
          "questions.select_options.killer_condition_types.less_than_or_equal_to"
        )
      },
      {
        value: "==",
        label: t("questions.select_options.killer_condition_types.equal")
      },
      {
        value: "!=",
        label: t("questions.select_options.killer_condition_types.distinct")
      },
      {
        value: ">",
        label: t("questions.select_options.killer_condition_types.greater_than")
      },
      {
        value: ">=",
        label: t(
          "questions.select_options.killer_condition_types.greater_than_or_equal"
        )
      },
      {
        value: "between?",
        label: t("questions.select_options.killer_condition_types.between")
      },
      {
        value: "not_between?",
        label: t("questions.select_options.killer_condition_types.not_between")
      },
      {
        value: "is_option?",
        label: t("questions.select_options.killer_condition_types.is_option")
      },
      {
        value: "isnt_option?",
        label: t("questions.select_options.killer_condition_types.isnt_option")
      },
      {
        value: "are_options?",
        label: t("questions.select_options.killer_condition_types.are_options")
      },
      {
        value: "arent_options?",
        label: t(
          "questions.select_options.killer_condition_types.arent_options"
        )
      },
      {
        value: "some_option?",
        label: t("questions.select_options.killer_condition_types.some_option")
      },
      {
        value: "none_choice?",
        label: t("questions.select_options.killer_condition_types.none_choice")
      }
    ];
    var options = [];

    switch (selected_option) {
      case "currency":
      case "date":
      case "int":
        options = ["<", "<=", "==", "!=", ">", ">="];
        break;
      case "boolean":
      case "string":
        options = ["==", "!="];
        break;
      case "range":
        options = ["between?", "not_between?"];
        break;
      case "option":
        options = ["is_option?", "isnt_option?"];
        break;
      case "multiple_option":
        options = [
          "are_options?",
          "arent_options?",
          "some_option?",
          "none_choice?"
        ];
        break;
      default:
        options = [];
    }

    var valid_options =
      killer_condition_types.filter(function(item) {
        return options.includes(item.value);
      }) || [];

    return valid_options;
  }

  drawKillerCondition() {
    const killer_condition = this.state.killer_condition;
    const options = this.validOptions(this.props.selected_option);
    const {name, t} = this.props;

    let value =
      options.find(function(item) {
        return item.value == killer_condition;
      }) || [];

    return (
      <Select
        className=""
        onChange={this.handleKillerValue}
        options={options}
        value={value}
        name={`${name}[killer_condition]`}
        placeholder= {t("questions.action.select")}
      />
    );
  }

  handleKillerValue(selectedOption) {
    var option = selectedOption.value;
    this.props.handleChangeStatus("killer_condition", option);
    this.setState({ killer_condition: option });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.killer_condition !== prevState.killer_condition) {
      return { killer_condition: nextProps.killer_condition };
    } else return null;
  }

  render() {
    const { t } = this.props;
    const label =
      this.props.selected_option == "multiple_option"
        ? "killer_condition_multiple"
        : "killer_condition";
    return (
      <div className="form-group">
        <label htmlFor="" className="label-bold">
          {t(`questions.attributes.${label}`)}
        </label>
        {this.drawKillerCondition()}
        <InputError
          attr="killer_condition"
          errors={this.props.question.errors}
        />
      </div>
    );
  }
}

export default KillerConditionSelect;
