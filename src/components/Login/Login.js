import React, { useState, useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT")
    return { value: action.val, isValid: action.val.includes("@") };
  if (action.type === "INPUT_BLUR")
    return { value: state.value, isValid: state.value.includes("@") };
  return { value: "", isValid: false };
};
const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT")
    return { value: action.val, isValid: action.val.trim().length > 6 };
  if (action.type === "INPUT_BLUR")
    return { value: state.value, isValid: state.value.trim().length > 6 };
  return { value: "", isValid: false };
};
const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  useEffect(() => {
    const interval = setTimeout(() => {
      console.log("Form Validation executing");
      setFormIsValid(emailState.isValid && passwordState.isValid);
    }, 500);
    console.log("setTimeout defined");
    return () => {
      console.log("Cleanup Function executing");
      clearInterval(interval);
    };
  }, [emailState.isValid, passwordState.isValid]);

  //As emailState.isValid, passwordState.isValid are used twice we can use object destructuring and use those

  //^useEffect with reducer values

  // useEffect(() => {
  //   const interval = setTimeout(() => {
  //     console.log("Form Validation executing");
  //     setFormIsValid(
  //       enteredEmail.includes("@") && enteredPassword.trim().length > 6
  //     );
  //   }, 500);
  //   console.log("setTimeout defined");

  //   return () => {
  //     console.log("Cleanup Function executing");
  //     clearInterval(interval);
  //   };
  // }, [setFormIsValid, enteredEmail, enteredPassword]);

  //Here if we do not add dependecies it will work only once and will check isformvalid with empty inputs and will set it to false
  //and then even after changing the invalid input to valid it won't set it to true and login button will remain disabled
  //so now we have to add dependencies unlike local storage to re-execute everytime enteredEmail/enteredPassword changes
  //And we add dependencies as whatever we are using in our useEffect hook.We can omit setFormIsValid as it will remain same for every re-render
  //And we surely don't want to check this on every keystroke so we can do this after user pause, so to implemet this
  //we can return an anonymous function (cleanup function) from event function which will run as a cleanup function
  //before our effect function runs except for the first time side-effect function execution
  //And we can pause this form validation execution on each key stroke
  // by clearing the timer before the last keystroke before the user's pause.
  //And this will be efficient if instead of this simple form validation we were sending http request
  //and this will prevent multiple calls on each stroke and will prevent network traffic
  //and will improve the performance as well.

  const emailChangeHandler = (event) => {
    //useReducer 's dispatcher with action in it it can be string identifier,number or but often it is object with some fields
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
    //setFormIsValid(event.target.value.includes("@") && passwordState.isValid);

    // setEnteredEmail(event.target.value);
    //Rather than having similar logic at multiple places for validation we can have it at one place and it will
    //be triggered whenever either password or email changes and will check for validation using useEffect hook
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
    //setFormIsValid(event.target.value.trim().length > 6 && emailState.isValid);

    //setEnteredPassword(event.target.value);
    //Rather than having similar logic at multiple places for validation we can have it at one place and it will
    //be triggered whenever either password or email changes and will check for validation using useEffect hook
    //setFormIsValid(event.target.value.trim().length > 6 && enteredEmail.includes("@"));
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(enteredEmail.includes("@"));
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    // props.onLogin(enteredEmail, enteredPassword);
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            // emailIsValid === false ? classes.invalid : ""
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            // value={enteredEmail}
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            // passwordIsValid === false ? classes.invalid : ""
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            // value={enteredPassword}
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
