import React from "react";
import {withFormik, Form, Field} from "formik";
import axios from "axios";

const LoginForm = ({isSubmitting}) => {
  return (
    <Form>
      <Field type="text" name="username" />
      <Field type="password" name="password" />
      <input type="submit" value="Log in!" disabled={isSubmitting} />
    </Form>
  );
};

const FormikLoginForm = withFormik({
  mapPropsToValues: () => ({username: 'Lambda School', password: 'i<3Lambd4'}),
  handleSubmit(values, {setSubmitting, props: {history}}) {
    axios.post("http://localhost:5000/api/login", values)
      .then(({data: {payload}}) => {
        setSubmitting(false);
        localStorage.setItem("token", payload);
        history.push('/bubbles')
      })
      .catch(e => {
        setSubmitting(false);
        console.error(e);
      })
  }
})(LoginForm);

export default FormikLoginForm;
