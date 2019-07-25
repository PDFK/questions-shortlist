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
      />
    </I18nextProvider>
  );
};

export default MultipleQuestions;
