import React from "react";
import { MenuItem, Select } from '@mui/material';
import { Controller } from "react-hook-form";


const FormInputDropdown = ({name,control, label, options}) => {

  const generateSelectOptions = () => {
    return options.map((option) => {
      return (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      );
    });
  };

  return <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Select onChange={onChange} value={value}>
          {generateSelectOptions()}
        </Select>
      )}
    />
};

export default FormInputDropdown;