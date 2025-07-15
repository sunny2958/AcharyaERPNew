import { lazy, memo, useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, Grid, Typography } from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import ModalWrapper from "../../../components/ModalWrapper";
import { Visibility } from "@mui/icons-material";
import useAlert from "../../../hooks/useAlert";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";

const FeeTemplateView = lazy(() =>
  import("../../../pages/forms/feetemplateMaster/ViewFeetemplateSubAmount")
);

const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

const ProgramDetailsForm = memo(
  ({
    programValues,
    setProgramValues,
    data,
    noOfYears,
    prefferedCheck,
    nameExist,
  }) => {
    const [acyearOptions, setAcyearOptions] = useState([]);
    const [schoolOptions, setSchoolOptions] = useState([]);
    const [admissionCategoryOptions, setAdmissionCategoryOptions] = useState(
      []
    );
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);
    const [feeTemplateOptions, setFeeTemplateOptions] = useState([]);
    const [programData, setProgramData] = useState();
    const [modalOpen, setModalOpen] = useState(false);

    const { setAlertMessage, setAlertOpen } = useAlert();

    const checks = {};
    const errorMessages = {};

    if (prefferedCheck) {
      checks["preferredName"] = [!prefferedCheck];
      errorMessages["preferredName"] = [
        "Preffered name is taken please alter only with text !!",
      ];
    }

    const {
      ac_year: acYear,
      school_name: school,
      program_name: program,
      program_specialization_name: specialization,
      fee_template_name: feeTemplate,
      is_regular: isRegular,
      fee_template_id: feeTemplateId,
    } = data;

    const feeTemplateName = feeTemplateOptions.find(
      (obj) => obj.value === programValues.feeTemplateId
    );

    useEffect(() => {
      fetchData();
    }, []);

    useEffect(() => {
      getPrograms();
    }, [programValues.schoolId]);

    useEffect(() => {
      getFeeTemplates();
    }, [
      programValues.schoolId,
      programValues.programId,
      programValues.admissionCategory,
      programValues.admissionSubCategory,
      programValues.isNri,
      programData,
    ]);

    useEffect(() => {
      getAdmissionSubCategory();
    }, [programValues.admissionCategory]);

    const fetchData = async () => {
      try {
        const [
          { data: acyearResponse },
          { data: schoolResponse },
          { data: feeCategoryResponse },
        ] = await Promise.all([
          axios.get("/api/academic/academic_year"),
          axios.get("/api/institute/school"),
          axios.get("/api/student/FeeAdmissionCategory"),
        ]);

        const acyearOptionData = [];
        acyearResponse?.data?.forEach((obj) => {
          acyearOptionData.push({
            value: obj.ac_year_id,
            label: obj.ac_year,
          });
        });

        const schoolOptionData = [];
        schoolResponse?.data?.forEach((obj) => {
          schoolOptionData.push({
            value: obj.school_id,
            label: obj.school_name,
          });
        });

        const feeCategoryOptionData = [];
        feeCategoryResponse?.data?.forEach((obj) => {
          feeCategoryOptionData.push({
            value: obj.fee_admission_category_id,
            label: obj.fee_admission_category_type,
          });
        });

        setAcyearOptions(acyearOptionData);
        setSchoolOptions(schoolOptionData);
        setAdmissionCategoryOptions(feeCategoryOptionData);
      } catch (err) {
        setAlertMessage({
          severity: "error",
          message: err.response?.data?.message || "Failed to load data !!",
        });
        setAlertOpen(true);
      }
    };

    const getPrograms = async () => {
      const { schoolId } = programValues;
      if (!schoolId) return null;

      try {
        const { data: response } = await axios.get(
          `/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`
        );
        const optionData = [];
        const responseData = response.data;
        response.data.forEach((obj) => {
          optionData.push({
            value: obj.program_specialization_id,
            label: `${obj.program_short_name} - ${obj.program_specialization_name}`,
          });
        });
        const programObject = responseData.reduce((acc, next) => {
          acc[next.program_specialization_id] = next;
          return acc;
        }, {});

        setProgramOptions(optionData);
        setProgramData(programObject);
      } catch (err) {
        setAlertMessage({
          severity: "error",
          message:
            err.response?.data?.message || "Failed to load the programs data",
        });
        setAlertOpen(true);
      }
    };

    const getFeeTemplates = async () => {
      const {
        acYearId,
        schoolId,
        programId,
        admissionCategory,
        admissionSubCategory,
        isNri,
      } = programValues;

      if (
        !(
          acYearId &&
          schoolId &&
          programId &&
          admissionCategory &&
          admissionSubCategory &&
          programData
        )
      )
        return null;
      try {
        const { data: response } = await axios.get(
          `/api/finance/FetchAllFeeTemplateDetails/${acYearId}/${schoolId}/${
            programData[programValues.programId].program_id
          }/${programId}/${admissionCategory}/${admissionSubCategory}/${isNri}`
        );
        const optionData = [];
        response?.data?.forEach((obj) => {
          optionData.push({
            value: obj.fee_template_id,
            label: obj.fee_template_name,
          });
        });
        setFeeTemplateOptions(optionData);
      } catch (err) {
        console.error(err);

        setAlertMessage({
          severity: "error",
          message:
            err.response?.data?.message ||
            "Failed to load the fee template data",
        });
        setAlertOpen(true);
      }
    };

    const getAdmissionSubCategory = async () => {
      const { admissionCategory } = programValues;
      if (!admissionCategory) return null;
      try {
        const { data: response } = await axios.get(
          `/api/student/FetchFeeAdmissionSubCategory/${programValues.admissionCategory}`
        );
        const optionData = [];
        response?.data?.forEach((obj) => {
          optionData.push({
            value: obj.fee_admission_sub_category_id,
            label: obj.fee_admission_sub_category_name,
          });
        });
        setSubCategoryOptions(optionData);
      } catch (err) {
        setAlertMessage({
          severity: "error",
          message:
            err.response?.data?.message ||
            "Failed to load fee admission categories",
        });
        setAlertOpen(true);
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      // (/^[A-Za-z]*$/) --> only letters, no numbers, no spaces.
      if (name === "preferredName") {
        if (/^[A-Za-z]*$/.test(value)) {
          setProgramValues((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
      } else {
        setProgramValues((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    };

    const handleChangeAdvance = (name, newValue) => {
      setProgramValues((prev) => ({ ...prev, [name]: newValue }));
    };

    const DisplayContent = ({ label, value }) => {
      return (
        <>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2">{label}</Typography>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="subtitle2" color="textSecondary">
              {value}
            </Typography>
          </Grid>
        </>
      );
    };

    return (
      <>
        <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1400}>
          <Box sx={{ padding: 1 }}>
            <FeeTemplateView id={feeTemplateId} />
          </Box>
        </ModalWrapper>

        {roleShortName === "SAA" ? (
          <Grid container rowSpacing={4} columnSpacing={2}>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="acYearId"
                label="Ac Year"
                value={programValues.acYearId}
                options={acyearOptions}
                handleChangeAdvance={handleChangeAdvance}
                disabled
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="schoolId"
                label="School"
                value={programValues.schoolId}
                options={schoolOptions}
                handleChangeAdvance={handleChangeAdvance}
                disabled
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="programId"
                label="Program"
                value={programValues.programId}
                options={programOptions}
                handleChangeAdvance={handleChangeAdvance}
                disabled
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="admissionCategory"
                label="Admission Category"
                value={programValues.admissionCategory}
                options={admissionCategoryOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="admissionSubCategory"
                label="Admission Sub Category"
                value={programValues.admissionSubCategory}
                options={subCategoryOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            {programValues.admissionSubCategory && (
              <>
                <Grid item xs={12} md={4} lg={1.5}>
                  <CustomRadioButtons
                    name="isNri"
                    label="Is NRI"
                    value={programValues.isNri}
                    items={[
                      {
                        value: true,
                        label: "Yes",
                      },
                      {
                        value: false,
                        label: "No",
                      },
                    ]}
                    handleChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={2.5}>
                  <CustomAutocomplete
                    name="feeTemplateId"
                    label="Fee Template"
                    value={programValues.feeTemplateId}
                    options={feeTemplateOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    required
                  />
                </Grid>
                {programValues.feeTemplateId && (
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setModalOpen(true)}
                      endIcon={<Visibility />}
                    >
                      {feeTemplateName?.label}
                    </Button>
                  </Grid>
                )}

                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="currentYearSem"
                    label="Current Year/Sem"
                    value={programValues.currentYearSem}
                    options={noOfYears}
                    handleChangeAdvance={handleChangeAdvance}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="preferredName"
                    label="Preffered Name For Email"
                    value={programValues.preferredName}
                    handleChange={handleChange}
                    checks={checks.preferredName}
                    errors={errorMessages.preferredName}
                    highlightError={prefferedCheck}
                    disabled={nameExist}
                  />
                </Grid>
              </>
            )}
          </Grid>
        ) : (
          <Grid container columnSpacing={3} rowSpacing={1}>
            <Grid item xs={12} md={6}>
              <Grid container columnSpacing={2} rowSpacing={1}>
                <DisplayContent label="AC Year" value={acYear} />
                <DisplayContent label="School" value={school} />
                <DisplayContent label="Program" value={program} />
                <DisplayContent label="Specialization" value={specialization} />
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2">Fee Template</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setModalOpen(true)}
                    endIcon={<Visibility />}
                  >
                    {feeTemplate}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container columnSpacing={4} rowSpacing={1}>
                <Grid item xs={12} md={6}>
                  <CustomAutocomplete
                    name="currentYearSem"
                    label="Current Year/Sem"
                    value={programValues.currentYearSem}
                    options={noOfYears}
                    handleChangeAdvance={handleChangeAdvance}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomTextField
                    name="preferredName"
                    label="Preffered Name For Email"
                    value={programValues.preferredName}
                    handleChange={handleChange}
                    checks={checks.preferredName}
                    errors={errorMessages.preferredName}
                    highlightError={prefferedCheck}
                    disabled={nameExist}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </>
    );
  }
);

export default ProgramDetailsForm;
