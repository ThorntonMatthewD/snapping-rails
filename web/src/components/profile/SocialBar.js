import { Container, Typography } from "@mui/material";
import {
  Facebook,
  Instagram,
  YouTube,
  MusicNoteRounded,
} from "@mui/icons-material";

const SocialBar = ({ links }) => {
  return links ? (
    <Container sx={{ color: "white" }}>
      <Typography variant="h5">Socials: </Typography>

      {links.youtube && (
        <a href={links.youtube}>
          <YouTube fontSize="large" sx={{ color: "#FF0000" }} />
        </a>
      )}

      {links.instagram && (
        <a href={links.instagram}>
          <Instagram fontSize="large" sx={{ color: "#C13584" }} />
        </a>
      )}

      {links.facebook && (
        <a href={links.facebook}>
          <Facebook fontSize="large" sx={{ color: "#4267B2" }} />
        </a>
      )}

      {links.tiktok && (
        <a href={links.tiktok}>
          <MusicNoteRounded fontSize="large" sx={{ color: "#FE2C55" }} />
        </a>
      )}
    </Container>
  ) : (
    <></>
  );
};

export default SocialBar;
