import React, { useState, useRef, useEffect, memo } from "react";
import Select from "react-select";
import KillerConditionSelect from "./killer_condition_select.jsx";
import KillerValueInput from "./killer_value_input.jsx";
import InputError from "./error.jsx";
import AnswerInput from "./answer_input.jsx";
import PropTypes from "prop-types";
import { useDrag, useDrop } from "react-dnd";

const QuestionForm = props => {
  const {
    question,
    deleteQuestion,
    t,
    name,
    with_weight,
    with_audio,
    index,
    collapseQuestion
  } = props;
  const [value_type, setValueType] = useState(question.value_type);
  const [description, setDescription] = useState(question.description || "");
  const [killer_condition, setKillerCondition] = useState(
    question.killer_condition
  );
  const [options, setOptions] = useState(question.options || []);
  const [collapsed, setCollapsed] = useState(collapseQuestion);
  const [killer_value, setKillerValue] = useState(question.killer_value);
  const [disposable, setDisposable] = useState(question.disposable);
  const answerinputElement = useRef(null);
  const killervalueinputElement = useRef(null);
  const ref = useRef(null);

  useEffect(() => {
    setCollapsed(collapseQuestion);
  }, [collapseQuestion]);

  const handleDelete = event => {
    event.preventDefault();
    deleteQuestion(question.key);
  };

  const drawValueType = () => {
    let options = [
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

    if (with_audio)
      options.push({
        value: "audio",
        label: t("questions.select_options.value_types.audio")
      });

    const value =
      options.find(item => {
        return item.value === value_type;
      }) || [];

    return (
      <Select
        options={options.sort((o1, o2) => {
          return o1.label.localeCompare(o2.label);
        })}
        onChange={handleValueType}
        name={`${name}[value_type]`}
        value={value}
        className=""
      />
    );
  };

  const handleValueType = selectedOption => {
    const option = selectedOption.value;
    if (disposable || value_type !== "audio") {
      killervalueinputElement.current.resetValues();
      answerinputElement.current.resetValues();
    }
    let kc_value = "";
    switch (option) {
      case "date":
        kc_value = "<=";
        break;
      case "boolean":
      case "string":
        kc_value = "==";
        break;
      case "currency":
      case "int":
      case "range":
        kc_value = "between?";
        break;
      case "option":
      case "multiple_option":
        kc_value = "";
        break;
      case "audio":
        question.value_type = option;
        props.handleOnChangeWeight(null, question, true);
        const elements = document.getElementsByClassName("weighing");
        for (let item of elements) {
          item.value = "";
        }
        break;
      default:
        kc_value = "";
    }
    setValueType(option);
    setKillerCondition(kc_value);
    setKillerValue("");
  };

  const handleInputChange = event => {
    setDescription(event.target.value);
  };

  const handleInputDisposableChange = event => {
    question.disposable = !disposable;
    props.handleDisposable(question);
    setDisposable(!disposable);
  };

  const drawKillerCondition = () => {
    if (value_type === "audio") {
      return null;
    } else {
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
    }
  };

  const drawKillerValue = () => {
    if (value_type === "audio") {
      return null;
    } else {
      return (
        <KillerValueInput
          t={t}
          ref={killervalueinputElement}
          selected_option={value_type}
          question={question}
          name={name}
          handleChangeStatus={handleChangeStatus}
          disposable={disposable}
        />
      );
    }
  };

  const handleChangeStatus = (key, value) => {
    const _value = Array.isArray(value) ? [...value] : value;
    switch (key) {
      case "value_type":
        setValueType(_value);
        break;
      case "description":
        setDescription(_value);
        break;
      case "killer_condition":
        setKillerCondition(_value);
        break;
      case "options":
        setOptions(_value);
        break;
      case "killer_value":
        setKillerValue(_value);
        break;
      default:
        break;
    }
  };

  const handleOnChangeWeight = e => {
    question.value_type = value_type;
    props.handleOnChangeWeight(e, question);
  };

  const drawWeight = () => {
    if (with_weight && value_type != "audio" && disposable) {
      return (
        <div className="form-group col-sm-12 col-md-2">
          <label className="label-bold" htmlFor={`${name}[weighing]`}>
            {t("questions.attributes.weighing")}
          </label>
          <input
            type="number"
            name={`${name}[weighing]`}
            className="form-control weighing"
            onChange={e => handleOnChangeWeight(e)}
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

  const drawDisposableSwitch = () => {
    if (value_type != "audio") {
      return (
        <div className="row">
          <div className="col-sm-12">
            <div className="custom-control custom-switch float-right">
              <input
                type="checkbox"
                className="custom-control-input"
                checked={disposable}
                id={`disposableSwitch_${question.key}`}
                onChange={handleInputDisposableChange}
                name={`${name}[disposable]`}
              />
              <label
                className="custom-control-label"
                htmlFor={`disposableSwitch_${question.key}`}
              >
                {t("questions.attributes.disposable")}
              </label>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const [, drop] = useDrop({
    accept: "card",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      props.moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: "card", id: index, index: question.order },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  drag(drop(ref));

  const style = {
    backgroundColor: "white",
    cursor: "move"
  };
  const opacity = isDragging ? 0 : 1;

  return (
    <div
      ref={ref}
      style={{ ...style, opacity }}
      className={`row ${
        question._destroy && JSON.parse(question._destroy) ? "d-none" : ""
      }`}
    >
      <div className="col-sm-12">
        <div className="card hover-card mb-3">
          <div className="float-right">
            <button
              className="btn btn-sm btn-link text-danger float-right"
              onClick={handleDelete}
              type="button"
              aria-label={t("questions.html_helpers.delete_question")}
              title={t("questions.html_helpers.delete")}
            >
              <i
                className="fa fas fa-trash h6"
                alt={t("questions.html_helpers.delete")}
              />
            </button>
            <button
              className={`btn btn-link ${
                collapsed === "up" ? "collapsed" : ""
              }`}
              type="button"
              data-toggle="collapse"
              data-target={`#collapse-${index}`}
              aria-expanded={collapsed === "up" ? true : false}
              aria-controls={`collapse-${index}`}
              onClick={event => {
                const x = JSON.parse(event.target.getAttribute("aria-expanded"))
                  ? "up"
                  : "down";
                setCollapsed(x);
              }}
            >
              <i className={`fas fa fa-chevron-${collapsed}`} />
              {` ${t("questions.html_helpers.show")} ${
                collapsed == "up"
                  ? t("questions.html_helpers.less")
                  : t("questions.html_helpers.more")
              } "${description}"`}
            </button>
          </div>
          <div
            id={`collapse-${index}`}
            className={`collapse multi-collapse ${
              collapsed === "up" ? "show" : ""
            }`}
          >
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
                {drawKillerCondition()}
                {drawKillerValue()}
              </div>
              {drawDisposableSwitch()}
            </div>
            <AnswerInput
              t={t}
              ref={answerinputElement}
              description={description}
              selected_option={value_type}
              options={options}
              killer_condition={killer_condition}
              killer_value={killer_value}
              disposable={disposable}
            />
            <input type="hidden" name={`${name}[id]`} value={question.id} />
            <input
              type="hidden"
              name={`${name}[order]`}
              value={question.order}
            />
            <input
              type="hidden"
              name={`${name}[_destroy]`}
              value={question._destroy}
            />
          </div>
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
