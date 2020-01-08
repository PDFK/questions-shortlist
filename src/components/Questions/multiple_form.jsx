import React, { useState, useEffect, memo, useCallback } from "react";
import update from "immutability-helper";
import QuestionForm from "./form.jsx";
import HTML5Backend from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Cookies from "js-cookie";

const MultipleForm = props => {
  const { name, t, i18n, with_weight, with_audio } = props;
  const [questions, setQuestions] = useState([]);
  const [collapseQuestions, setcollapseQuestions] = useState("up");

  useEffect(() => {
    let questionsTemp = [...props.questions];
    questionsTemp.forEach(question => {
      const key = Math.floor(Math.random() * 1000000000000);
      question.hasOwnProperty("key") ? question : (question["key"] = key);
    });
    setQuestions(questionsTemp);
    const translation = Cookies.get("my_locale") || "es";
    i18n.changeLanguage(translation);
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
      order: order,
      disposable: true
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

  const handleCollapseQuestions = () => {
    setcollapseQuestions(collapseQuestions === "up" ? "down" : "up");
  };

  const drawQuestionForm = () => {
    if (questions.length > 0) {
      return questions.map((question, index) => {
        const _question = questionFormat(question, index);
        return (
          <QuestionForm
            collapseQuestion={collapseQuestions}
            key={_question.key || index}
            name={`${name}[${index}]`}
            question={_question}
            deleteQuestion={handleDelete}
            handleOnChangeWeight={handleOnChangeWeight}
            handleDisposable={handleDisposable}
            with_weight={with_weight}
            with_audio={with_audio}
            moveCard={moveCard}
            index={index}
            id={_question.id || index}
            t={t}
          />
        );
      });
    }
  };

  const handleDisposable = question => {
    let arr = [...questions];
    const found = questions.findIndex(s => {
      return s.key === question.key;
    });
    question.weighing = "";
    arr[found] = question;
    setQuestions(arr);
    setWeightErrors(arr);
  };

  const handleOnChangeWeight = (event, question, resetAll = false) => {
    let arr = [...questions];
    const found = questions.findIndex(s => {
      return s.key === question.key;
    });
    if (resetAll) {
      arr[found] = question;
      resetWeighing(arr);
      setQuestions(arr);
    } else {
      question.weighing = Number(event.target.value);
      arr[found] = question;
      setQuestions(arr);
      setWeightErrors(arr);
    }
  };

  const resetWeighing = questions => {
    questions.map((question, index) => {
      question.weighing = "";
      return question;
    });
  };

  const setWeightErrors = questions => {
    const total = calculateTotalWeight(questions);

    if (total === 100 || total === 0) {
      questions.map(q => {
        if (q.errors && q.errors.weighing) {
          delete q.errors.weighing;
        }
        return q;
      });
    } else {
      questions.map(q => {
        if (q.errors) {
          q.errors["weighing"] = [t("questions.errors.weighing")];
        } else {
          q["errors"] = {};
          q.errors["weighing"] = [t("questions.errors.weighing")];
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
            weighing: [t("questions.errors.weighing")]
          };

    const new_question = {
      id: question.id,
      description: question.description,
      order: index,
      value_type: question.value_type,
      killer_condition: question.killer_condition || "",
      options: options,
      killer_value: killer_value,
      errors: question.errors || weightError,
      weighing: question.weighing,
      key: question.key,
      _destroy: question._destroy || false,
      disposable: question.disposable || true
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
        if (Array.isArray(values)) {
          values = values.map(item => {
            return { value: item, label: item };
          });
        } else {
          values = values.split(",");
          values = values.map(item => {
            return { value: item, label: item };
          });
        }
        break;
      case "audio":
        values = "";
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
          type="button"
          onClick={handleClick}
          name="add_question"
        >
          <i className="fa fas fa-plus" /> &nbsp;
          {t("questions.action.add")}
        </button>
      </div>
    );
  };

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragQuestion = questions[dragIndex];
      setQuestions(
        update(questions, {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragQuestion]]
        })
      );
    },
    [questions]
  );

  return (
    <div id="questions">
      <div className="row mt-5">
        <div className="form-group col-sm-12">
          <h3 className="p-2 mb-2 bg-primary text-white h5">
            <strong>{t("questions.html_helpers.others")}</strong>
            <button
              className="btn btn-link float-right text-white"
              type="button"
              onClick={handleCollapseQuestions}
            >
              <i className={`fas fa fa-chevron-${collapseQuestions}`} />
              &nbsp;
              {`${
                collapseQuestions == "up"
                  ? t("questions.html_helpers.min")
                  : t("questions.html_helpers.max")
              } ${t("questions.html_helpers.all_questions")}`}
            </button>
          </h3>
        </div>
      </div>
      <DndProvider backend={HTML5Backend}>{drawQuestionForm()}</DndProvider>
      {renderAddButton()}
    </div>
  );
};

const calculateTotalWeight = qs => {
  if (qs.length === 0) {
    return 0;
  } else {
    const array = qs.filter(q => {
      return (
        q.value_type != "audio" && (q.disposable == "true" || q.disposable)
      );
    });
    if (array.length > 0) {
      return array.reduce((total, question) => {
        return { weighing: total.weighing + question.weighing };
      }).weighing;
    } else {
      return 0;
    }
  }
};

export default memo(MultipleForm);
