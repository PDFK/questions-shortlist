import React from "react";
import Questions from "./components/Questions/index.jsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/index.js";

const MultipleQuestions = props => {
  return (
    <I18nextProvider i18n={i18n}>
      <Questions
        questions={props.questions || []}
        form_name={props.form_name}
        with_weight={props.with_weight || false}
        with_audio={props.with_audio || false}
        i18n={i18n}
      />
    </I18nextProvider>
  );
};

export default MultipleQuestions;

