import { lazy, useEffect, useState } from "react";
import axiosNoToken from "../../../services/ApiWithoutToken";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import acharyaLogo from "../../../assets/acharyaLogo.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);

const initialValues = {
  name: "",
  email: "",
  mobileNo: "",
  auid: "",
  amount: "",
};

const requiredFields = ["name", "email", "mobileNo", "auid"];

function ExternalPaymentForm() {
  const [values, setValues] = useState(initialValues);
  const [data, setData] = useState([]);
  const [isFixed, setIsFixed] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [printPath, setPrintPath] = useState();
  const { pathname } = useLocation();

  const { id, orderId, type } = useParams();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    name: [values.name !== ""],
    email: [
      values.email !== "",
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.email
      ),
    ],
    mobileNo: [values.mobileNo !== "", /^[0-9]{10}$/.test(values.mobileNo)],
    amount: [values.amount !== "", /^[0-9.]*$/.test(values.amount)],
  };

  const errorMessages = {
    name: ["This field is required"],
    email: ["This field is required", "Invalid email"],
    mobileNo: ["This field is required", "Invalid Mobile No."],
    amount: ["This field is required", "Invalid Input"],
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (orderId && type === "click") {
      setPrintPath(`/ExternalPaymentSuccessPrint/${orderId}/${type}`);
      getClickPaymentStatus().then((res) => {
        if (res) {
          setPaymentSuccess(true);
        }
      });
    } else if (orderId) {
      setPrintPath(`/ExternalPaymentSuccessPrint/${orderId}`);
      getPaymentStatus().then((res) => {
        if (res) {
          setPaymentSuccess(true);
        }
      });
    }
  }, [orderId]);

  const getData = async () => {
    await axiosNoToken
      .get(`/api/finance/getFeePaymentWindow/${id}`)
      .then((res) => {
        setData(res.data.data);
        setValues((prev) => ({
          ...prev,
          ["amount"]: Number(res.data.data.amount),
        }));
      })
      .catch((err) => console.error(err));
  };

  const getPaymentStatus = async () => {
    return await axiosNoToken
      .get(`/api/student/getPaymentStatus?order_id=${orderId}`)
      .then((res) => res.data.status)
      .catch((err) => console.error(err));
  };

  const getClickPaymentStatus = async () => {
    return await axiosNoToken
      .get(`/api/student/getClickPaymentStatus?merchant_trans_id=${orderId}`)
      .then((res) => res.data.status)
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAmount = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const date = new Date(data?.to_date);
  const currentDate = new Date();
  const partFeeDate = new Date(date);

  const date1WithoutTime = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const date2WithoutTime = new Date(
    partFeeDate.getFullYear(),
    partFeeDate.getMonth(),
    partFeeDate.getDate()
  );

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

  const handlePayment = async () => {
    try {
      const payload = {
        schoolId: data?.school_id,
        name: values.name,
        email: values.email,
        mobile: Number(values.mobileNo),
        feehead: data.voucher_head,
        voucherHeadId: Number(data.voucher_head_new_id),
        amount: Number(values.amount),
        remarks: values.auid,
        feePaymentWindowId: Number(id),
      };

      const paymentResponse = await axiosNoToken.post(
        `/api/student/bulkPayment`,
        payload
      );

      if (paymentResponse.status === 200 || paymentResponse.status === 201) {
        navigate("/student-external-pay", {
          state: {
            response: paymentResponse.data,
            student_data: values,
            mobile: values.mobileNo,
            schoolId: data?.school_id,
            feeName: "External",
            id: id,
            pathname: pathname,
          },
        });
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response ? error.response.data.message : "Error Occured",
      });
      setAlertOpen(true);
    }
  };

  return (
    <Box m={4}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardHeader
              avatar={<Avatar alt="" src={acharyaLogo} />}
              title="Acharya Institutes"
              titleTypographyProps={{ variant: "subtitle2", fontSize: 16 }}
              subheader="Payment Window"
              subheaderTypographyProps={{
                variant: "body2",
                color: "#f7f7f7",
              }}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                padding: 1,
              }}
            />
            <CardContent sx={{ padding: 3 }}>
              {date2WithoutTime >= date1WithoutTime ? (
                <Grid container rowSpacing={2}>
                  <Grid item xs={12} align="center" mb={1}>
                    <Typography variant="subtitle2" textAlign="center">
                      {data?.voucher_head?.toUpperCase() +
                        " - " +
                        data?.remarks?.toUpperCase()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <CustomTextField
                      name="name"
                      label="Name"
                      value={values.name}
                      handleChange={handleChange}
                      checks={checks.name}
                      errors={errorMessages.name}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CustomTextField
                      name="email"
                      label="Email"
                      value={values.email}
                      handleChange={handleChange}
                      checks={checks.email}
                      errors={errorMessages.email}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CustomTextField
                      type="number"
                      name="mobileNo"
                      label="Mobile"
                      value={values.mobileNo}
                      handleChange={handleChange}
                      checks={checks.mobileNo}
                      errors={errorMessages.mobileNo}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CustomTextField
                      name="auid"
                      label="AUID / Any other info"
                      value={values.auid}
                      handleChange={handleChange}
                      checks={checks.auid}
                      errors={errorMessages.auid}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CustomTextField
                      name="amount"
                      label="Amount"
                      value={values.amount}
                      handleChange={handleChangeAmount}
                      checks={checks.amount}
                      errors={errorMessages.amount}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={12} mb={2}>
                    <Button
                      onClick={handlePayment}
                      disabled={!requiredFieldsValid() || values.amount === 0}
                      variant="contained"
                      sx={{ width: "100%" }}
                    >
                      PAY NOW
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Grid container rowSpacing={2}>
                  <Grid item xs={12} align="center" mb={1}>
                    <Typography variant="subtitle2" textAlign="center">
                      {data?.voucher_head?.toUpperCase() +
                        " - " +
                        data?.remarks?.toUpperCase()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} align="center" mb={1}>
                    <Typography variant="h6" sx={{ color: "red" }}>
                      Payment window is closed !!
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ExternalPaymentForm;
