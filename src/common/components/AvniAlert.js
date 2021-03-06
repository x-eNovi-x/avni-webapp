import Paper from "@material-ui/core/Paper";
import React from "react";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";

const useStyles = makeStyles(theme => ({
  outlinedwarning: {
    color: "rgb(102,60,0)",
    border: "1px solid #ff9800",
    icon: {
      color: "#ff9800"
    },
    padding: theme.spacing(1)
  },
  outlinedinfo: {
    color: "rgb(13,60,97)",
    border: "1px solid #2196f3",
    icon: {
      color: "#2196f3"
    },
    padding: theme.spacing(1)
  }
}));

export const AvniAlert = ({ severity, variant, ...props }) => {
  const classes = useStyles();

  return (
    <Paper square elevation={0} className={clsx(classes.root, classes[`${variant}${severity}`])}>
      <div className={classes.icon}>
        {severity === "warning" ? <WarningIcon /> : <InfoIcon />} {props.children}
      </div>
    </Paper>
  );
};
