import React from 'react';
import { useTranslation } from 'react-i18next';
import MultipleForm from './multiple_form.jsx'

const Questions = (props) => {
  const [t] = useTranslation();

  if (t) {
    return (
      <div className='preview'>
        <MultipleForm questions={ props.questions } t={ t } name={ props.form_name || "project[questions_attributes]" }/>
      </div>
    )
  }
  else{
    return <div>CARGANDO</div>
  }
}



export default Questions;
