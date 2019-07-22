import React, { useState, useEffect, memo } from "react";
import QuestionForm from "./form.jsx";

const MultipleForm = props => {
  const { name, t } = props;
  const [questions, setQuestions] = useState(props.questions);

  useEffect(() => {
    questions.forEach((question, index) => {
      const key = Math.floor(Math.random() * 1000000000000);
      question.hasOwnProperty("key") ? question : (question["key"] = key);
    });
    setQuestions(questions);
  }, []);

  const handleClick = event => {
    event.preventDefault();
    const key = Math.floor(Math.random() * 1000000000000);
    let questionsTemp = [...questions];
    const order = questionsTemp.length + 1;
    questionsTemp.push({
      id: "",
      value_type: "string",
      killer_condition: "==",
      options: [],
      killer_value: "",
      key: key,
      order: order
    });
    setQuestions(questionsTemp);
  };

  const handleDelete = key => {
    var arr = [].concat(questions);
    var found = questions.findIndex(s => {
      return s.key === key;
    });

    arr.splice(found, 1);
    setQuestions(arr);
  };

  const drawQuestionForm = () => {
    if (questions.length > 0) {
      return questions.map((question, index) => {
        const _question = questionFormat(question);
        return (
          <QuestionForm
            key={_question.key || index}
            name={`${name}[${_question.key}]`}
            question={_question}
            deleteQuestion={handleDelete}
            t={t}
          />
        );
      });
    }
  };

  const questionFormat = question => {
    const options =
      question.options && Array.isArray(question.options)
        ? question.options.map(function(item) {
            return { value: item, label: item };
          })
        : [];
    const killer_value = killerValueFormat(
      question.killer_value,
      question.value_type
    );

    const new_question = {
      description: question.description,
      order: question.order,
      value_type: question.value_type,
      killer_condition: question.killer_condition,
      options: options,
      killer_value: killer_value,
      errors: question.errors || [],
      key: question.key
    };
    return new_question;
  };

  const killerValueFormat = (killer_value, value_type) => {
    let values = killer_value;
    switch (value_type) {
      case "boolean":
      case "option":
      case "multiple_option":
        if (Array.isArray(values)) {
          values = values.map(item => {
            return { value: item, label: item };
          });
        } else {
          values = values.split(";");
          values = values.map(item => {
            return { value: item, label: item };
          });
        }
        break;
      case "range":
        values = values.split(",");
        break;
      default:
        values;
    }
    return values;
  };

  const renderAddButton = () => {
    return (
      <div className="col-12 form-group">
        <button
          className="btn btn-secondary"
          onClick={handleClick}
          name="add_question"
        >
          <i className="fa fas fa-plus" /> &nbsp;
          {t("questions.action.add")}
        </button>
      </div>
    );
  };

  return (
    <div id="questions">
      <div className="row mt-5">
        <div className="form-group col-sm-12">
          <h3 className="p-2 mb-2 bg-primary text-white h5">
            <strong>{t("questions.html_helpers.others")}</strong>
          </h3>
        </div>
      </div>
      {drawQuestionForm()}
      {renderAddButton()}
    </div>
  );
};

export default memo(MultipleForm);
