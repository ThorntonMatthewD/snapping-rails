import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Paper, Typography } from "@mui/material";
import * as yup from "yup";
import FormInputText from "./fields/FormInputText";
import useAuth from "../../hooks/useAuth";

const LoginForm = ({ toggleActiveForm }) => {
  const { loginUser } = useAuth();

  const schema = yup.object({
    username: yup
      .string()
      .min(1)
      .max(16)
      .required("Please enter your username"),
    password: yup.string().required("Please enter your password"),
  });

  const defaultValues = {
    username: "",
    password: "",
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
    loginUser(data);
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
        name="password"
        control={control}
        label="Password"
        password={true}
      />

      <Button onClick={handleSubmit(onSubmit)} variant={"contained"}>
        Submit
      </Button>

      <Typography variant="p">Don't have any account?</Typography>

      <Button fullWidth variant="outlined" onClick={toggleActiveForm}>
        CREATE ACCOUNT
      </Button>

      {errors && console.log(errors)}
    </Paper>
  );
};

export default LoginForm;
