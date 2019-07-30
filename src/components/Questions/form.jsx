import React, { useState, useRef, memo } from "react";
import Select from "react-select";
import KillerConditionSelect from "./killer_condition_select.jsx";
import KillerValueInput from "./killer_value_input.jsx";
import InputError from "./error.jsx";
import AnswerInput from "./answer_input.jsx";
import PropTypes from "prop-types";

const QuestionForm = props => {
  const { question, deleteQuestion, t, name, with_weight } = props;
  const [value_type, setValueType] = useState(question.value_type);
  const [description, setDescription] = useState(question.description || "");
  const [killer_condition, setKillerCondition] = useState(
    question.killer_condition
  );
  const [options, setOptions] = useState(question.options || []);
  const [killer_value, setKillerValue] = useState(question.killer_value);
  const answerinputElement = useRef(null);
  const killervalueinputElement = useRef(null);

  const handleDelete = event => {
    event.preventDefault();
    deleteQuestion(question.key);
  };

  const drawValueType = () => {
    const options = [
      { value: "date", label: t("questions.select_options.value_types.date") },
      {
        value: "string",
        label: t("questions.select_options.value_types.string")
      },
      { value: "int", label: t("questions.select_options.value_types.int") },
      {
        value: "boolean",
        label: t("questions.select_options.value_types.boolean")
      },
      {
        value: "range",
        label: t("questions.select_options.value_types.range")
      },
      {
        value: "currency",
        label: t("questions.select_options.value_types.currency")
      },
      {
        value: "option",
        label: t("questions.select_options.value_types.option")
      },
      {
        value: "multiple_option",
        label: t("questions.select_options.value_types.multiple_option")
      }
    ];

    const value =
      options.find(item => {
        return item.value === value_type;
      }) || [];

    return (
      <Select
        options={options}
        onChange={handleValueType}
        name={`${name}[value_type]`}
        value={value}
        className=""
      />
    );
  };

  const handleValueType = selectedOption => {
    const option = selectedOption.value;
    killervalueinputElement.current.resetValues();
    answerinputElement.current.resetValues();
    setValueType(option);
    setKillerCondition("");
    setKillerValue("");
  };

  const handleInputChange = event => {
    setDescription(event.target.value);
  };

  const drawKillerCondition = () => {
    return (
      <KillerConditionSelect
        t={t}
        selected_option={value_type}
        killer_condition={killer_condition}
        question={question}
        name={name}
        handleChangeStatus={handleChangeStatus}
      />
    );
  };

  const drawKillerValue = () => {
    return (
      <KillerValueInput
        t={t}
        ref={killervalueinputElement}
        selected_option={value_type}
        question={question}
        name={name}
        handleChangeStatus={handleChangeStatus}
      />
    );
  };

  const handleChangeStatus = (key, value) => {
    switch (key) {
      case "value_type":
        setValueType(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "killer_condition":
        setKillerCondition(value);
        break;
      case "options":
        setOptions(value);
        break;
      case "killer_value":
        setKillerValue(value);
        break;
      default:
        break;
    }
  };

  const drawWeight = () => {
    if (with_weight) {
      return (
        <div className="form-group col-sm-12 col-md-2">
          <label htmlFor={`${name}[weighing]`}>
            {t("questions.attributes.weighing")}
          </label>
          <input
            type="number"
            name={`${name}[weighing]`}
            className="form-control"
            onChange={e => props.handleOnChangeWeight(e, question)}
            step=".01"
            min="0"
            max="100"
            defaultValue={question.weighing}
          />
          <InputError attr="weighing" errors={question.errors} />
        </div>
      );
    } else {
      return (
        <input
          type="hidden"
          name={`${name}[weighing]`}
          className="form-control"
          defaultValue={question.weighing}
        />
      );
    }
  };

  return (
    <div className={`row ${question._destroy ? "d-none" : ""}`}>
      <div className="col-sm-12">
        <div className="card hover-card mb-3">
          <div className="float-right">
            <button
              className="btn btn-sm btn-link text-danger float-right"
              onClick={handleDelete}
              aria-label="Borrar Pregunta"
              title="Borrar"
            >
              {" "}
              <i className="fa fas fa-trash h6" alt="borrar" />
            </button>
          </div>
          <div className="card-body pt-0">
            <div className="row">
              <div className="form-group col">
                <label htmlFor="" className="label-bold">
                  {t("questions.attributes.description")}
                </label>
                <input
                  type="text"
                  name={`${name}[description]`}
                  className="form-control"
                  value={description}
                  onChange={handleInputChange}
                />
                <InputError attr="description" errors={question.errors} />
              </div>
              {drawWeight()}
            </div>
            <div className="row d-flex">
              <div className="form-group flex-fill px-3">
                <label htmlFor="" className="label-bold">
                  {t("questions.attributes.value_type")}
                </label>
                {drawValueType()}
                <InputError attr="value_type" errors={question.errors} />
              </div>

              <div className="form-group flex-fill px-3">
                {drawKillerCondition()}
              </div>
              <div className="form-group flex-fill px-3">
                {drawKillerValue()}
              </div>
            </div>
          </div>
          <AnswerInput
            t={t}
            ref={answerinputElement}
            description={description}
            selected_option={value_type}
            options={options}
            killer_condition={killer_condition}
            killer_value={killer_value}
          />
          <input type="hidden" name={`${name}[id]`} value={question.id} />
          <input type="hidden" name={`${name}[order]`} value={question.order} />
          <input
            type="hidden"
            name={`${name}[_destroy]`}
            value={question._destroy}
          />
        </div>
      </div>
    </div>
  );
};

QuestionForm.propTypes = {
  question: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  deleteQuestion: PropTypes.func.isRequired
};

export default memo(QuestionForm);
