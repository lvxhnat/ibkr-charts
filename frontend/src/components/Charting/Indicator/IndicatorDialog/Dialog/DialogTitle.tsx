import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface BootstrapDialogTitleProps {
  children: React.ReactNode;
  handleClose: () => void;
}
export default function BootstrapDialogTitle(props: BootstrapDialogTitleProps) {
  return (
    <DialogTitle
      sx={{
        fontSize: "15px",
        padding: "0px",
        display: "flex",
      }}
      id="customized-dialog-title"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "95%",
          gap: 5,
        }}
      >
        {props.children}
      </div>
      <div
        style={{
          width: "5%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <IconButton
          disableRipple
          aria-label="close"
          onClick={props.handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
    </DialogTitle>
  );
}
