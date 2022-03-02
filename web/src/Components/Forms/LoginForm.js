import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Paper } from "@mui/material";
import * as yup from "yup";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, getToken } from "../../Utils/auth";
import FormInputText from "./Fields/FormInputText";
import useAuth from "../../Hooks/useAuth";

const LoginForm = () => { 
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const schema = yup.object({
    username: yup
      .string()
      .min(1)
      .max(16)
      .required("Please enter your username"),
    password: yup
      .string()
      .required('Please Enter your password')
    });

    const defaultValues = {
      username: "",
      password: "",
    };

    
    const methods = useForm({ resolver: yupResolver(schema), defaultValues: defaultValues });
    const { register, handleSubmit, watch, control, setValue, formState: { errors } } = methods;

    const onSubmit = data => {

      let info = {
        "username": data.username,
        "password": data.password
      }

      let formBody = [];

      for (var property in info) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(info[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }

      formBody = formBody.join("&");

      fetch('http://localhost:5000/token', {
        method: 'POST',
        headers: {  "accept": "application/json", "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        credentials: 'include',
        body: formBody
      })
      .then(response => response.json())
      .then(data => {
        login(data);
        setAuth({ ...data });
        navigate(from, { replace: true });
      });
    }

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
        <FormInputText name="username" control={control} label="Username" />
        <FormInputText name="password" control={control} label="Password" password={true}/>

        <Button onClick={handleSubmit(onSubmit)} variant={"contained"}>
            {" "}
            Submit{" "}
        </Button>

      { errors && console.log(errors) }
      </Paper>
  );
}

export default LoginForm;
