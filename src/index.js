import React, { Component } from "react";
import Questions from "./components/Questions/index.jsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/index.js";
import ReactDOM from "react-dom";

export default class MultipleQuestions extends Component {
  render() {
    const questions = [
      {
        killer_value: "1;3",
        killer_condition: "are_options?",
        description: "text",
        value_type: "multiple_option",
        order: "0",
        options: ["1", "2", "3", "4"]
      },
      {
        killer_value: ["1", "3"],
        killer_condition: "isnt_option?",
        description: "text",
        value_type: "option",
        order: "2",
        options: ["1", "2", "3", "4"]
      },
      {
        killer_value: ["1"],
        killer_condition: "isnt_option?",
        description: "text",
        value_type: "option",
        order: "3",
        options: ["1", "2", "3", "4"]
      },
      {
        killer_value: "4",
        killer_condition: "isnt_option?",
        description: "text",
        value_type: "option",
        order: "4",
        options: ["1", "2", "3", "4"]
      },
      {
        killer_value: "Si",
        killer_condition: "==",
        description: "text",
        value_type: "boolean",
        order: "5"
      }
    ];

    return (
      <I18nextProvider i18n={i18n}>
        <Questions
          questions={this.props.questions || questions}
          form_name={this.props.form_name}
        />
      </I18nextProvider>
    );
  }
}

ReactDOM.render(<MultipleQuestions />, document.getElementById("root"));
