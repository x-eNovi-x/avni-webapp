/// <reference types="Cypress" />

import { dashboardPage } from "../dashboardPage";
import { wizardPage } from "../wizardPage";
import { setupTest } from "../setup";
import { formWizardOrgPassword, formWizardOrgUsername } from "../../constants";

describe("Program Enrolment Flow tests for form wizard", () => {
  beforeEach(() => {
    setupTest.login(formWizardOrgUsername, formWizardOrgPassword);
    setupTest.cleanAllOptionsFromRegistration("Test Individual");
  });
  it("Enrolment page should give validation error and should not move to next page", () => {
    dashboardPage.openDashboard("Test Individual");
    dashboardPage.editProgramEnrolment("Program1");
    wizardPage.typeInput("Last FE of first FEG", 123);
    wizardPage.assertIfPageContains("123 is invalid");
    wizardPage.clickNext(); //it should not go to next page because of the error.
    wizardPage.assertIfPageContains("First FEG");
  });
  it("First FEG should be hidden by FEG rule", () => {
    dashboardPage.editProfile("Test Individual");
    wizardPage.clickNext();
    wizardPage.selectOption("Hide first FEG");
    wizardPage.clickNext();
    wizardPage.clickSave();
    dashboardPage.editProgramEnrolment("Program1");
    wizardPage.assertIfPageDoesNotContains(
      "First FEG",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.assertIfPageContains(
      "Second FEG",
      "Enrolment Date",
      "First FE of second FEG",
      "Last FE of second FEG"
    );
    wizardPage.clickNextNTimes(2);
    wizardPage.assertIfPageContains("Summary & Recommendations");
    wizardPage.clickPreviousNTimes(2);
    wizardPage.assertIfPageContains(
      "Second FEG",
      "Enrolment Date",
      "First FE of second FEG",
      "Last FE of second FEG"
    );
    wizardPage.clickNextNTimes(2);
    wizardPage.assertIfPageContains("Summary & Recommendations");
  });
  it("First FEG should be hidden by all FE rule", () => {
    dashboardPage.editProfile("Test Individual");
    wizardPage.clickNext();
    wizardPage.selectOptions("Hide first FE of first FEG", "Hide last FE of first FEG");
    wizardPage.clickNext();
    wizardPage.clickSave();
    dashboardPage.editProgramEnrolment("Program1");
    wizardPage.assertIfPageDoesNotContains(
      "First FEG",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.assertIfPageContains(
      "Second FEG",
      "Enrolment Date",
      "First FE of second FEG",
      "Last FE of second FEG"
    );
    wizardPage.clickNextNTimes(2);
    wizardPage.assertIfPageContains("Summary & Recommendations");
    wizardPage.clickPreviousNTimes(2);
    wizardPage.assertIfPageContains(
      "Second FEG",
      "Enrolment Date",
      "First FE of second FEG",
      "Last FE of second FEG"
    );
    wizardPage.clickNextNTimes(2);
    wizardPage.assertIfPageContains("Summary & Recommendations");
  });
  it("First FE in first FEG is hidden", () => {
    dashboardPage.editProfile("Test Individual");
    wizardPage.clickNext();
    wizardPage.selectOption("Hide first FE of first FEG");
    wizardPage.clickNext();
    wizardPage.clickSave();
    dashboardPage.editProgramEnrolment("Program1");
    wizardPage.assertIfPageContains("Enrolment Date", "First FEG", "Last FE of first FEG");
    wizardPage.assertIfPageDoesNotContains("First FE of first FEG");
    wizardPage.clickNextNTimes(3);
    wizardPage.assertIfPageContains("Summary & Recommendations");
    wizardPage.clickPreviousNTimes(3);
    wizardPage.assertIfPageContains("Enrolment Date", "First FEG", "Last FE of first FEG");
    wizardPage.clickNextNTimes(3);
    wizardPage.assertIfPageContains("Summary & Recommendations");
  });
  it("Last FE in first FEG is hidden", () => {
    dashboardPage.editProfile("Test Individual");
    wizardPage.clickNext();
    wizardPage.selectOption("Hide last FE of first FEG");
    wizardPage.clickNext();
    wizardPage.clickSave();
    dashboardPage.editProgramEnrolment("Program1");
    wizardPage.assertIfPageContains("Enrolment Date", "First FEG", "First FE of first FEG");
    wizardPage.assertIfPageDoesNotContains("Last FE of first FEG");
    wizardPage.clickNextNTimes(3);
    wizardPage.assertIfPageContains("Summary & Recommendations");
    wizardPage.clickPreviousNTimes(3);
    wizardPage.assertIfPageContains("Enrolment Date", "First FEG", "First FE of first FEG");
    wizardPage.assertIfPageDoesNotContains("Last FE of first FEG");
    wizardPage.clickNextNTimes(3);
    wizardPage.assertIfPageContains("Summary & Recommendations");
  });
  it("Second FEG should be hidden by FEG rule", () => {
    dashboardPage.editProfile("Test Individual");
    wizardPage.clickNext();
    wizardPage.selectOption("Hide second FEG");
    wizardPage.clickNext();
    wizardPage.clickSave();
    dashboardPage.editProgramEnrolment("Program1");
    wizardPage.assertIfPageContains(
      "Enrolment Date",
      "First FEG",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.clickNext();
    wizardPage.assertIfPageContains("Last FEG", "First FE of last FEG", "Last FE of last FEG");
    wizardPage.assertIfPageDoesNotContains("Second FEG");
    wizardPage.clickNext();
    wizardPage.assertIfPageContains("Summary & Recommendations");
    wizardPage.clickPreviousNTimes(2);
    wizardPage.assertIfPageContains(
      "First FEG",
      "Enrolment Date",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.clickNextNTimes(2);
    wizardPage.assertIfPageContains("Summary & Recommendations");
  });
  it("Second FEG is hidden using all FE rule", () => {
    dashboardPage.editProfile("Test Individual");
    wizardPage.clickNext();
    wizardPage.selectOptions("Hide first FE of second FEG", "Hide last FE of second FEG");
    wizardPage.clickNext();
    wizardPage.clickSave();
    dashboardPage.editProgramEnrolment("Program1");
    wizardPage.assertIfPageContains(
      "Enrolment Date",
      "First FEG",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.clickNext();
    wizardPage.assertIfPageContains("Last FEG", "First FE of last FEG", "Last FE of last FEG");
    wizardPage.assertIfPageDoesNotContains("Second FEG");
    wizardPage.clickNext();
    wizardPage.assertIfPageContains("Summary & Recommendations");
    wizardPage.clickPreviousNTimes(2);
    wizardPage.assertIfPageContains(
      "First FEG",
      "Enrolment Date",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.clickNextNTimes(2);
    wizardPage.assertIfPageContains("Summary & Recommendations");
  });
  it("First FE in second FEG is hidden", () => {
    dashboardPage.editProfile("Test Individual");
    wizardPage.clickNext();
    wizardPage.selectOptions("Hide first FE of second FEG");
    wizardPage.clickNext();
    wizardPage.clickSave();
    dashboardPage.editProgramEnrolment("Program1");
    wizardPage.assertIfPageContains(
      "Enrolment Date",
      "First FEG",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.clickNext();
    wizardPage.assertIfPageContains("Second FEG", "Last FE of second FEG");
    wizardPage.assertIfPageDoesNotContains("First FE of second FEG");
    wizardPage.clickNextNTimes(2);
    wizardPage.assertIfPageContains("Summary & Recommendations");
    wizardPage.clickPreviousNTimes(3);
    wizardPage.assertIfPageContains(
      "First FEG",
      "Enrolment Date",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.clickNextNTimes(3);
    wizardPage.assertIfPageContains("Summary & Recommendations");
  });
  it("Last FE in second FEG is hidden", () => {
    dashboardPage.editProfile("Test Individual");
    wizardPage.clickNext();
    wizardPage.selectOptions("Hide last FE of second FEG");
    wizardPage.clickNext();
    wizardPage.clickSave();
    dashboardPage.editProgramEnrolment("Program1");
    wizardPage.assertIfPageContains(
      "Enrolment Date",
      "First FEG",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.clickNext();
    wizardPage.assertIfPageContains("Second FEG", "First FE of second FEG");
    wizardPage.assertIfPageDoesNotContains("Last FE of second FEG");
    wizardPage.clickNextNTimes(2);
    wizardPage.assertIfPageContains("Summary & Recommendations");
    wizardPage.clickPreviousNTimes(3);
    wizardPage.assertIfPageContains(
      "First FEG",
      "Enrolment Date",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.clickNextNTimes(3);
    wizardPage.assertIfPageContains("Summary & Recommendations");
  });
  it("Last FEG should be hidden by FEG rule", () => {
    dashboardPage.editProfile("Test Individual");
    wizardPage.clickNext();
    wizardPage.selectOption("Hide last FEG");
    wizardPage.clickNext();
    wizardPage.clickSave();
    dashboardPage.editProgramEnrolment("Program1");
    wizardPage.assertIfPageContains(
      "Enrolment Date",
      "First FEG",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.clickNextNTimes(2);
    wizardPage.assertIfPageDoesNotContains("Last FEG");
    wizardPage.assertIfPageContains("Summary & Recommendations");
    wizardPage.clickPreviousNTimes(2);
    wizardPage.assertIfPageContains(
      "First FEG",
      "Enrolment Date",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.clickNextNTimes(2);
    wizardPage.assertIfPageContains("Summary & Recommendations");
  });
  it("Last FEG is hidden using all FE rule", () => {
    dashboardPage.editProfile("Test Individual");
    wizardPage.clickNext();
    wizardPage.selectOptions("Hide first FE of last FEG", "Hide last FE of last FEG");
    wizardPage.clickNext();
    wizardPage.clickSave();
    dashboardPage.editProgramEnrolment("Program1");
    wizardPage.assertIfPageContains(
      "Enrolment Date",
      "First FEG",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.clickNextNTimes(2);
    wizardPage.assertIfPageDoesNotContains("Last FEG");
    wizardPage.assertIfPageContains("Summary & Recommendations");
    wizardPage.clickPreviousNTimes(2);
    wizardPage.assertIfPageContains(
      "First FEG",
      "Enrolment Date",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.clickNextNTimes(2);
    wizardPage.assertIfPageContains("Summary & Recommendations");
  });
  it("First FE in last FEG is hidden", () => {
    dashboardPage.editProfile("Test Individual");
    wizardPage.clickNext();
    wizardPage.selectOption("Hide first FE of last FEG");
    wizardPage.clickNext();
    wizardPage.clickSave();
    dashboardPage.editProgramEnrolment("Program1");
    wizardPage.assertIfPageContains(
      "Enrolment Date",
      "First FEG",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.clickNextNTimes(2);
    wizardPage.assertIfPageContains("Last FEG", "Last FE of last FEG");
    wizardPage.assertIfPageDoesNotContains("First FE of last FEG");
    wizardPage.clickNext();
    wizardPage.assertIfPageContains("Summary & Recommendations");
    wizardPage.clickPreviousNTimes(3);
    wizardPage.assertIfPageContains(
      "First FEG",
      "Enrolment Date",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.clickNextNTimes(3);
    wizardPage.assertIfPageContains("Summary & Recommendations");
  });
  it("Last FE in last FEG is hidden", () => {
    dashboardPage.editProfile("Test Individual");
    wizardPage.clickNext();
    wizardPage.selectOption("Hide last FE of last FEG");
    wizardPage.clickNext();
    wizardPage.clickSave();
    dashboardPage.editProgramEnrolment("Program1");
    wizardPage.assertIfPageContains(
      "Enrolment Date",
      "First FEG",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.clickNextNTimes(2);
    wizardPage.assertIfPageContains("Last FEG", "First FE of last FEG");
    wizardPage.assertIfPageDoesNotContains("Last FE of last FEG");
    wizardPage.clickNext();
    wizardPage.assertIfPageContains("Summary & Recommendations");
    wizardPage.clickPreviousNTimes(3);
    wizardPage.assertIfPageContains(
      "First FEG",
      "Enrolment Date",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.clickNextNTimes(3);
    wizardPage.assertIfPageContains("Summary & Recommendations");
  });
  it("All the FE in the form are hidden", () => {
    dashboardPage.editProfile("Test Individual");
    wizardPage.clickNext();
    wizardPage.selectOption(
      "Hide first FE of first FEG",
      "Hide last FE of last FEG",
      "Hide last FE of first FEG",
      "Hide first FE of second FEG",
      "Hide last FE of second FEG",
      "Hide first FE of last FEG"
    );
    wizardPage.clickNext();
    wizardPage.clickSave();
    dashboardPage.editProgramEnrolment("Program1");
    wizardPage.assertIfPageDoesNotContains(
      "First FEG",
      "First FE of first FEG",
      "Last FE of first FEG"
    );
    wizardPage.assertIfPageContains("Enrolment Date");
    wizardPage.clickNext();
    wizardPage.assertIfPageContains("Summary & Recommendations");
    wizardPage.clickPrevious();
    wizardPage.assertIfPageContains("Enrolment Date");
    wizardPage.clickNext();
    wizardPage.assertIfPageContains("Summary & Recommendations");
  });
});
