import React, { useState, useEffect, lazy } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  styled,
  tableCellClasses,
  TableBody,
  CircularProgress,
} from "@mui/material";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { convertDateFormat } from "../../../utils/Utils";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
const CustomModal = lazy(() => import("../../../components/CustomModal"));
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker")
);

const initialValues = {
  department: "",
  employeeName: "",
  designation: "",
  dateofJoining: "",
  month: "",
  institute: "AUZ",
  proposedBasic: "",
  proposedSplPay: "",
  proposedGrosspay: "",
  proposedCtc: "",
  grossDifference: "",
  ctcDifference: "",
  remarks: "",
  proposedDesignation: "",
  proposedDepartment: "",
  proposedSalaryStructure: "",
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: "1px solid rgba(224, 224, 224, 1)",
    padding: 15,
  },
}));
const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId

function SalaryBudgetCreate() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    dept_id: "",
    fromDate: "",
    toDate: "",
    title: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const setCrumbs = useBreadcrumbs();
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [salStructureOptions, setSalStructureOptions] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [values, setValues] = useState(initialValues);
  const navigate = useNavigate();
  const rowData = location?.state?.row;
  const [formulaData, setFormulaData] = useState([]);

  const [headValues, setHeadValues] = useState();
  const [offerData, setOfferData] = useState([]);
  const [ctcData, setCtcData] = useState();
  const [slabData, setSlabData] = useState([]);
  const [isInitialDataReady, setIsInitialDataReady] = useState(false);

  // Initial data fetching
  useEffect(() => {
    async function fetchData() {
      await getData();
      await getDepartmentOptions();
      await getDesignationOptions();
      await getSalaryStructureOptions();
      await getSlabDetails();

      // Only fetch budget data if incrementCreationId is present
      if (rowData?.incrementCreationId) {
        await getBudgetData();
      }

      // Set breadcrumbs based on the presence of incrementCreationId
      if (rowData?.incrementCreationId) {
        setCrumbs([
          // { name: "Employee Details", link: "/SalaryIncrementEmpList" },
          { name: "Budget", link: "/BudgetCreatedIndex" },
          { name: "Update" },
        ]);
      } else {
        setCrumbs([
          // { name: "Employee Details", link: "/SalaryIncrementEmpList" },
          { name: "Budget", link: "/BudgetCreatedIndex" },
          { name: "Create" },
        ]);
      }
    }

    fetchData();
  }, [rowData?.incrementCreationId, rowData.empId]);

  // Fetch formula and slab details based on proposed salary structure
  useEffect(() => {
    if (values.proposedSalaryStructure) {
      async function fetchData() {
        await getFormulaData(values.proposedSalaryStructure);
        setIsInitialDataReady(true);
      }
      fetchData();
    }
  }, [values.proposedSalaryStructure]);

  // Run getBudgetData only after all initial data is fetched
  useEffect(() => {
    if (isInitialDataReady && rowData?.incrementCreationId) {
      getBudgetData();
    }
  }, [isInitialDataReady, rowData?.incrementCreationId]);

  // Call generateCtc when values.month changes
  useEffect(() => {
    if (values.month) {
      generateCtc();
    }
  }, [values.month]);

  const getFormulaData = async (id) => {
    if (id) {
      await axios
        .get(`/api/finance/getFormulaDetails/${id}`)
        .then((res) => {
          setFormulaData(res.data.data);

          // filtering lumspsum data
          const getLumpsum = res.data.data
            .filter((fil) => fil.salary_category === "Lumpsum")
            .map((obj) => obj.salaryStructureHeadPrintName);

          const newFormulaValues = {};
          getLumpsum.forEach((obj) => {
            if (Object.keys(offerData).length > 0) {
              newFormulaValues[obj] = offerData[obj];
            } else {
              newFormulaValues[obj] = "";
            }
          });

          setValues((prev) => ({
            ...prev,
            lumpsum: newFormulaValues,
            ctc: Object.keys(offerData).length > 0 ? offerData["ctc"] : "",
          }));

          const headsTemp = {};
          res.data.data.forEach((obj) => {
            headsTemp[obj.salaryStructureHeadPrintName] =
              offerData[obj.salaryStructureHeadPrintName];
          });
          setHeadValues(headsTemp);
        })
        .catch((err) => console.error(err));
    }
  };
  const getSlabDetails = async () => {
    await axios
      .get(`/api/getAllValues`)
      .then((res) => {
        setSlabData(res.data.data);
      })
      .then(() => {
        if (rowData?.incrementCreationId) {
          getBudgetData();
        }
      })
      .catch((err) => console.error(err));
  };

  const generateCtc = () => {
    const tempData = {};
    const tempValues = {};
    const earningData = [];
    const deductionData = [];
    const managementData = [];

    function calculate(catType, name, value, type, priority, head) {
      if (catType === "e") {
        earningData.push({
          headName: name,
          value: value || 0,
          type: type,
          priority: priority,
        });
      } else if (catType === "d") {
        deductionData.push({
          headName: name,
          value: value,
          type: type,
          priority: priority,
        });
      } else if (catType === "m") {
        managementData.push({
          headName: name,
          value: value || 0,
          type: type,
          priority: priority,
        });
      }

      tempValues[head] = value || 0;
    }

    let filterFormulaData = formulaData;
    if (values.isPf === "false") {
      filterFormulaData = filterFormulaData.filter(
        (obj) =>
          obj.salaryStructureHeadPrintName !== "pf" &&
          obj.salaryStructureHeadPrintName !== "management_pf"
      );
    }

    if (values.isPt === "false") {
      filterFormulaData = filterFormulaData.filter(
        (obj) => obj.salaryStructureHeadPrintName !== "pt"
      );
    }

    filterFormulaData
      .sort((a, b) => {
        return a.priority - b.priority;
      })
      .forEach((fil) => {
        if (fil.salary_category === "Lumpsum") {
          calculate(
            "e",
            fil.voucher_head,
            Math.round(values.lumpsum[fil.salaryStructureHeadPrintName]),
            fil.category_name_type,
            fil.priority,
            fil.salaryStructureHeadPrintName
          );
        } else if (fil.salary_category === "Formula") {
          const formulas = fil.formula_name.split(",");
          const formulaAmt = [];
          formulas.forEach((val) => {
            formulaAmt.push(tempValues[val]);
          });
          const amt = formulaAmt.reduce((a, b) => a + b);

          if (fil.category_name_type === "Earning") {
            calculate(
              "e",
              fil.voucher_head,
              Math.round((amt * fil.percentage) / 100),
              fil.category_name_type,
              fil.priority,
              fil.salaryStructureHeadPrintName
            );
          }

          if (fil.category_name_type === "Deduction") {
            const esiEarnings = [];
            earningData.forEach((te) => {
              esiEarnings.push(te.value);
            });
            const esiEarningAmt = esiEarnings.reduce((a, b) => a + b);

            switch (fil.salaryStructureHeadPrintName) {
              case "pf":
                amt <= fil?.gross_limit
                  ? calculate(
                    "d",
                    fil.voucher_head,
                    Math.round((amt * fil.percentage) / 100),
                    fil.category_name_type,
                    fil.priority,
                    fil.salaryStructureHeadPrintName
                  )
                  : calculate(
                    "d",
                    fil.voucher_head,
                    Math.round((fil?.gross_limit * fil.percentage) / 100),
                    fil.category_name_type,
                    fil.priority,
                    fil.salaryStructureHeadPrintName
                  );
                break;
              case "esi":
                if (esiEarningAmt < fil?.gross_limit) {
                  calculate(
                    "d",
                    fil.voucher_head,
                    Math.round((amt * fil.percentage) / 100),
                    fil.category_name_type,
                    fil.priority,
                    fil.salaryStructureHeadPrintName
                  );
                }
                break;
            }
          }

          if (fil.category_name_type === "Management") {
            const esicEarnings = [];
            earningData.forEach((te) => {
              esicEarnings.push(te.value);
            });
            const esicEarningAmt = esicEarnings.reduce((a, b) => a + b);

            switch (fil.salaryStructureHeadPrintName) {
              case "management_pf":
                amt <= fil.gross_limit
                  ? calculate(
                    "m",
                    fil.voucher_head,
                    Math.round((amt * fil.percentage) / 100),
                    fil.category_name_type,
                    fil.priority,
                    fil.salaryStructureHeadPrintName
                  )
                  : calculate(
                    "m",
                    fil.voucher_head,
                    Math.round((fil.gross_limit * fil.percentage) / 100),
                    fil.category_name_type,
                    fil.priority,
                    fil.salaryStructureHeadPrintName
                  );
                break;
              case "esic":
                if (esicEarningAmt < fil.gross_limit) {
                  calculate(
                    "m",
                    fil.voucher_head,
                    Math.round((amt * fil.percentage) / 100),
                    fil.category_name_type,
                    fil.priority,
                    fil.salaryStructureHeadPrintName
                  );
                }

                break;
            }
          }
        } else if (fil.salary_category === "slab") {
          const slots = slabData.filter(
            (sd) => sd.slab_details_id === fil.slab_details_id
          );

          const slotPrintNames = slots[0]?.["print_name"].split(",");
          const slotAmt = [];
          slotPrintNames?.forEach((m) => {
            slotAmt.push(tempValues[m] ? tempValues[m] : 0);
          });
          const amt = slotAmt.reduce((a, b) => a + b);

          slots?.forEach((rs) => {
            if (amt >= rs.min_value && amt <= rs.max_value) {
              calculate(
                fil.category_name_type[0].toLowerCase(),
                fil.voucher_head,
                rs.head_value,
                fil.category_name_type,
                fil.priority,
                fil.salaryStructureHeadPrintName
              );
            }
          });
        }
      });

    tempData["earnings"] = earningData;
    tempData["deductions"] = deductionData;
    tempData["management"] = managementData;
    let grossEarningAmt = 0;
    let totDeductionAmt = 0;
    let totManagementAmt = 0;

    if (tempData.earnings.length > 0) {
      const temp = [];
      tempData.earnings.forEach((te) => {
        temp.push(te.value);
      });
      grossEarningAmt = temp.reduce((a, b) => a + b);
    }

    if (tempData.deductions.length > 0) {
      const temp = [];
      tempData.deductions.forEach((te) => {
        temp.push(te.value);
      });
      totDeductionAmt = temp.reduce((a, b) => a + b);
    }

    if (tempData.management.length > 0) {
      const temp = [];
      tempData.management.forEach((te) => {
        temp.push(te.value);
      });
      totManagementAmt = temp.reduce((a, b) => a + b);
    }

    tempData["grossEarning"] = grossEarningAmt;
    tempData["totDeduction"] = totDeductionAmt;
    tempData["totManagement"] = totManagementAmt;

    setCtcData(tempData);
    setValues((prev) => ({
      ...prev,
      ctc: Math.round(tempData.grossEarning + tempData.totManagement),
    }));

    tempValues["gross"] = tempData.grossEarning;
    tempValues["net_pay"] = tempData.grossEarning - tempData.totDeduction;
    setHeadValues(tempValues);
    // setShowDetailsUpdate(false);
  };

  const getData = async () => {
    await axios
      .get(
        `/api/incrementCreation/getEmployeeDetailForIncrementCreation?empId=${rowData?.empId}`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getBudgetData = async () => {
    try {
      const res = await axios.get(
        `/api/incrementCreation/getIncrementByIncrementId?incrementId=${rowData?.incrementCreationId}`
      );
      const incrementData = res?.data?.data;

      setValues((prev) => ({
        ...prev,
        // month: incrementData?.created_date,
        // proposedBasic: incrementData?.proposedBasic,
        // proposedSplPay: incrementData?.proposedSplPay,
        // proposedGrosspay: incrementData?.proposedGrosspay,
        // proposedCtc: incrementData?.proposedCtc,
        // grossDifference: incrementData?.grossDifference,
        // ctcDifference: incrementData?.ctcDifference,
        remarks: incrementData?.remarks,
        proposedDesignation: incrementData?.proposedDesignationId,
        proposedDepartment: incrementData?.proposedDepartmentId,
        proposedSalaryStructure: incrementData?.proposedSalaryStructureId,
        lumpsum: {
          basic: incrementData?.proposedBasic,
          spl_1: incrementData?.proposedSplPay,
          ta: incrementData?.proposedTa,
        },
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    const selectedDepartment = departmentOptions.find(
      (option) => option.value === values.proposedDepartment
    );
    const selectedDesignation = designationOptions.find(
      (option) => option.value === values.proposedDesignation
    );
    const selectedSalaryStructure = salStructureOptions.find(
      (option) => option.value === values.proposedSalaryStructure
    );

    if (values.proposedDepartment) {
      setLoading(true);
      const [year, month] = values.month.slice(0, 7).split("-").map(Number);
      const temp = {
        empId: rows?.empId,
        proposedDepartment: selectedDepartment?.label,
        proposedDepartmentId: values.proposedDepartment,
        previousDepartment: rows?.previousDepartment,
        previousDepartmentId: rows?.previousDepartmentId,
        proposedDesignation: selectedDesignation?.label,
        proposedDesignationId: values.proposedDesignation,
        previousDesignation: rows?.previousDesignation,
        previousDesignationId: rows?.previousDesignationId,
        proposedBasic: values?.lumpsum?.basic,
        previousBasic: rows?.previousBasic,
        proposedCtc: values?.ctc,
        previousCtc: rows?.previousCtc,
        proposedSalaryStructure: selectedSalaryStructure?.label,
        proposedSalaryStructureId: values.proposedSalaryStructure,
        previousSalaryStructure: rows?.previousSalaryStructure,
        previousSalaryStructureId: rows?.previousSalaryStructureId,
        previousSplPay: rows?.previousSplPay,
        proposedSplPay: values?.lumpsum?.spl_1,
        proposedTa: values?.lumpsum?.ta,
        previousGrosspay: rows?.previousGrosspay,
        proposedGrosspay: headValues?.gross,
        grossDifference: headValues?.gross - rows?.previousGrosspay,
        ctcDifference: values?.ctc - rows?.previousCtc,
        year,
        month,
        remarks: values.remarks,
        createdBy: userID,
        active: true

      };

      try {
        if (rowData?.incrementCreationId) {
          temp.incrementCreationId = rowData?.incrementCreationId;
          const response = await axios.put(
            `/api/incrementCreation/updateIncrementCreationDetails`,
            [temp]
          );
          if (response.status === 200 || response.status === 201) {
            setAlertMessage({ severity: "success", message: "Data Updated" });
            navigate(`/BudgetCreatedIndex`);
          } else {
            setAlertMessage({ severity: "error", message: "Error Occurred" });
          }
        } else {
          const response = await axios.post(
            `/api/incrementCreation/saveIncrementCreationDetails`,
            temp
          );
          if (response.status === 200 || response.status === 201) {
            setAlertMessage({ severity: "success", message: "Data Saved" });
            navigate(`/BudgetCreatedIndex`);
          } else {
            setAlertMessage({ severity: "error", message: "Error Occurred" });
          }
        }
      } catch (error) {
        setAlertMessage({
          severity: "error",
          message: error.response?.data?.message || "An error occurred",
        });
      } finally {
        setAlertOpen(true);
        setLoading(false);
      }
    } else {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === "proposedSalaryStructure" && { month: "" }),
    }));
  };

  const handleChange = async (e) => {
    const splitName = e.target.name.split("-");

    if (splitName[1] === "lumpsum") {
      const checkValues = values.lumpsum;
      checkValues[splitName[0]] = e.target.value;
      setValues((prev) => ({
        ...prev,
        lumpsum: checkValues,
        ...((splitName[0] === "basic" || splitName[0] === "spl_1" || splitName[0] === "ta") && {
          month: "",
        }),
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const getDepartmentOptions = async () => {
    await axios
      .get(`/api/incrementCreation/getDepartments`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.departmentId,
            label: obj.departmentName,
          });
        });
        setDepartmentOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getDesignationOptions = async () => {
    await axios
      .get(`/api/incrementCreation/getDesignations`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.designationId,
            label: obj.designationName,
          });
        });
        setDesignationOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getSalaryStructureOptions = async () => {
    await axios
      .get(`/api/incrementCreation/getsalaryStructures`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.salaryStructureId,
            label: obj.salaryStructureName,
          });
        });
        setSalStructureOptions(data);
      })
      .catch((err) => console.error(err));
  };
  const currentDate = new Date();

  const firstDayOfPreviousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  
  const isObjectFullyFilled = (obj) =>
    Object.values(obj).every(
      (val) => val !== null && val !== undefined && val !== ""
    );

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <FormWrapper>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <CustomModal
            open={modalOpen}
            setOpen={setModalOpen}
            title={modalContent.title}
            message={modalContent.message}
            buttons={modalContent.buttons}
          />
          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Employee Name"
              defaultValue={rowData?.employeeName}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Employee Code"
              defaultValue={rowData?.empCode}
              disabled
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Date Of Joining"
              defaultValue={moment(rowData?.dateofJoining, "DD-MM-YYYY").format("DD-MM-YYYY")}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Experience"
              defaultValue={rowData?.experience}
              disabled
            />
          </Grid>
        </Grid>
      </FormWrapper>
      <>
        <TableContainer elevation={3} sx={{ paddingLeft: 5, paddingRight: 5 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell width={"50%"}>Existing Salary</StyledTableCell>
                <StyledTableCell width={"50%"}>Proposed Salary</StyledTableCell>
              </TableRow>
            </TableHead>

            {rows?.empId ? (
              <TableBody>
                {/* Row 1 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="Designation"
                      value={rows?.previousDesignation}
                      disabled
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomAutocomplete
                      name="proposedDesignation"
                      label="Designation"
                      value={values.proposedDesignation}
                      options={designationOptions}
                      handleChangeAdvance={handleChangeAdvance}
                    />
                  </StyledTableCell>
                </TableRow>

                {/* Row 2 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="Department"
                      defaultValue={rows?.previousDepartment}
                      disabled
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomAutocomplete
                      name="proposedDepartment"
                      label="Departmnet"
                      value={values.proposedDepartment}
                      options={departmentOptions}
                      handleChangeAdvance={handleChangeAdvance}
                    />
                  </StyledTableCell>
                </TableRow>

                {/* Row 3 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="Salary Structure"
                      defaultValue={rows?.previousSalaryStructure}
                      disabled
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomAutocomplete
                      name="proposedSalaryStructure"
                      label="Salary Structure"
                      value={values.proposedSalaryStructure}
                      options={salStructureOptions}
                      handleChangeAdvance={handleChangeAdvance}
                    />
                  </StyledTableCell>
                </TableRow>

                {/* Row 4 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="Basic"
                      defaultValue={rows?.previousBasic}
                      disabled
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {formulaData.length > 0 ? (
                      formulaData
                        .filter(
                          (fil) =>
                            fil.salary_category === "Lumpsum" &&
                            fil.salaryStructureHeadPrintName === "basic"
                        )
                        .map((lu, i) => {
                          return (
                            <Grid item xs={12} md={4} key={i}>
                              <CustomTextField
                                name={
                                  lu.salaryStructureHeadPrintName +
                                  "-" +
                                  "lumpsum"
                                }
                                label={lu.voucher_head}
                                value={
                                  values.lumpsum[
                                  lu.salaryStructureHeadPrintName
                                  ]
                                }
                                handleChange={handleChange}
                                required
                              />
                            </Grid>
                          );
                        })
                    ) : (
                      <>
                        {" "}
                        <Typography variant="body2" color="red">
                          Note: Please select Salary Structure
                        </Typography>
                      </>
                    )}
                  </StyledTableCell>
                </TableRow>

                {/* Row 5 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="SplPay"
                      defaultValue={rows?.previousSplPay}
                      disabled
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {formulaData.length > 0 ? (
                      formulaData
                        .filter(
                          (fil) =>
                            fil.salary_category === "Lumpsum" &&
                            fil.salaryStructureHeadPrintName === "spl_1"
                        )
                        .map((lu, i) => {
                          return (
                            <Grid item xs={12} md={4} key={i}>
                              <CustomTextField
                                name={
                                  lu.salaryStructureHeadPrintName +
                                  "-" +
                                  "lumpsum"
                                }
                                label={lu.voucher_head}
                                value={
                                  values.lumpsum[
                                  lu.salaryStructureHeadPrintName
                                  ]
                                }
                                handleChange={handleChange}
                                required
                              />
                            </Grid>
                          );
                        })
                    ) : (
                      <>
                        {" "}
                        <Typography variant="body2" color="red">
                          Note: Please select Salary Structure
                        </Typography>
                      </>
                    )}
                  </StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="Travel allowance"
                      defaultValue={rows?.previousTa ?? 0}
                      disabled
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {formulaData.length > 0 ? (
                      formulaData
                        .filter(
                          (fil) =>
                            fil.salary_category === "Lumpsum" &&
                            fil.salaryStructureHeadPrintName === "ta"
                        )
                        .map((lu, i) => {
                          return (
                            <Grid item xs={12} md={4} key={i}>
                              <CustomTextField
                                name={
                                  lu.salaryStructureHeadPrintName +
                                  "-" +
                                  "lumpsum"
                                }
                                label={lu.voucher_head}
                                value={
                                  values.lumpsum[
                                  lu.salaryStructureHeadPrintName
                                  ]
                                }
                                handleChange={handleChange}
                                required
                              />
                            </Grid>
                          );
                        })
                    ) : (
                      <>
                        {" "}
                        <Typography variant="body2" color="red">
                          Note: Please select Salary Structure
                        </Typography>
                      </>
                    )}
                  </StyledTableCell>
                </TableRow>
                {/* Row 6 */}
                {formulaData
                  .filter(
                    (fil) =>
                      fil.salary_category === "Lumpsum" &&
                      fil.salaryStructureHeadPrintName === "md"
                  )
                  .map((lu, i) => (
                    <React.Fragment key={i}>
                      <TableRow>
                        <StyledTableCell>
                          <CustomTextField
                            label="Medical Reimbursement"
                            defaultValue={rows?.reimbursement}
                            disabled
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <Grid item xs={12} md={4} key={i}>
                            <CustomTextField
                              name={
                                lu.salaryStructureHeadPrintName +
                                "-" +
                                "lumpsum"
                              }
                              label={lu.voucher_head}
                              value={
                                values.lumpsum[lu.salaryStructureHeadPrintName]
                              }
                              handleChange={handleChange}
                              required
                            />
                          </Grid>
                        </StyledTableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}

                {/* Row 7 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="Gross"
                      defaultValue={rows?.previousGrosspay}
                      disabled
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomTextField
                      label="Gross"
                      value={headValues?.gross || ""}
                      name="proposedGrosspay"
                      handleChange={handleChange}
                      disabled
                    />
                    {!headValues?.gross && (
                      <Typography variant="body2" color="red">
                        Note: Please select month to get gross and CTC
                      </Typography>
                    )}
                  </StyledTableCell>
                </TableRow>

                {/* Row 8 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="CTC"
                      defaultValue={rows?.previousCtc}
                      disabled
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomTextField
                      label="CTC"
                      value={values.ctc || ""}
                      name="proposedCtc"
                      handleChange={handleChange}
                      disabled
                    />
                  </StyledTableCell>
                </TableRow>

                {/* Row 9 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomDatePicker
                      name="month"
                      label="From Month"
                      value={values.month}
                      handleChangeAdvance={handleChangeAdvance}
                      views={["month", "year"]}
                      openTo="month"
                      inputFormat="MM/YYYY"
                      required
                      minDate={firstDayOfPreviousMonth}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomTextField
                      label="Gross Difference"
                      value={
                        headValues?.gross
                          ? headValues?.gross - rows?.previousGrosspay
                          : ""
                      }
                      name="grossDifference"
                      handleChange={handleChange}
                      disabled
                    />
                  </StyledTableCell>
                </TableRow>

                {/* Row 10 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="Remarks"
                      value={values.remarks}
                      name="remarks"
                      handleChange={handleChange}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomTextField
                      label="CTC Difference"
                      value={values.ctc ? values.ctc - rows?.previousCtc : ""}
                      name="ctcDifference"
                      handleChange={handleChange}
                      disabled
                    />
                  </StyledTableCell>
                </TableRow>

                {/* Add more rows as needed */}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </>
      <Grid item sx={12} align="center" padding={5}>
        <Button
          style={{ borderRadius: 7 }}
          variant="contained"
          color="primary"
          disabled={
            loading ||
            values.month === null ||
            values.month === "Invalid Date" ||
            values.month === "" ||
            values.lumpsum === "" ||
            !isObjectFullyFilled(values.lumpsum)
          }
          onClick={handleSubmit}
        >
          {loading ? (
            <CircularProgress
              size={25}
              color="blue"
              style={{ margin: "2px 13px" }}
            />
          ) : rowData?.incrementCreationId ? (
            <strong>{"Update"}</strong>
          ) : (
            <strong>{"Generate"}</strong>
          )}
        </Button>
      </Grid>
    </Box>
  );
}

export default SalaryBudgetCreate;
