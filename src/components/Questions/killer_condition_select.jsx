import React, { useState } from "react";
import Select from "react-select";
import InputError from "./error.jsx";

const KillerConditionSelect = props => {
  const { t, name, selected_option } = props;
  const [killer_condition, setKillerCondition] = useState(
    props.question.killer_condition
  );
  const [prev_killer_condition, setPrevKillerCondition] = useState(null);
  const label =
    selected_option === "multiple_option"
      ? "killer_condition_multiple"
      : "killer_condition";

  if (killer_condition !== prev_killer_condition) {
    setPrevKillerCondition(killer_condition);
  }

  const validOptions = selected_option => {
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
    let options = [];

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

    const valid_options =
      killer_condition_types.filter(item => {
        return options.includes(item.value);
      }) || [];

    return valid_options;
  };

  const drawKillerCondition = () => {
    const options = validOptions(props.selected_option);

    const value =
      options.find(item => {
        return item.value === killer_condition;
      }) || [];

    return (
      <Select
        className=""
        onChange={handleKillerValue}
        options={options}
        value={value}
        name={`${name}[killer_condition]`}
        placeholder={t("questions.action.select")}
      />
    );
  };

  const handleKillerValue = selectedOption => {
    const option = selectedOption.value;
    props.handleChangeStatus("killer_condition", option);
    setKillerCondition(option);
  };

  return (
    <div className="form-group">
      <label htmlFor="" className="label-bold">
        {t(`questions.attributes.${label}`)}
      </label>
      {drawKillerCondition()}
      <InputError attr="killer_condition" errors={props.question.errors} />
    </div>
  );
};

export default KillerConditionSelect;
