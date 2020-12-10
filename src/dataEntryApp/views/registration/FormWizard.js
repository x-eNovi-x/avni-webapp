import React, { Fragment } from "react";
import { withParams } from "../../../common/components/utils";
import { Redirect, withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import Summary from "./Summary";
import { Box, Paper, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import CustomizedSnackbar from "../../components/CustomizedSnackbar";
import FormWizardHeader from "dataEntryApp/views/registration/FormWizardHeader";
import FormWizardButton from "dataEntryApp/views/registration/FormWizardButton";
import { FormElementGroup as FormElementGroupComponent } from "dataEntryApp/components/FormElementGroup";

const useStyle = makeStyles(theme => ({
  form: {
    padding: theme.spacing(0, 3, 10, 3),
    height: "Auto",
    border: "1px solid #f1ebeb",
    position: "relative",
    minHeight: "600px"
  },
  buttomstyle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "#f8f4f4",
    height: 80,
    width: "100%",
    padding: 25
  },
  topprevnav: {
    color: "#cecdcd",
    fontSize: "13px",
    border: "none",
    background: "white"
  },
  toppagenum: {
    backgroundColor: "silver",
    color: "black",
    fontSize: 12,
    padding: 3
  },
  topnav: {
    color: "orange",
    fontSize: "13px",
    cursor: "pointer",
    border: "none",
    background: "white",

    "&:hover": {
      background: "none",
      border: "none"
    },

    "&:active": {
      border: "none",
      outlineColor: "white"
    }
  },
  prevbuttonspace: {
    color: "#cecdcd",
    marginRight: 27,
    width: 100
  },
  nextBtn: {
    color: "white",
    width: 110,
    cursor: "pointer",
    height: 30,
    padding: "4px 25px",
    fontSize: 12,
    borderRadius: 50,
    backgroundColor: "orange"
  },
  buttomboxstyle: {
    backgroundColor: "#f8f4f4",
    height: 80,
    width: "100%",
    padding: 25
  },
  privbuttonStyle: {
    color: "orange",
    width: 110,
    height: 30,
    fontSize: 12,
    borderColor: "orange",
    cursor: "pointer",
    borderRadius: 50,
    padding: "4px 25px",
    backgroundColor: "white"
  },
  nextbuttonStyle: {
    backgroundColor: "orange",
    color: "white",
    height: 30,
    fontSize: 12,
    width: 110,
    cursor: "pointer",
    borderRadius: 50,
    padding: "4px 25px"
  },
  noUnderline: {
    "&:hover, &:focus": {
      textDecoration: "none"
    }
  }
}));

const FormWizard = ({
  form,
  obsHolder,
  updateObs,
  observations,
  match,
  saved,
  onSaveGoto,
  onSave,
  message,
  subject,
  validationResults,
  additionalRows,
  registrationFlow,
  children,
  filteredFormElements,
  entity,
  history,
  fetchRulesResponse,
  formElementGroup,
  onNext,
  onPrevious,
  onSummaryPage,
  renderStaticPage,
  onReset,
  staticPageUrl
}) => {
  if (!form) return <div />;

  if (saved) {
    setTimeout(() => {
      setRedirect(true);
    }, 2500);
  }

  const isFirstPage = false;
  const [redirect, setRedirect] = React.useState(false);
  const classes = useStyle();
  const { t } = useTranslation();

  if (renderStaticPage) {
    onReset();
    return <Redirect to={staticPageUrl} />;
  }

  const pageTitleText = onSummaryPage ? t("summaryAndRecommendations") : t(formElementGroup.name);
  const pageTitle = `${pageTitleText}`;
  const pageCounter = `X / X`;

  return (
    <Fragment>
      {form && (
        <div>
          {subject ? <FormWizardHeader subject={subject} /> : ""}
          <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between">
            <Typography variant="subtitle1" gutterBottom>
              {" "}
              {pageTitle}
            </Typography>
            <Box flexDirection={"row"} display={"flex"}>
              <FormWizardButton
                className={classes.topnav}
                text={t("previous")}
                disabled={false}
                onClick={onPrevious}
              />
              <label className={classes.toppagenum}>{pageCounter}</label>
              <FormWizardButton
                className={classes.topnav}
                onClick={onSummaryPage ? onSave : onNext}
                text={onSummaryPage ? t("save") : t("next")}
              />
            </Box>
          </Box>
          <Paper className={classes.form}>
            {onSummaryPage ? (
              <Summary
                observations={observations}
                additionalRows={additionalRows}
                form={form}
                fetchRulesResponse={fetchRulesResponse}
              />
            ) : (
              <FormElementGroupComponent
                parentChildren={children}
                key={formElementGroup.uuid}
                obsHolder={obsHolder}
                updateObs={updateObs}
                validationResults={validationResults}
                filteredFormElements={filteredFormElements}
                entity={entity}
                renderParent={isFirstPage}
              >
                {formElementGroup}
              </FormElementGroupComponent>
            )}

            <Box className={classes.buttomstyle} display="flex">
              <Box style={{ marginRight: 20 }}>
                <FormWizardButton
                  className={classes.privbuttonStyle}
                  text={t("previous")}
                  disabled={false}
                  onClick={onPrevious}
                />
              </Box>
              <Box>
                <FormWizardButton
                  className={classes.nextbuttonStyle}
                  onClick={onSummaryPage ? onSave : onNext}
                  text={onSummaryPage ? t("save") : t("next")}
                />
              </Box>
            </Box>
            {redirect && <Redirect to={onSaveGoto} />}
            {saved && (
              <CustomizedSnackbar
                message={t(message || "Your details have been successfully registered.")}
              />
            )}
          </Paper>
        </div>
      )}
    </Fragment>
  );
};

export default withRouter(withParams(FormWizard));
