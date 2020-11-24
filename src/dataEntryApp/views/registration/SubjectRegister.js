import React, { Fragment } from "react";
import { Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Box, TextField, Chip, Typography, Paper, Button } from "@material-ui/core";
import { ObservationsHolder, AddressLevel } from "avni-models";
import {
  getRegistrationForm,
  onLoad,
  saveSubject,
  updateObs,
  updateSubject,
  setSubject,
  saveCompleteFalse,
  setValidationResults,
  selectAddressLevelType,
  onLoadEdit
} from "../../reducers/registrationReducer";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { getGenders } from "../../reducers/metadataReducer";
import _, { get, sortBy, isEmpty, find } from "lodash";
import { LineBreak, RelativeLink, withParams } from "../../../common/components/utils";
import { DateOfBirth } from "../../components/DateOfBirth";
import { CodedFormElement } from "../../components/CodedFormElement";
import LocationAutosuggest from "dataEntryApp/components/LocationAutosuggest";
import { makeStyles } from "@material-ui/core/styles";
import Breadcrumbs from "dataEntryApp/components/Breadcrumbs";
import FormWizard from "./FormWizard";
import { useTranslation } from "react-i18next";
import RadioButtonsGroup from "dataEntryApp/components/RadioButtonsGroup";
import { setFilteredFormElements } from "../../reducers/RulesReducer";
import Stepper from "./Stepper";
import { fetchRegistrationRulesResponse } from "dataEntryApp/reducers/registrationReducer";
import CustomizedBackdrop from "../../components/CustomizedBackdrop";
import { dateFormat } from "dataEntryApp/constants";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    margin: theme.spacing(4),
    flexGrow: 1
  },
  form: {
    border: "1px solid #f1ebeb"
  },
  villagelabel: {
    color: "rgba(0, 0, 0, 0.54)",
    padding: 0,
    fontSize: "1rem",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: "0.00938em",
    marginBottom: 20
  },
  topcaption: {
    color: "rgba(0, 0, 0, 0.54)",
    backgroundColor: "#f8f4f4",
    height: 40,
    width: "100%",
    padding: 8
  },
  caption: {
    color: "rgba(0, 0, 0, 0.54)"
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
  topnextnav: {
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
  iconcolor: {
    color: "blue"
  },
  topboxstyle: {
    padding: theme.spacing(3, 3)
  },
  buttomboxstyle: {
    backgroundColor: "#f8f4f4",
    height: 80,
    width: "100%",
    padding: 25
  },
  errmsg: {
    color: "#f44336",
    "font-family": "Roboto",
    "font-weight": 400,
    "font-size": "0.75rem"
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
  noUnderline: {
    "&:hover, &:focus": {
      textDecoration: "none"
    }
  },
  lableStyle: {
    width: "50%",
    marginBottom: 10,
    color: "rgba(0, 0, 0, 0.54)"
  }
}));

const DefaultPage = props => {
  if (!props.form) return <div />;
  const classes = useStyles();
  const { t } = useTranslation();
  const loaded = !!props.loaded;
  const [subjectRegErrors, setSubjectRegErrors] = React.useState({
    REGISTRATION_DATE: "",
    FIRST_NAME: "",
    LAST_NAME: "",
    DOB: "",
    GENDER: "",
    LOWEST_ADDRESS_LEVEL: ""
  });

  const setValidationResultToError = validationResult => {
    subjectRegErrors[validationResult.formIdentifier] = validationResult.messageKey;
    setSubjectRegErrors({ ...subjectRegErrors });
  };

  const handleNext = event => {
    setValidationResultToError(props.subject.validateRegistrationDate());
    setValidationResultToError(props.subject.validateFirstName());
    setValidationResultToError(props.subject.validateLastName());
    setValidationResultToError(props.subject.validateDateOfBirth());
    setValidationResultToError(props.subject.validateGender());
    setValidationResultToError(props.subject.validateAddress());

    //needs to used when village location is set
    //setDisableNext(new ValidationResults(props.subject.validate()).hasValidationError());
    if (props.subject.subjectType.isPerson()) {
      if (
        !(
          _.isEmpty(subjectRegErrors.FIRST_NAME) &&
          _.isEmpty(subjectRegErrors.LAST_NAME) &&
          _.isEmpty(subjectRegErrors.DOB) &&
          _.isEmpty(subjectRegErrors.REGISTRATION_DATE) &&
          _.isEmpty(subjectRegErrors.GENDER) &&
          _.isEmpty(subjectRegErrors.LOWEST_ADDRESS_LEVEL)
        )
      ) {
        event.preventDefault();
      }
    } else {
      if (
        !(
          _.isEmpty(subjectRegErrors.FIRST_NAME) &&
          _.isEmpty(subjectRegErrors.REGISTRATION_DATE) &&
          _.isEmpty(subjectRegErrors.LOWEST_ADDRESS_LEVEL)
        )
      ) {
        event.preventDefault();
      }
    }
  };

  const formElementGroups = props.form
    .getFormElementGroups()
    .filter(feg => !isEmpty(feg.nonVoidedFormElements()));
  const totalNumberOfPages = formElementGroups.length + 2;

  function renderAddress() {
    const {
      customRegistrationLocations = {},
      addressLevelTypes,
      subject: { subjectType: { uuid } = null } = {}
    } = props;
    const customRegistrationLocation =
      !isEmpty(customRegistrationLocations) &&
      find(customRegistrationLocations, ({ subjectTypeUUID }) => subjectTypeUUID === uuid);
    const addressLevelTypesToRender = isEmpty(customRegistrationLocation)
      ? addressLevelTypes
      : customRegistrationLocation.addressLevels;
    return (
      <>
        <LineBreak num={1} />
        <RadioButtonsGroup
          label={t("Address*")}
          items={addressLevelTypesToRender.map(a => ({ id: a.id, name: a.name }))}
          value={props.selectedAddressLevelType.id}
          onChange={item => props.selectAddressLevelType(item)}
        />
        <div>
          {props.selectedAddressLevelType.id === -1 ? null : (
            <div>
              <LocationAutosuggest
                selectedLocation={props.subject.lowestAddressLevel.name || ""}
                errorMsg={subjectRegErrors.LOWEST_ADDRESS_LEVEL}
                onSelect={location => {
                  props.updateSubject(
                    "lowestAddressLevel",
                    AddressLevel.create({
                      uuid: location.uuid,
                      title: location.title,
                      level: location.level,
                      typeString: location.typeString
                    })
                  );
                  props.subject.lowestAddressLevel = AddressLevel.create({
                    uuid: location.uuid,
                    title: location.title,
                    level: location.level,
                    typeString: location.typeString
                  });
                  setValidationResultToError(props.subject.validateAddress());
                }}
                //   onSelect={location => {props.updateSubject("lowestAddressLevel", location)
                //   setValidationResultToError(props.subject.validateAddress());
                // }

                // }
                subjectProps={props}
                placeholder={props.selectedAddressLevelType.name}
                typeId={props.selectedAddressLevelType.id}
              />
            </div>
          )}
          {subjectRegErrors.LOWEST_ADDRESS_LEVEL && (
            <span className={classes.errmsg}>{t(subjectRegErrors.LOWEST_ADDRESS_LEVEL)}</span>
          )}
        </div>
      </>
    );
  }

  return loaded ? (
    <div>
      <Stepper subjectTypeName={props.subject.subjectType.name} />
      <LineBreak num={1} />
      <div>
        {props.subject && (
          <div>
            <Box
              display="flex"
              flexDirection={"row"}
              flexWrap="wrap"
              justifyContent="space-between"
            >
              <Typography variant="subtitle1" gutterBottom>
                {" "}
                1. {t("Basic")} {t("details")}
              </Typography>
              <Box>
                <Button className={classes.topprevnav} type="button" disabled>
                  {t("previous")}
                </Button>
                {props.form && (
                  <label className={classes.toppagenum}> 1 / {totalNumberOfPages}</label>
                )}
                <RelativeLink
                  to="form"
                  params={{
                    type: props.subject.subjectType.name,
                    from: props.location.pathname + props.location.search
                  }}
                  noUnderline
                >
                  <Button className={classes.topnextnav} type="button" onClick={e => handleNext(e)}>
                    {t("next")}
                  </Button>
                </RelativeLink>
              </Box>
            </Box>

            <Paper className={classes.form}>
              <Box className={classes.topboxstyle} display="flex" flexDirection="column">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Typography variant="body1" gutterBottom className={classes.lableStyle}>
                    {t("Date of registration")}
                    {"*"}
                  </Typography>
                  <KeyboardDatePicker
                    autoComplete="off"
                    required
                    name="registrationDate"
                    // label={t("Date of registration")}
                    value={
                      _.isNil(props.subject.registrationDate) ? "" : props.subject.registrationDate
                    }
                    error={!_.isEmpty(subjectRegErrors.REGISTRATION_DATE)}
                    helperText={t(subjectRegErrors.REGISTRATION_DATE)}
                    style={{ width: "30%" }}
                    margin="normal"
                    id="date-picker-dialog"
                    format={dateFormat}
                    placeholder={dateFormat}
                    onChange={date => {
                      const dateOfReg = _.isNil(date) ? undefined : new Date(date);
                      props.updateSubject("registrationDate", dateOfReg);
                      props.subject.registrationDate = dateOfReg;
                      setValidationResultToError(props.subject.validateRegistrationDate());
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                      color: "primary"
                    }}
                  />
                </MuiPickersUtilsProvider>

                <LineBreak num={1} />
                {props.subject.subjectType.isPerson() && (
                  <React.Fragment>
                    <Typography variant="body1" gutterBottom className={classes.lableStyle}>
                      {t("firstName")}
                      {"*"}
                    </Typography>
                    <TextField
                      type="text"
                      autoComplete="off"
                      required
                      name="firstName"
                      value={props.subject.firstName || ""}
                      error={!_.isEmpty(subjectRegErrors.FIRST_NAME)}
                      helperText={t(subjectRegErrors.FIRST_NAME)}
                      style={{ width: "30%" }}
                      // label={t("firstName")}
                      onChange={e => {
                        props.updateSubject("firstName", e.target.value);
                        props.subject.setFirstName(e.target.value);
                        setValidationResultToError(props.subject.validateFirstName());
                      }}
                    />
                    <LineBreak num={1} />
                    <Typography variant="body1" gutterBottom className={classes.lableStyle}>
                      {t("lastName")}
                      {"*"}
                    </Typography>
                    <TextField
                      type="text"
                      autoComplete="off"
                      required
                      name="lastName"
                      value={props.subject.lastName || ""}
                      error={!_.isEmpty(subjectRegErrors.LAST_NAME)}
                      helperText={t(subjectRegErrors.LAST_NAME)}
                      style={{ width: "30%" }}
                      // label={t("lastName")}
                      onChange={e => {
                        props.updateSubject("lastName", e.target.value);
                        props.subject.setLastName(e.target.value);
                        setValidationResultToError(props.subject.validateLastName());
                      }}
                    />
                    <LineBreak num={1} />
                    <DateOfBirth
                      dateOfBirth={props.subject.dateOfBirth || null}
                      dateOfBirthVerified={props.subject.dateOfBirthVerified}
                      dobErrorMsg={subjectRegErrors.DOB}
                      onChange={date => {
                        const dateOfBirth = _.isNil(date) ? undefined : new Date(date);
                        props.updateSubject("dateOfBirth", dateOfBirth);
                        props.subject.setDateOfBirth(dateOfBirth);
                        setValidationResultToError(props.subject.validateDateOfBirth());
                      }}
                      markVerified={verified =>
                        props.updateSubject("dateOfBirthVerified", verified)
                      }
                    />
                    <LineBreak num={1} />
                    <CodedFormElement
                      groupName={t("gender")}
                      items={sortBy(props.genders, "name")}
                      isChecked={item => item && get(props, "subject.gender.uuid") === item.uuid}
                      mandatory={true}
                      errorMsg={subjectRegErrors.GENDER}
                      onChange={selected => {
                        props.updateSubject("gender", selected);
                        props.subject.gender = selected;
                        setValidationResultToError(props.subject.validateGender());
                      }}
                    />
                    {renderAddress()}
                  </React.Fragment>
                )}

                {!props.subject.subjectType.isPerson() && (
                  <React.Fragment>
                    <Typography variant="body1" gutterBottom className={classes.lableStyle}>
                      {/* {t("Name")} */}
                      Name
                    </Typography>
                    <TextField
                      // label="Name"
                      type="text"
                      autoComplete="off"
                      required
                      error={!_.isEmpty(subjectRegErrors.FIRST_NAME)}
                      helperText={t(subjectRegErrors.FIRST_NAME)}
                      name="firstName"
                      value={props.subject.firstName}
                      style={{ width: "30%" }}
                      onChange={e => {
                        props.updateSubject("firstName", e.target.value);
                        props.subject.setFirstName(e.target.value);
                        setValidationResultToError(props.subject.validateFirstName());
                      }}
                    />
                    {renderAddress()}
                  </React.Fragment>
                )}
                <LineBreak num={1} />
              </Box>
              <Box
                className={classes.buttomboxstyle}
                display="flex"
                flexDirection={"row"}
                flexWrap="wrap"
                justifyContent="flex-start"
              >
                <Box>
                  <Chip
                    className={classes.prevbuttonspace}
                    label={t("previous")}
                    disabled
                    variant="outlined"
                  />

                  <RelativeLink
                    to="form"
                    params={{
                      type: props.subject.subjectType.name,
                      from: props.location.pathname + props.location.search
                    }}
                    noUnderline
                  >
                    <Chip
                      className={classes.nextBtn}
                      label={t("next")}
                      onClick={e => handleNext(e)}
                    />
                  </RelativeLink>
                </Box>
              </Box>
            </Paper>
          </div>
        )}
      </div>
    </div>
  ) : (
    <CustomizedBackdrop load={false} />
  );
};

const mapStateToProps = state => ({
  user: state.app.user,
  genders: state.dataEntry.metadata.genders,
  addressLevelTypes: state.dataEntry.metadata.operationalModules.addressLevelTypes,
  customRegistrationLocations:
    state.dataEntry.metadata.operationalModules.customRegistrationLocations,
  form: state.dataEntry.registration.registrationForm,
  subject: state.dataEntry.registration.subject,
  loaded: state.dataEntry.registration.loaded,
  saved: state.dataEntry.registration.saved,
  selectedAddressLevelType: state.dataEntry.registration.selectedAddressLevelType
});

const mapDispatchToProps = {
  getRegistrationForm,
  updateSubject,
  getGenders,
  saveSubject,
  onLoad,
  setSubject,
  saveCompleteFalse,
  setValidationResults,
  selectAddressLevelType
};

const ConnectedDefaultPage = withRouter(
  withParams(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(DefaultPage)
  )
);

const mapFormStateToProps = state => ({
  form: state.dataEntry.registration.registrationForm,
  obsHolder:
    state.dataEntry.registration.subject &&
    new ObservationsHolder(state.dataEntry.registration.subject.observations),
  observations:
    state.dataEntry.registration.subject && state.dataEntry.registration.subject.observations,
  saved: state.dataEntry.registration.saved,
  subject: state.dataEntry.registration.subject,
  onSaveGoto: `/app/subject?uuid=${state.dataEntry.registration.subject.uuid}`,
  validationResults: state.dataEntry.registration.validationResults,
  registrationFlow: true,
  filteredFormElements: state.dataEntry.rulesReducer.filteredFormElements,
  entity: state.dataEntry.registration.subject
});

const mapFormDispatchToProps = {
  updateObs,
  onSave: saveSubject,
  setValidationResults,
  setFilteredFormElements
};

const RegistrationForm = withRouter(
  connect(
    mapFormStateToProps,
    mapFormDispatchToProps
  )(FormWizard)
);

const SubjectRegister = props => {
  const classes = useStyles();
  const match = props.match;
  const edit = match.path === "/app/editSubject";

  React.useEffect(() => {
    (async function fetchData() {
      if (edit) {
        const subjectUuid = props.match.queryParams.uuid;
        await props.onLoadEdit(subjectUuid);
      } else {
        await props.onLoad(props.match.queryParams.type);
      }
      props.saveCompleteFalse();
    })();
  }, [match.queryParams.type]);

  return (
    <Fragment>
      <Breadcrumbs path={props.match.path} />
      <Paper className={classes.root}>
        <Route exact path={`${match.path}`} component={() => <ConnectedDefaultPage />} />
        <Route
          path={`${match.path}/form`}
          component={() => <RegistrationForm fetchRulesResponse={fetchRegistrationRulesResponse} />}
        />
      </Paper>
    </Fragment>
  );
};

const mapRegisterDispatchToProps = {
  onLoad,
  setSubject,
  saveCompleteFalse,
  onLoadEdit
};

export default withRouter(
  withParams(
    connect(
      null,
      mapRegisterDispatchToProps
    )(SubjectRegister)
  )
);
