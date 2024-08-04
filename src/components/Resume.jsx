import React from "react";
import { styled } from "@mui/material/styles";
import { Typography, Link } from "@mui/material";
import { ResumeIcon } from "./ResumeButton";
import ResumePDF from ".././assets/Cheah_Jing_Feng_resume.pdf";

const StyledButton = styled("div")(
  ({ theme }) => `
  footerText: {
    position: "fixed",
    bottom: theme.spacing(6),
    left: theme.spacing(6),
    "&:hover": {
      color: theme.palette.primary.main,
    },
    transition: "all 0.5s ease",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  `
);

export const Resume = () => {
  return (
    <StyledButton>
      <Link
        color="inherit"
        underline="none"
        href={`${ResumePDF}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ResumeIcon />
        <Typography component="span">Resume</Typography>
      </Link>
    </StyledButton>
  );
};
