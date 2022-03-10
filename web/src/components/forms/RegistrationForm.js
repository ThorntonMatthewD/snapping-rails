import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Paper, Typography } from "@mui/material";
import * as yup from "yup";
import FormInputText from "./fields/FormInputText";

const RegistrationForm = ({ toggleActiveForm }) => {
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
        "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$/",
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm your password"),
  });

  const defaultValues = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
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

  const onSubmit = (data) => {
    //TODO register user
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
    >
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
        name="passwordConfirm"
        control={control}
        label="Confirm Password"
        password={true}
      />

      <Button onClick={handleSubmit(onSubmit)} variant={"contained"}>
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
