import React from 'react';
import Select from 'react-select'
import KillerConditionSelect from './killer_condition_select.jsx';
import KillerValueInput from './killer_value_input.jsx';
import InputError from './error.jsx';

class QuestionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value_type: props.question.value_type,
      description: props.question.description,
    };
    this.killervalueinputElement = React.createRef();
    this.handleDelete = this.handleDelete.bind(this)
    this.handleValueType = this.handleValueType.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleDelete() {
    const question = this.props.question;
    this.props.deleteQuestion(question.key)
  }

  drawValueType() {
    const {t,name} = this.props;
    const options = [
      { value: "date", label: t("questions.select_options.value_types.date")},
      { value: "string", label: t("questions.select_options.value_types.string")},
      { value: "int", label: t("questions.select_options.value_types.int")},
      { value: "boolean", label: t("questions.select_options.value_types.boolean")},
      { value: "range", label: t("questions.select_options.value_types.range")},
      { value: "currency", label: t("questions.select_options.value_types.currency")},
      { value: "option", label: t("questions.select_options.value_types.option")},
      { value: "multiple_option", label: t("questions.select_options.value_types.multiple_option")}
    ];
    const value_type = this.state.value_type;

    let value = options.find(function(item){
      return item.value == value_type;
    }) || [];

    return (
      <Select options={options} onChange={ this.handleValueType } name={ `${name}[value_type]` } value={ value } className="" />
    )
  }

  handleValueType(selectedOption) {
    const option = selectedOption.value;
    this.killervalueinputElement.current.handleKillerValueChange("");
    this.setState({value_type: option});
  }

  handleInputChange(event) {
    let input = event.target;
    this.setState({description: input.value});
  }

  drawKillerCondition() {
    const name = this.props.name;
    return(
      <KillerConditionSelect t={ this.props.t } selected_option={ this.state.value_type } question={ this.props.question } name={ name } />
    )
  }

  drawKillerValue() {
    const name = this.props.name;
    return(
      <KillerValueInput t={ this.props.t } ref={ this.killervalueinputElement } selected_option={ this.state.value_type } question={ this.props.question } name={ name } />
    )
  }

  render() {
    const name = this.props.name;
    const { t } = this.props;

    return (
      <div className="row">
        <div className="form-group col-sm-3">
          <label htmlFor="" className="label-bold">{ t("questions.attributes.description") }</label>
          <input type="text" name={ `${name}[description]` } className="form-control" value={ this.state.description } onChange={ this.handleInputChange } />
          <InputError attr="description" errors={ this.props.question.errors } />
        </div>
        <input type="hidden"  name={ `${name}[order]` } value={ this.props.question.order }/>

        <div className="form-group col-sm-2">
          <label htmlFor="" className="label-bold">{ t("questions.attributes.value_type") }</label>
          { this.drawValueType() }
          <InputError attr="value_type" errors={ this.props.question.errors } />
        </div>

        { this.drawKillerCondition() }

        { this.drawKillerValue() }
        <div className="col-sm-1">
          <a href="javascript:void(0);" className="" onClick={ this.handleDelete }>
            <i className="fas fa-trash-alt mt-5" alt="borrar"></i>
          </a>
        </div>
        <hr/>
      </div>
    );
  }
};

export default QuestionForm;
