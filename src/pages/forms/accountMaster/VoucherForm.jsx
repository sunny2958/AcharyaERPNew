import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  ledgerId: "",
  voucherHead: "",
  shortName: "",
  voucherType: "",
  priority: "",
  type: "",
  cashBank: "No",
  isVendor: "No",
  budgetHead: "No",
  isCommon: "No",
  isSalaries: "No",
  hostelStatus: "No",
  isExam: "No",
};

const requiredFields = [
  "ledgerId",
  "voucherHead",
  "shortName",
  "voucherType",
  "priority",
];

const items = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

function VoucherForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [legderOptions, setLegderOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();

  const checks = {
    voucherHead: [values.voucherHead !== ""],
    shortName: [values.shortName !== ""],
    priority: [values.priority !== "", /^[0-9]+$/.test(values.priority)],
  };
  const errorMessages = {
    voucherHead: ["This field is required"],
    shortName: ["This field is required"],
    priority: ["This field is required", "Invalid Priority"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/accountmaster/voucher/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Account Master", link: "/AccountMaster/Voucherhead" },
        { name: "Voucher Head" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getData();
    }
    getLedgerOptions();
  }, []);

  useEffect(() => {
    validateBankVendor();
  }, [values.cashBank, values, values.isVendor]);

  const getData = async () => {
    await axios
      .get(`/api/finance/VoucherHeadNew/${id}`)
      .then((res) => {
        setValues((prev) => ({
          ...prev,
          ledgerId: res.data.data.ledger_id,
          voucherHead: res.data.data.voucher_head,
          shortName: res.data.data.voucher_head_short_name,
          voucherType: res.data.data.voucher_type,
          priority: res.data.data.priority,
          cashBank: res.data.data.cash_or_bank === true ? "Yes" : "No",
          isVendor: res.data.data.is_vendor === true ? "Yes" : "No",
          budgetHead: res.data.data.budget_head === true ? "Yes" : "No",
          isCommon: res.data.data.is_common === true ? "Yes" : "No",
          isSalaries: res.data.data.is_salaries === true ? "Yes" : "No",
          hostelStatus: res.data.data.hostel_status === true ? "Yes" : "No",
          isExam: res.data.data.is_exam === true ? "Yes" : "No",
          type: res.data.data.type,
        }));

        setData(res.data.data);

        setCrumbs([
          { name: "Account Master", link: "/AccountMaster/Voucherhead" },
          { name: "Voucher Head" },
          { name: res.data.data.voucher_head },
          { name: "Update" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const getLedgerOptions = async () => {
    await axios
      .get(`/api/finance/Ledger`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.ledger_id,
            label: obj.ledger_name,
          });
        });
        setLegderOptions(data);
      })
      .catch((err) => console.error(err));
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

  const validateBankVendor = () => {
    if (values.cashBank === "Yes" && values.isVendor === "Yes") {
      setAlertMessage({
        severity: "error",
        message: "The particular voucher head should be Cash/Bank or Vendor !!",
      });
      setAlertOpen(true);
      setValues((prev) => ({
        ...prev,
        ["cashBank"]: "No",
        ["isVendor"]: "No",
      }));
    }
  };

  const handleCreate = async () => {
    setLoading(true);

    const postData = {};
    postData.active = true;
    postData.ledger_id = values.ledgerId;
    postData.voucher_head = values.voucherHead;
    postData.voucher_head_short_name = values.shortName;
    postData.voucher_type = values.voucherType;
    postData.priority = values.priority;
    postData.cash_or_bank = values.cashBank === "Yes" ? true : false;
    postData.is_vendor = values.isVendor === "Yes" ? true : false;
    postData.budget_head = values.budgetHead === "Yes" ? true : false;
    postData.is_common = values.isCommon === "Yes" ? true : false;
    postData.is_salaries = values.isSalaries === "Yes" ? true : false;
    postData.hostel_status = values.hostelStatus === "Yes" ? true : false;
    postData.is_exam = values.isExam === "Yes" ? true : false;
    postData.type = values.type;
    await axios
      .post("/api/finance/VoucherHeadNew", postData)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Voucher Head created successfully !!",
          });
          setAlertOpen(true);
          navigate("/AccountMaster/Voucherhead", { replace: true });
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "An error occured",
          });
          setAlertOpen(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response.data.message
            ? err.response.data.message
            : "Error",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  const handleUpdate = async () => {
    const putData = { ...data };
    putData.ledger_id = values.ledgerId;
    putData.voucher_head = values.voucherHead;
    putData.voucher_head_short_name = values.shortName;
    putData.voucher_type = values.voucherType;
    putData.priority = values.priority;
    putData.cash_or_bank = values.cashBank === "Yes" ? true : false;
    putData.is_vendor = values.isVendor === "Yes" ? true : false;
    putData.budget_head = values.budgetHead === "Yes" ? true : false;
    putData.is_common = values.isCommon === "Yes" ? true : false;
    putData.is_salaries = values.isSalaries === "Yes" ? true : false;
    putData.hostel_status = values.hostelStatus === "Yes" ? true : false;
    putData.isExam = values.isExam === "Yes" ? true : false;
    putData.type = values.type;

    await axios
      .put(`/api/finance/VoucherHeadNew/${id}`, putData)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Voucher Head updated successfully !!",
          });
          setAlertOpen(true);
          navigate("/AccountMaster/Voucherhead", { replace: true });
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "An error occured",
          });
          setAlertOpen(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response.data.message
            ? err.response.data.message
            : "Error",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  return (
    <Box p={1}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={2}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              label="Ledger"
              name="ledgerId"
              value={values.ledgerId}
              options={legderOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="voucherHead"
              label="Voucher Head"
              value={values.voucherHead}
              handleChange={handleChange}
              errors={errorMessages.voucherHead}
              checks={checks.voucherHead}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              value={values.shortName}
              handleChange={handleChange}
              errors={errorMessages.shortName}
              checks={checks.shortName}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomSelect
              label="Voucher Type"
              name="voucherType"
              value={values.voucherType}
              items={[
                { value: "inflow", label: "Inflow" },
                { value: "outflow", label: "OutFlow" },
                { value: "journal", label: "Journal" },
                { value: "all", label: "All" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="priority"
              label="Priority"
              value={values.priority}
              handleChange={handleChange}
              errors={errorMessages.priority}
              checks={checks.priority}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomSelect
              label="Type"
              name="type"
              value={values.type}
              items={[
                { value: "ASSETS/ADVANCE", label: "Assets/Advance" },
                { value: "EXPENDITURE", label: "Expenditure" },
              ]}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="cashBank"
              label="Cash / Bank"
              value={values.cashBank}
              items={items}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="isVendor"
              label="Is Vendor"
              value={values.isVendor}
              items={items}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="budgetHead"
              label="Budget Head"
              value={values.budgetHead}
              items={items}
              handleChange={handleChange}
            />
          </Grid>

          {/* <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="isCommon"
              label="Is Common"
              value={values.isCommon}
              items={items}
              handleChange={handleChange}
            />
          </Grid> */}

          <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="isSalaries"
              label="Is Salaries"
              value={values.isSalaries}
              items={items}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="hostelStatus"
              label="Hostel Status"
              value={values.hostelStatus}
              items={items}
              handleChange={handleChange}
              required
            />
          </Grid>

          {/* <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="isExam"
              label="Is Exam"
              value={values.isExam}
              items={items}
              handleChange={handleChange}
              required
            />
          </Grid> */}

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              color="primary"
              disabled={loading || !requiredFieldsValid()}
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

export default VoucherForm;
