import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from '@mui/material';

const FormInputText = ({ name, control, label, password}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        <TextField
          helperText={error ? error.message : null}
          size="small"
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          variant="outlined"
          type={password ? "password" : null}
        />
      )}
    />
  );
};

export default FormInputText;