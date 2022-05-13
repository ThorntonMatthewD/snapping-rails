import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  AlertTitle,
  Button,
  Collapse,
  Paper,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import FormInputText from "./fields/FormInputText";
import useFetch from "use-http";

const RegistrationForm = ({ toggleActiveForm }) => {
  const { post, error, response } = useFetch(
    process.env.REACT_APP_API_URL + "/api"
  );

  const [successful, setSuccessful] = useState(false);

  const schema = yup.object({
    username: yup
      .string()
      .min(1)
      .max(16)
      .required("Please enter your username"),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Please enter an email address"),
    password: yup
      .string()
      .required("Please enter your password")
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    password2: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm your password"),
  });

  const defaultValues = {
    username: "",
    email: "",
    password: "",
    password2: "",
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    await post("/register", data);

    if (response.ok) {
      setSuccessful(true);
    }
  };

  return (
    <Paper
      style={{
        display: "grid",
        gridRowGap: "20px",
        padding: "20px",
        marginTop: "10px",
        width: "90%",
      }}
      component="form"
    >
      <Collapse in={successful}>
        <Alert severity="success">
          <AlertTitle>Registration Complete!</AlertTitle>
          Welcome aboard! <p onClick={toggleActiveForm}>Click here to login</p>.
        </Alert>
      </Collapse>

      <Collapse in={error}>
        <Alert severity="error">
          <AlertTitle>Registration Failed</AlertTitle>
          An error occurred when processing your registration information.
        </Alert>
      </Collapse>

      <FormInputText
        required
        name="username"
        control={control}
        label="Username"
      />

      <FormInputText
        required
        name="email"
        control={control}
        label="E-Mail Address"
      />

      <FormInputText
        required
        name="password"
        control={control}
        label="Password"
        password={true}
      />

      <FormInputText
        required
        name="password2"
        control={control}
        label="Confirm Password"
        password={true}
      />

      <Button
        type="submit"
        onClick={handleSubmit(onSubmit)}
        variant={"contained"}
        disabled={successful}
      >
        Submit
      </Button>

      <Typography variant="p">Already have an account?</Typography>

      <Button fullWidth variant="outlined" onClick={toggleActiveForm}>
        SIGN IN
      </Button>

      {errors && console.log(errors)}
    </Paper>
  );
};

export default RegistrationForm;
