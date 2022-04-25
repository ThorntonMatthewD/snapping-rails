import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Paper } from "@mui/material";
import * as yup from "yup";
import { string } from "yup";

import FormInputText from "./fields/FormInputText";
import { getCookieValue } from "../../util/cookies";

const ProfileSettingsForm = ({ toggleModal, userInfo }) => {
  const schema = yup.object({
    profile_pic_url: string(),
    profile_description: string(),
    facebook_url: string().url().required("Facebook URL isn't a valid URL."),
    instagram_url: string().url().required("Instagram URL isn't a valid URL."),
    tik_tok_url: string().url().required("TikTok URL isn't a valid URL."),
    youtube_url: string().url().required("YouTube URL isn't a valid URL."),
  });

  const defaultValues = {
    profile_pic_url: userInfo?.profile_pic_url || "",
    profile_description: userInfo?.profile_description || "",
    facebook_url: userInfo?.social_links.facebook || "",
    instagram_url: userInfo?.social_links.instagram || "",
    tik_tok_url: userInfo?.social_links.tik_tok || "",
    youtube_url: userInfo?.social_links.youtube || "",
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
    const profileUpdateData = {
      profile_pic_url: data.profile_pic_url,
      profile_description: data.profile_description,
      social_links: {
        facebook_url: data.facebook_url,
        instagram_url: data.instagram_url,
        tik_tok_url: data.tik_tok_url,
        youtube_url: data.youtube_url,
      },
    };

    fetch("http://localhost:8000/api/profile", {
      credentials: "include",
      method: "UPDATE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": getCookieValue("csrf_access_token"),
      },
      body: JSON.stringify(profileUpdateData),
    }).then(() => {
      toggleModal();
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
        required
        name="profile_description"
        control={control}
        label="Profile Description"
      />
      <FormInputText
        required
        name="profile_pic_url"
        control={control}
        label="Profile Picture Url"
      />

      <FormInputText
        required
        name="facebook_url"
        control={control}
        label="Facebook Link"
      />
      <FormInputText
        required
        name="instagram_url"
        control={control}
        label="Instagram Link"
      />
      <FormInputText
        required
        name="tik_tok_url"
        control={control}
        label="TikTok Link"
      />
      <FormInputText
        required
        name="youtube_url"
        control={control}
        label="YouTube Link"
      />

      <Button
        type="submit"
        onClick={handleSubmit(onSubmit)}
        variant={"contained"}
      >
        Update Profile
      </Button>
    </Paper>
  );
};

export default ProfileSettingsForm;
