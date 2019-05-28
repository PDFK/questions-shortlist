import React, { Component } from 'react'
import Questions from './components/Questions/index.jsx'
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/index.js';

export default class MultipleQuestions extends Component {

  render() {
    return (
      <I18nextProvider i18n={i18n}>
        <Questions questions={ this.props.questions || [] } form_name={ this.props.form_name } />
       </I18nextProvider>
    )
  }
}

