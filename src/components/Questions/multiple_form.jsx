import React, { useState, useEffect, memo } from "react";
import QuestionForm from "./form.jsx";

const MultipleForm = props => {
  const { name, t, with_weight } = props;
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    let questionsTemp = [...props.questions];
    questionsTemp.forEach(question => {
      const key = Math.floor(Math.random() * 1000000000000);
      question.hasOwnProperty("key") ? question : (question["key"] = key);
    });
    setQuestions(questionsTemp);
  }, []);

  const handleClick = event => {
    event.preventDefault();
    const key = Math.floor(Math.random() * 1000000000000);
    let questionsTemp = [...questions];
    const order = questionsTemp.length + 1;
    let weighing;

    if (with_weight) {
      weighing = 100 - calculateTotalWeight(questionsTemp);
    } else {
      weighing = "";
    }

    questionsTemp.push({
      id: "",
      value_type: "string",
      killer_condition: "==",
      options: [],
      killer_value: "",
      key: key,
      weighing: weighing,
      order: order
    });

    if (with_weight) {
      setWeightErrors(questionsTemp);
    } else {
      resetWeighing(questionsTemp);
    }

    setQuestions(questionsTemp);
  };

  const handleDelete = key => {
    let arr = [].concat(questions);
    let found = questions.findIndex(s => {
      return s.key === key;
    });

    if (
      arr[found].id == "" ||
      typeof arr[found].id == "undefined" ||
      arr[found].id == undefined
    )
      arr.splice(found, 1);
    else arr[found]["_destroy"] = true;

    if (with_weight) {
      setWeightErrors(arr);
    } else {
      resetWeighing(arr);
    }
    setQuestions(arr);
  };

  const drawQuestionForm = () => {
    if (questions.length > 0) {
      return questions.map((question, index) => {
        const _question = questionFormat(question, index);
        return (
          <QuestionForm
            key={_question.key || index}
            name={`${name}[${index}]`}
            question={_question}
            deleteQuestion={handleDelete}
            handleOnChangeWeight={handleOnChangeWeight}
            with_weight={with_weight}
            t={t}
          />
        );
      });
    }
  };

  const handleOnChangeWeight = (event, question) => {
    question.weighing = Number(event.target.value);
    let arr = [...questions];
    const found = questions.findIndex(s => {
      return s.key === question.key;
    });
    arr[found] = question;
    setWeightErrors(arr);
    setQuestions(arr);
  };

  const resetWeighing = questions => {
    questions.map((question, index) => {
      question.weighing = "";
      return question;
    });
  };

  const setWeightErrors = questions => {
    const total = calculateTotalWeight(questions);

    if (total === 100) {
      questions.map(q => {
        if (q.errors && q.errors.weighing) {
          delete q.errors.weighing;
        }
        return q;
      });
    } else {
      questions.map(q => {
        if (q.errors) {
          q.errors["weighing"] = [
            "La suma del peso de cada pregunta no debe ser diferente a 100"
          ];
        } else {
          q["errors"] = {};
          q.errors["weighing"] = [
            "La suma del peso de cada pregunta no debe ser diferente a 100"
          ];
        }
        return q;
      });
    }
  };

  const questionFormat = (question, index) => {
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

    const weightError =
      calculateTotalWeight(questions) === 100
        ? []
        : {
            weighing: [
              "La suma del peso de cada pregunta no debe ser diferente a 100"
            ]
          };

    const new_question = {
      id: question.id,
      description: question.description,
      order: index,
      value_type: question.value_type,
      killer_condition: question.killer_condition,
      options: options,
      killer_value: killer_value,
      errors: question.errors || weightError,
      weighing: question.weighing,
      key: question.key,
      _destroy: question._destroy || false
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

const calculateTotalWeight = qs => {
  if (qs.length === 0) {
    return 0;
  } else {
    return qs.reduce((total, question) => {
      return { weighing: total.weighing + question.weighing };
    }).weighing;
  }
};

export default memo(MultipleForm);
