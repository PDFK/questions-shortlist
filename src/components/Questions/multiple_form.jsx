import React from 'react';
import QuestionForm from './form.jsx';

class MultipleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: props.questions || [],
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.drawQuestionForm = this.drawQuestionForm.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    const key =  Math.floor((Math.random()*1000000000000));
    let questions = this.state.questions;
    const order = questions.length + 1;
    questions.push({id: '', value_type: 'string', killer_condition: '==', options: [], killer_value: '', key: key, order: order});
    this.setState({ questions: questions});
  }

  handleDelete(key) {
    var arr = [].concat(this.state.questions);
    var found = this.state.questions.findIndex(function(s) {
      return s.key == key
    });

    arr.splice(found,1);
    this.setState({questions: arr});
  }

  componentDidMount() {
    this.state.questions.forEach(function(question, index) {
      let key =  Math.floor((Math.random()*1000000000000));
      question.hasOwnProperty('key') ? question : question["key"] = key;
    });
    this.setState({questions: this.state.questions});
  }

  drawQuestionForm() {
    const questions = this.state.questions;
    const { name , t } = this.props;
    const handleDelete = this.handleDelete;
    const _this = this;

    if(questions.length > 0)
    {
      return (questions.map(function (question, index){
        const _question =  _this.questionFormat(question);
        return (
            <QuestionForm
              key={ _question.key || index }
              name={ `${name}[${_question.key}]` }
              question={ _question }
              deleteQuestion={ handleDelete }
              t={ t }
            />
          )
        })
      )
    }
  }

  questionFormat(question) {
    const options = question.options.map(function(item){
      return {value: item, label: item};
    })
    const killer_value = this.killerValueFormat(question.killer_value, question.value_type);

    const new_question = {
      description: question.description,
      order: question.order,
      value_type: question.value_type,
      killer_condition: question.killer_condition,
      options: options,
      killer_value: killer_value,
      errors: question.errors || [],
      key: question.key
    }
    return new_question;
  }

  killerValueFormat(killer_value, value_type) {
    let values = killer_value;
    switch(value_type){
      case "boolean":
      case "option":
          values = { value: killer_value, label: killer_value }
          break;
      case "multiple_option":
          values = Array.isArray(killer_value) ? killer_value.map(function(item){
            return {value: item, label: item};
          }) : { value: killer_value, label: killer_value };
          break;
      case "range":
          values = values.split(",");
          break;
      default:
          values;
    }
    return values;
  }

  renderAddButton() {
    const {t} = this.props;
    return(
      <div className="col-12 form-group">
        <button className="btn btn-secondary" onClick={ this.handleClick } name="add_question">
          <i className="fas fa-plus"></i> &nbsp;
          { t('questions.action.add') }
        </button>
      </div>
    )
  }

  render() {
    const {t} = this.props;
    return (
      <div id="questions">
        <div className="row mt-5">
          <div className="form-group col-sm-12">
            <h3 className="p-2 mb-2 bg-primary text-white h5">
              <strong>
                { t('questions.html_helpers.others') }
              </strong>
            </h3>
          </div>
        </div>
        { this.drawQuestionForm() }
        { this.renderAddButton() }
      </div>
    );
  }
};

export default MultipleForm;
