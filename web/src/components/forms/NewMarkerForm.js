import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Paper } from "@mui/material";
import * as yup from "yup";
import { string } from "yup";
import { getCookieValue } from "../../util/cookies";
import FormDropdown from "./fields/FormDropdown";
import FormInputText from "./fields/FormInputText";

const NewMarkerForm = ({ position, handleClose, refreshMap }) => {
  const schema = yup.object({
    markerTitle: yup
      .string()
      .min(3, "Title should be at least 3 characters")
      .max(64, "Title cannot exceed 64 characters")
      .required("Title required"),
    markerDescription: yup
      .string()
      .min(3, "Description should be at least 3 characters. Don't be shy!")
      .max(240, "Description cannot exceed 240 characters")
      .required("Description required"),
    mediaURL: string().url().required("Media Link must be a valid URL"),
    longitude: yup.string().required(),
    latitude: yup.string().required(),
    markerType: yup.number().integer().moreThan(0).lessThan(6).required(),
    createdAt: yup.date(),
  });

  const defaultValues = {
    markerTitle: "",
    markerDescription: "",
    mediaURL: "",
    acceptTermsCheckbox: [],
    createdAt: new Date(),
    markerType: "0",
    longitude: position.lng,
    latitude: position.lat,
  };

  const dropdownOptions = [
    {
      label: "Select Marker Type...",
      value: "0",
    },
    {
      label: "Photo",
      value: "1",
    },
    {
      label: "Video",
      value: "2",
    },
    {
      label: "Museum/Historical Site",
      value: "3",
    },
    {
      label: "Event",
      value: "4",
    },
    {
      label: "Community",
      value: "5",
    },
  ];

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
    const newMarker = {
      created_at: data.createdAt,
      lat: data.latitude,
      long: data.longitude,
      title: data.markerTitle,
      media_url: data.mediaURL,
      description: data.markerDescription,
      marker_type: data.markerType,
    };

    fetch(process.env.REACT_APP_API_URL + "/api/markers", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": getCookieValue("csrf_access_token"),
      },
      body: JSON.stringify(newMarker),
    }).then(() => {
      handleClose();
      refreshMap();
    });
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
      <FormInputText
        name="markerTitle"
        control={control}
        label="Marker Title"
      />
      <FormInputText
        name="markerDescription"
        control={control}
        label="Marker Description"
      />
      <FormInputText name="mediaURL" control={control} label="Media Link" />

      <FormDropdown
        name="markerType"
        control={control}
        label="Marker Type"
        options={dropdownOptions}
      />

      <Button
        type="submit"
        onClick={handleSubmit(onSubmit)}
        variant={"contained"}
      >
        Submit
      </Button>

      {errors && console.log(errors)}
    </Paper>
  );
};

export default NewMarkerForm;
