import React from "react";
import Select from "react-select";
import KillerConditionSelect from "./killer_condition_select.jsx";
import KillerValueInput from "./killer_value_input.jsx";
import InputError from "./error.jsx";
import AnswerInput from "./answer_input.js";

class QuestionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value_type: props.question.value_type,
      description: props.question.description || "",
      killer_condition: props.question.killer_condition,
      options: props.question.options || [],
      killer_value: props.question.killer_value
    };
    this.answerinputElement = React.createRef();
    this.killervalueinputElement = React.createRef();
    this.handleDelete = this.handleDelete.bind(this);
    this.handleValueType = this.handleValueType.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
  }

  handleDelete() {
    const question = this.props.question;
    this.props.deleteQuestion(question.key);
  }

  drawValueType() {
    const { t, name } = this.props;
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
    const value_type = this.state.value_type;

    let value =
      options.find(function(item) {
        return item.value == value_type;
      }) || [];

    return (
      <Select
        options={options}
        onChange={this.handleValueType}
        name={`${name}[value_type]`}
        value={value}
        className=""
      />
    );
  }

  handleValueType(selectedOption) {
    const option = selectedOption.value;
    this.killervalueinputElement.current.resetValues();
    this.answerinputElement.current.resetValues();
    this.setState({
      value_type: option,
      killer_condition: "",
      killer_value: ""
    });
  }

  handleInputChange(event) {
    let input = event.target;
    this.setState({ description: input.value });
  }

  drawKillerCondition() {
    const name = this.props.name;
    return (
      <KillerConditionSelect
        t={this.props.t}
        selected_option={this.state.value_type}
        killer_condition={this.state.killer_condition}
        question={this.props.question}
        name={name}
        handleChangeStatus={this.handleChangeStatus}
      />
    );
  }

  drawKillerValue() {
    const name = this.props.name;
    return (
      <KillerValueInput
        t={this.props.t}
        ref={this.killervalueinputElement}
        selected_option={this.state.value_type}
        question={this.props.question}
        name={name}
        handleChangeStatus={this.handleChangeStatus}
      />
    );
  }

  handleChangeStatus(key, value) {
    this.setState({ [key]: value });
  }

  render() {
    const { t, name, question } = this.props;
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="card hover-card mb-3">
            <div className="float-right">
              <a
                href="javascript:void(0);"
                className="btn btn-sm btn-link text-danger float-right"
                onClick={this.handleDelete}
                aria-label="Borrar Pregunta"
                title="Borrar"
              >
                <i className="fas fa-trash-alt h6" alt="borrar" />
              </a>
            </div>
            <div className="card-body pt-0">
              <div className="row">
                <div className="form-group col-sm-12">
                  <label htmlFor="" className="label-bold">
                    {t("questions.attributes.description")}
                  </label>
                  <input
                    type="text"
                    name={`${name}[description]`}
                    className="form-control"
                    value={this.state.description}
                    onChange={this.handleInputChange}
                  />
                  <InputError attr="description" errors={question.errors} />
                </div>
              </div>
              <div className="row d-flex">
                <input
                  type="hidden"
                  name={`${name}[order]`}
                  value={question.order}
                />

                <div className="form-group flex-fill px-3">
                  <label htmlFor="" className="label-bold">
                    {t("questions.attributes.value_type")}
                  </label>
                  {this.drawValueType()}
                  <InputError attr="value_type" errors={question.errors} />
                </div>

                <div className="form-group flex-fill px-3">
                  {this.drawKillerCondition()}
                </div>
                <div className="form-group flex-fill px-3">
                  {this.drawKillerValue()}
                </div>
              </div>
            </div>
            <AnswerInput
              t={this.props.t}
              ref={this.answerinputElement}
              description={this.state.description}
              selected_option={this.state.value_type}
              options={this.state.options}
              killer_condition={this.state.killer_condition}
              killer_value={this.state.killer_value}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionForm;
