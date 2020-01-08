import React, { useState, useEffect } from "react";
import Select from "react-select";
import InputError from "./error.jsx";

const KillerConditionSelect = props => {
  const { t, name, selected_option } = props;
  const [killer_condition, setKillerCondition] = useState(
    props.killer_condition
  );

  const label =
    selected_option === "multiple_option"
      ? "killer_condition_multiple"
      : "killer_condition";

  useEffect(() => {
    setKillerCondition(props.killer_condition);
  }, [props.killer_condition]);

  const validOptions = selected_option => {
    const killer_condition_types = [
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
        value: "between?",
        label: t("questions.select_options.killer_condition_types.between")
      },
      {
        value: "are_options?",
        label: t("questions.select_options.killer_condition_types.are_options")
      },
      {
        value: "some_option?",
        label: t("questions.select_options.killer_condition_types.some_option")
      },
    ];
    let options = [];

    switch (selected_option) {
      case "date":
        options = "<=";
        break;
      case "boolean":
      case "string":
        options = "==";
        break;
      case "currency":
      case "int":
      case "range":
        options = ["between?", "not_between?"];
        break;
      case "option":
      case "multiple_option":
        options = [
          "are_options?",
          "some_option?",
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

    if(props.selected_option === "multiple_option" || props.selected_option === "option") {
      return (
        <div className="form-group flex-fill px-3">
          <label htmlFor="" className="label-bold">
            {t(`questions.attributes.${label}`)}
          </label>
          <Select
            onChange={handleKillerValue}
            options={options}
            value={value}
            name={`${name}[killer_condition]`}
            placeholder={t("questions.action.select")}
          />
          <InputError attr="killer_condition" errors={props.question.errors} />
        </div>
      );
    }
    else {
      return(
        <input type="hidden" name={`${name}[killer_condition]`} value={props.killer_condition} />
      )
    }
  };

  const handleKillerValue = selectedOption => {
    const option = selectedOption.value;
    props.handleChangeStatus("killer_condition", option);
    setKillerCondition(option);
  };

  return (
    drawKillerCondition()
  );
};

export default KillerConditionSelect;
