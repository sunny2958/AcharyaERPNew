import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import { type } from "@testing-library/user-event/dist/cjs/utility/type.js";

const CustomMultipleAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomMultipleAutocomplete")
);
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);

const CustomRadioButtons = lazy(() =>
  import("../../../components/Inputs/CustomRadioButtons")
);

const initialValues = {
  acYearId: null,
  admcategoryId: null,
  admSubCategoryId: null,
  programTypeId: null,
  currencyTypeId: null,
  schoolId: null,
  programId: null,
  programSpeId: [],
  nri: "No",
  isSaarc: false,
  nationality: "",
  yearsemId: "",
  uniformStatus: "Yes",
  laptopStatus: "No",
  remarks: "",

  feeTemplateName: "",
  feeYearOne: "",
  feeYearTwo: "",
  feeYearThree: "",
  feeYearFour: "",
  feeYearFive: "",
  feeYearSix: "",
  feeYearSeven: "",
  feeYearEight: "",
  feeYearNine: "",
  feeYearTen: "",
  feeYearEleven: "",
  feeYearTwelve: "",
  feeYearTotal: "",
  paidAtBoard: false,
  approvedBy: "",
  approvedStatus: "",
  approvedDate: null,
  isRegular: true,
  remarks: "",
};

const requiredFields = [
  "acYearId",
  "admcategoryId",
  "admSubCategoryId",
  "programTypeId",
  "currencyTypeId",
  "schoolId",
  "programId",
  "programSpeId",
];

const roleName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

function FeeTemplate() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [admCategoryOptions, setAdmCategoryOptions] = useState([]);
  const [admSubCategoryOptions, setAdmSubCategoryOptions] = useState([]);
  const [programTypeOptions, setProgramTypeOptions] = useState([]);
  const [currencyTypeOptions, setCurrencyTypeOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [feetempId, setFeetempId] = useState(null);
  const [noOfYears, setNoOfYears] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const state = location?.state;

  const checks = {};

  const errorMessages = {};

  useEffect(() => {
    getAcademicYearData();
    getAdmissionCategoryData();
    getProgramTypeData();
    getCurrencyTypeData();
    getSchoolData();
    getProgramSpe();

    if (pathname.toLowerCase() === "/feetemplatemaster/feetemplate/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Fee Template Master", link: "/FeetemplateMaster" },
        { name: "Fee Template" },
      ]);
    } else {
      setIsNew(false);
      getFeetemplateData();
      getProgramSpe();

      state
        ? setCrumbs([
            { name: "Fee Template Master", link: "/FeetemplateApprovalIndex" },
            { name: "Fee Template" },
            { name: "Update" },
          ])
        : setCrumbs([
            { name: "Fee Template Master", link: "/FeetemplateMaster" },
            { name: "Fee Template" },
            { name: "Update" },
          ]);
    }
  }, [pathname, values.programId, values.acYearId, values.schoolId]);

  useEffect(() => {
    getProgramData();
    getAdmissionSubCategoryData();
    getAllFeetemplateDetails();
  }, [
    values.acYearId,
    values.admcategoryId,
    values.admSubCategoryId,
    values.programTypeId,
    values.currencyTypeId,
    values.schoolId,
    values.programId,
  ]);

  useEffect(() => {
    getYearsemData();
  }, [values.programId, values.programTypeId]);

  const getAcademicYearData = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.ac_year_id,
            label: obj.ac_year,
          });
        });
        setAcademicYearOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getAdmissionCategoryData = async () => {
    await axios
      .get(`/api/student/FeeAdmissionCategory`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.fee_admission_category_id,
            label: obj.fee_admission_category_type,
            is_regular: obj.is_regular,
          });
        });
        setAdmCategoryOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getAdmissionSubCategoryData = async () => {
    if (values.admcategoryId)
      await axios
        .get(
          `/api/student/FetchFeeAdmissionSubCategory/${values.admcategoryId}`
        )
        .then((res) => {
          const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.fee_admission_sub_category_id,
              label: obj.fee_admission_sub_category_name,
              board_unique_id: obj.board_unique_id,
            });
          });
          setAdmSubCategoryOptions(data);
        })
        .catch((err) => console.error(err));
  };

  const getProgramTypeData = async () => {
    await axios
      .get(`/api/academic/ProgramType`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.program_type_id,
            label: obj.program_type_name,
          });
        });
        setProgramTypeOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getCurrencyTypeData = async () => {
    await axios
      .get(`/api/finance/CurrencyType`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.currency_type_id,
            label: obj.currency_type_name,
            currencyShortName: obj.currency_type_short_name,
          });
        });
        setCurrencyTypeOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.school_id,
            label: obj.school_name,
          });
        });
        setSchoolOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getProgramData = async () => {
    if (values.schoolId)
      await axios
        .get(
          `/api/academic/fetchProgram1/${values.acYearId}/${values.schoolId}`
        )
        .then((res) => {
          const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.program_id,
              label: obj.program_name,
              number_of_semester: obj.number_of_semester,
              number_of_years: obj.number_of_years,
              program_type_name: obj.program_type_name,
              program_short_name: obj.program_short_name,
            });
          });
          setProgramOptions(data);
        })
        .catch((err) => console.error(err));
  };

  const getYearsemData = async () => {
    try {
      if (values.programId) {
        const programsOptions = await axios.get(
          `/api/academic/fetchProgram1/${values.acYearId}/${values.schoolId}`
        );

        const programTypesOptions = await axios.get(
          `/api/academic/ProgramType`
        );

        const years = [];

        const programSelected = programsOptions.data.data.find(
          (obj) => obj.program_id === values.programId
        );

        const programTypeSelected = programTypesOptions.data.data.find(
          (obj) => obj.program_type_id === values.programTypeId
        );

        if (programSelected.program_type_name.toLowerCase() === "yearly") {
          for (let i = 1; i <= programSelected.number_of_years; i++) {
            years.push({ label: "Year" + "-" + i, value: i });
          }
        }

        if (programSelected.program_type_name.toLowerCase() === "semester") {
          for (let i = 1; i <= programSelected.number_of_semester; i++) {
            years.push({ label: "Sem" + "-" + i, value: i });
          }
        }

        setNoOfYears(years);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getProgramSpe = async () => {
    if (values.schoolId && values.programId)
      await axios
        .get(
          `/api/academic/FetchProgramSpecialization/${values.schoolId}/${values.programId}`
        )
        .then((res) => {
          const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.program_specialization_id,
              label: obj.program_specialization_short_name,
            });
          });
          setProgramSpeOptions(data);
        })
        .catch((err) => console.error(err));
  };

  const getAllFeetemplateDetails = async () => {
    try {
      if (
        values.acYearId &&
        values.admcategoryId &&
        values.admSubCategoryId &&
        values.programTypeId &&
        values.currencyTypeId &&
        values.schoolId &&
        values.programId
      ) {
        const resOne = await axios.get(
          `/api/finance/allFeeTemplateDetail/${values.acYearId}/${values.admcategoryId}/${values.admSubCategoryId}/${values.nationality}/${values.programTypeId}/${values.currencyTypeId}/${values.schoolId}/${values.programId}`
        );
        if (resOne.status == 200 || resOne.status == 201) {
          const a = resOne.data.data.map(
            (obj) => obj.program_specialization_id
          );

          if (isNew)
            axios
              .get(
                `/api/academic/FetchProgramSpecialization/${values.schoolId}/${values.programId}`
              )
              .then((res) => {
                setProgramSpeOptions(
                  res.data.data
                    .filter((obj) =>
                      resOne.data.data.length > 0
                        ? resOne.data.data[0].program_specialization_id
                            .split(",")
                            .includes(
                              obj.program_specialization_id.toString()
                            ) === false
                        : a.includes(
                            obj.program_specialization_id.toString()
                          ) === false
                    )
                    .map((obj) => ({
                      value: obj.program_specialization_id,
                      label: obj.program_specialization_short_name,
                    }))
                );
              });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFeetemplateData = async () => {
    await axios
      .get(`/api/finance/getFeeTemplateDetailsData/${id}`)
      .then(async (res) => {
        const speIds = res?.data?.data?.program_specialization_id
          ?.split(",")
          ?.map((obj) => Number(obj));

        setValues((prev) => ({
          ...prev,
          acYearId: res.data.data.ac_year_id,
          admcategoryId: res.data.data.fee_admission_category_id,
          admSubCategoryId: res.data.data.fee_admission_sub_category_id,
          nri: res.data.data.Is_nri ? "Yes" : "No",
          nationality: res.data.data.nationality,
          isSaarc: res.data.data.is_saarc,
          paidAtBoard: res.data.data.Is_paid_at_board ? "Yes" : "No",
          programTypeId: res.data.data.program_type_id,
          currencyTypeId: res.data.data.currency_type_id,
          schoolId: res.data.data.school_id,
          programId: res.data.data.program_id,
          programSpeId: speIds,
          remarks: res.data.data.remarks,
          feeTemplateName: res.data.data.fee_template_name,
          yearsemId: res.data.data.lat_year_sem,
          uniformStatus: res.data.data.uniform_status ? "Yes" : "No",
          laptopStatus: res.data.data.laptop_status ? "Yes" : "No",
          approvedStatus: res.data.data.approved_status,
          approvedDate: res.data.data.approved_date,
          approvedBy: res.data.data.approved_by,
          feeYearOne: res.data.data.fee_year1_amt,
          feeYearTwo: res.data.data.fee_year2_amt,
          feeYearThree: res.data.data.fee_year3_amt,
          feeYearFour: res.data.data.fee_year4_amt,
          feeYearFive: res.data.data.fee_year5_amt,
          feeYearSix: res.data.data.fee_year6_amt,
          feeYearSeven: res.data.data.fee_year7_amt,
          feeYearEight: res.data.data.fee_year8_amt,
          feeYearNine: res.data.data.fee_year9_amt,
          feeYearTen: res.data.data.fee_year10_amt,
          feeYearEleven: res.data.data.fee_year11_amt,
          feeYearTwelve: res.data.data.fee_year12_amt,
          feeYearTotal: res.data.data.fee_year_total_amount,
          remarks: res.data.data.remarks,
        }));

        setFeetempId(res.data.data.fee_template_id);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "admSubCategoryId") {
      const subCategorySelected = admSubCategoryOptions.find(
        (obj) => obj.value === newValue
      );

      setValues((prev) => ({
        ...prev,
        [name]: newValue,
        paidAtBoard:
          subCategorySelected.board_unique_id !== null ? "Yes" : "No",
      }));
    }

    if (name === "admcategoryId") {
      const categorySelected = admCategoryOptions.find(
        (obj) => obj.value === newValue
      );

      setValues((prev) => ({
        ...prev,
        [name]: newValue,
        isRegular: categorySelected.is_regular,
      }));
    }

    if (name === "programTypeId") {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }

    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.ac_year_id = values.acYearId;
      temp.fee_admission_category_id = values.admcategoryId;
      temp.fee_admission_sub_category_id = values.admSubCategoryId;
      temp.nationality = values.nationality;
      temp.is_nri = values.nri;
      temp.program_type_id = values.programTypeId;
      temp.currency_type_id = values.currencyTypeId;
      temp.school_id = values.schoolId;
      temp.program_id = values.programId;
      temp.program_specialization_id = values.programSpeId.toString();
      temp.is_paid_at_board = values.paidAtBoard === "Yes" ? true : false;
      temp.is_saarc = values.isSaarc;
      temp.program_sht = programOptions
        .filter((val) => val.value === values.programId)
        .map((obj) => obj.program_short_name)
        .toString();
      temp.fee_admission_category = admCategoryOptions
        .filter((val) => val.value === values.admcategoryId)
        .map((obj) => obj.label)
        .toString();
      temp.currency_short = currencyTypeOptions
        .filter((val) => val.value === values.currencyTypeId)
        .map((obj) => obj.currencyShortName)
        .toString();
      temp.is_nri = values.nri === "Yes" ? true : false;
      temp.lat_year_sem = values.yearsemId ? values.yearsemId : 1;
      temp.laptop_status = values.laptopStatus === "Yes" ? true : false;
      temp.uniform_status = values.uniformStatus === "Yes" ? true : false;
      temp.remarks = values.remarks;

      await axios
        .post(`/api/finance/FeeTemplate`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status == 201) {
            navigate(
              `/Feetemplatemaster/Feetemplatesubamount/${
                res.data.data[0].fee_template_id
              }/${values.yearsemId ? values.yearsemId : 1}`
            );

            setAlertMessage({
              severity: "success",
              message: "Form created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};

      temp.active = true;
      temp.fee_template_id = feetempId;
      temp.fee_template_name = values.feeTemplateName;
      temp.ac_year_id = values.acYearId;
      temp.fee_admission_category_id = values.admcategoryId;
      temp.fee_admission_sub_category_id = values.admSubCategoryId;
      temp.nationality = values.nationality;
      temp.is_nri = values.nri;
      temp.is_paid_at_board = values.paidAtBoard === "Yes" ? true : false;
      temp.is_saarc = values.isSaarc;
      temp.program_type_id = values.programTypeId;
      temp.currency_type_id = values.currencyTypeId;
      temp.school_id = values.schoolId;
      temp.program_id = values.programId;
      temp.program_specialization_id = values.programSpeId.toString();
      // temp.program_specialization = values.programSpecialization;
      temp.laptop_status = values.laptopStatus === "Yes" ? true : false;
      temp.uniform_status = values.uniformStatus === "Yes" ? true : false;
      temp.remarks = values.remarks;

      temp.fee_year1_amt = values.feeYearOne;
      temp.fee_year2_amt = values.feeYearTwo;
      temp.fee_year3_amt = values.feeYearThree;
      temp.fee_year4_amt = values.feeYearFour;
      temp.fee_year5_amt = values.feeYearFive;
      temp.fee_year6_amt = values.feeYearSix;
      temp.fee_year7_amt = values.feeYearSeven;
      temp.fee_year8_amt = values.feeYearEight;
      temp.fee_year9_amt = values.feeYearNine;
      temp.fee_year10_amt = values.feeYearTen;
      temp.fee_year11_amt = values.feeYearEleven;
      temp.fee_year12_amt = values.feeYearTwelve;
      temp.fee_year_total_amount = values.feeYearTotal;
      temp.approved_status = values.approvedStatus;
      temp.approved_date = values.approvedDate;
      temp.approved_by = values.approvedBy;
      temp.is_nri = values.nri === "Yes" ? true : false;
      temp.lat_year_sem = values.yearsemId ? values.yearsemId : 1;

      await axios
        .put(`/api/finance/FeeTemplate/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            state
              ? navigate("/FeetemplateApprovalIndex", { replace: true })
              : navigate("/FeetemplateMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Fee Template Updated",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="acYearId"
              label="Academic Year"
              value={values.acYearId}
              options={academicYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="admcategoryId"
              label="Admission Category"
              value={values.admcategoryId}
              options={admCategoryOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="admSubCategoryId"
              label="Admission Subcategory"
              value={values.admSubCategoryId}
              options={admSubCategoryOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          {/* {values.admSubCategoryId && (
            <>
              <Grid item xs={12} md={3}>
                <CustomRadioButtons
                  name="paidAtBoard"
                  label="Is Paid At Board"
                  value={values.paidAtBoard}
                  items={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                  handleChange={handleChange}
                  disabled
                  required
                />
              </Grid>{" "}
            </>
          )} */}
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="programTypeId"
              label="Collection Pattern"
              value={values.programTypeId}
              options={programTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomSelect
              name="nationality"
              label="Nationality"
              value={values.nationality}
              items={[
                { label: "INDIAN", value: "INDIAN" },
                { label: "FOREIGN", value: "FOREIGN" },
              ]}
              handleChange={handleChange}
              disabled={!isNew}
              required
            />
          </Grid>
          {values.nationality === "INDIAN" ? (
            <>
              <Grid item xs={12} md={3}>
                <CustomRadioButtons
                  name="nri"
                  label="Is NRI"
                  value={values.nri}
                  items={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                  handleChange={handleChange}
                  disabled={!isNew}
                  required
                />
              </Grid>
            </>
          ) : (
            <></>
          )}
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="currencyTypeId"
              label="Currency Type"
              value={values.currencyTypeId}
              options={currencyTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="programId"
              label="Program"
              value={values.programId}
              options={programOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomMultipleAutocomplete
              name="programSpeId"
              label="Program Specialization"
              value={values.programSpeId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={
                !isNew &&
                roleName.toLowerCase() !== "saa" &&
                roleName.toLowerCase() !== "hod"
              }
              required
            />
          </Grid>
          {!values.isRegular && isNew ? (
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="yearsemId"
                label="Year/Sem"
                value={values.yearsemId}
                options={noOfYears}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
          ) : (
            <></>
          )}

          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="uniformStatus"
              label="Uniform Status"
              value={values.uniformStatus}
              items={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="laptopStatus"
              label="Laptop Status"
              value={values.laptopStatus}
              items={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              multiline
              rows={2}
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={isNew ? handleCreate : handleUpdate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{isNew ? "Create" : "Update"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default FeeTemplate;
