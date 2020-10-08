import React, { Fragment } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import { Observation } from "avni-models";
import { ConceptService, i18n } from "../services/ConceptService";
import { useTranslation } from "react-i18next";
import ErrorIcon from "@material-ui/icons/Error";
import PropTypes from "prop-types";
import { isEmpty, isNil } from "lodash";
import useCommonStyles from "dataEntryApp/styles/commonStyles";

const useStyles = makeStyles(theme => ({
  listItem: {
    paddingBottom: "0px",
    paddingTop: "0px"
  },
  abnormalColor: {
    color: "#ff4f33"
  }
}));

const Observations = ({ observations, additionalRows, form, customKey }) => {
  if (isEmpty(observations)) {
    return <div />;
  }

  const conceptService = new ConceptService();
  const i = new i18n();
  const { t } = useTranslation();
  const classes = useStyles();
  const commonStyles = useCommonStyles();

  const renderObs = (value, isAbnormal) => {
    return isAbnormal ? (
      <span className={classes.abnormalColor}>
        {" "}
        <ErrorIcon /> {value}
      </span>
    ) : (
      value
    );
  };

  const orderedObs = isNil(form) ? observations : form.orderObservations(observations);

  const rows = orderedObs.map((obs, index) => {
    return (
      <TableRow key={`${index}-${customKey}`}>
        <TableCell style={{ color: "#555555" }} component="th" scope="row" width="50%">
          {t(obs.concept["name"])}
        </TableCell>
        <TableCell align="left" width="50%">
          <div>
            {renderObs(t(Observation.valueAsString(obs, conceptService, i)), obs.isAbnormal())}
          </div>
        </TableCell>
      </TableRow>
    );
  });

  additionalRows &&
    additionalRows.forEach((row, index) => {
      rows.unshift(
        <TableRow key={observations.length + index}>
          <TableCell style={{ color: "#555555" }} component="th" scope="row" width="50%">
            {row.label}
          </TableCell>
          <TableCell align="left" width="50%">
            <div>{row.value}</div>
          </TableCell>
        </TableRow>
      );
    });

  return (
    <div>
      <Fragment>
        <Table className={commonStyles.tableContainer} size="small" aria-label="a dense table">
          <TableBody>{rows}</TableBody>
        </Table>
      </Fragment>
    </div>
  );
};

Observations.propTypes = {
  observations: PropTypes.arrayOf(Observation).isRequired,
  additionalRows: PropTypes.arrayOf({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })
};

export default Observations;