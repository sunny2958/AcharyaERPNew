import { useState, lazy, useEffect } from "react";
import { Grid, Box, Button, CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs.js";
import axios from "../../../services/Api.js";
import useAlert from "../../../hooks/useAlert.js";
import CustomModal from "../../../components/CustomModal";
import FormWrapper from "../../../components/FormWrapper.jsx";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField.jsx")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);

const modalContents = {
  title: "",
  message: "",
  buttons: [],
};

const initialState = {
  bonafideTypeId: "",
  bonafideTypeName: "",
  from: "",
  to: "",
  auid: "",
  bonafideTypeList: [],
  semesterList: [],
  loading: false,
  submitModalOpen: false,
  modalContent: modalContents,
};

const BonafideForm = () => {
  const [
    {
      bonafideTypeId,
      bonafideTypeName,
      semesterList,
      auid,
      from,
      to,
      bonafideTypeList,
      loading,
      submitModalOpen,
      modalContent,
    },
    setState,
  ] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "Bonafide", link: "/BonafideIndex" },
      { name: !!location.state ? "View" : "Create" },
    ]);
    getBonafideTypeList();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      !!auid && getFromToData(auid);
    }, 1500);
    return () => {
      clearTimeout(handler);
    };
  }, [auid, bonafideTypeId]);

  const getBonafideTypeList = async () => {
    try {
      const res = await axios.get("api/categoryTypeDetailsOnBonafide");
      const lists = res?.data?.data.map((obj) => ({
        label: obj.category_detail,
        value: obj.category_details_id,
        name:  obj.category_name_sort
      }));
      setState((prevState) => ({
        ...prevState,
        bonafideTypeList: lists,
      }));
      !!location.state && setFormData(location.state, lists);
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const setFormData = (formValue, bonafideTypeLists) => {
    const bonafideTypeId = bonafideTypeLists.find(
      (ele) => ele.label == formValue?.bonafide_type
    )?.value;
    setState((prevState) => ({
      ...prevState,
      bonafideTypeId: bonafideTypeId,
      auid: formValue?.auid,
      bonafideTypeName: formValue?.bonafide_type,
    }));
  };

  const getFromToData = async (auid) => {
    try {
      if (bonafideTypeName == "Bonafide Letter") {
        const res = await axios.get(
          `api/student/studentBonafideDetailsDropDown?auid=${auid}`
        );
        if (res.data.status == 200 || res.data.status == 201) {
          const programType = res.data.data[0]?.program_type_name;
          const noOfSemester = res.data.data[0]?.number_of_semester;

          const semesterLists = Array.from(
            { length: noOfSemester },
            (_, i) => ({
              id: i + 1,
              value: `Sem${i + 1}`,
              label: `Sem ${i + 1}`,
            })
          );
          const newSemesterList = semesterLists.filter((list) =>
            programType == "Yearly" ? list.id % 2 : list
          );
          setState((prevState) => ({
            ...prevState,
            semesterList: newSemesterList,
          }));
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name === "bonafideTypeId") {
      setState((prev) => ({
        ...prev,
        [name]: newValue,
        bonafideTypeName: bonafideTypeList.find((el) => el.value == newValue)
          ?.label,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const handleSubmit = () => {
    setSubmitModalOpen();
    setModalContent("", "Do you want to submit?", [
      { name: "Yes", color: "primary", func: () => createStudentBonafide() },
      { name: "No", color: "primary", func: () => {} },
    ]);
  };

  const setModalContent = (title, message, buttons) => {
    setState((prevState) => ({
      ...prevState,
      modalContent: {
        ...prevState.modalContent,
        title: title,
        message: message,
        buttons: buttons,
      },
    }));
  };

  const setSubmitModalOpen = () => {
    setState((prevState) => ({
      ...prevState,
      submitModalOpen: !submitModalOpen,
    }));
  };

  const createStudentBonafide = async () => {
    isAuidValid();
  };

  const isAuidValid = async () => {
    try {
      if (auid.length == 12) {
        setLoading(true);
        const res = await axios.get(
          `api/student/checkAuidIsAlreadyPresentOrNot/${auid}`
        );
        if (res.status == 200) {
          setAlertMessage({
            severity: "error",
            message: "Auid is invalid",
          });
          setAlertOpen(true);
          setLoading(false);
        }
      }
    } catch (error) {
      if (error.response.status == 500) {
        try {
          setLoading(false);
          const bonafideType = bonafideTypeList.find(
            (ele) => ele.value === bonafideTypeId
          ).label;

          if (!!auid) {
            const payload = {
              active: true,
              auid: auid,
              bonafide_type: bonafideType,
              hostel_fee_template_id: null,
              from_sem: semesterList.find((ele) => ele.value === from)?.id || null,
              to_sem: semesterList.find((ele) => ele.value === to)?.id || null,
            };
            const res = await axios.post(
              "/api/student/studentBonafide",
              payload
            );
            if (res.status == 200 || res.status == 201) {
              setLoading(false);
              setAlertMessage({
                severity: "success",
                message: `Student bonafide created successfully`,
              });
              navigation(bonafideType, "Create");
              setAlertOpen(true);
            }
          }
        } catch (error) {
          setAlertMessage({
            severity: "error",
            message: error.response
              ? error.response.data.message
              : "An error occured !!",
          });
          setAlertOpen(true);
          setLoading(false);
        }
      }
    }
  };

  const navigation = (bonafideType, page) => {
    navigate(`/BonafideView`, {
      state: {
        studentAuid: auid,
        bonafideType: bonafideType,
        page: page,
        semRange: {
          from: semesterList.find((ele) => ele.value === from)?.id,
          to: semesterList.find((ele) => ele.value === to)?.id,
        },
      },
    });
  };

  return (
    <Box component="form" overflow="hidden" p={1} mt={2}>
      {!!submitModalOpen && (
        <CustomModal
          open={submitModalOpen}
          setOpen={setSubmitModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
      )}
      <FormWrapper>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, md: 4 }}
          alignItems="center"
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="bonafideTypeId"
              label="Bonafide Type"
              value={bonafideTypeId || ""}
              options={bonafideTypeList || []}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!!location.state}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="auid"
              label="Auid"
              value={auid}
              handleChange={handleChange}
              disabled={!!location.state}
              required
            />
            {!!auid && auid?.length != 12 && (
              <span style={{ fontSize: "11px", color: "red" }}>
                auid is invalid
              </span>
            )}
          </Grid>
          {bonafideTypeName === "Bonafide Letter" && (
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="from"
                label="From"
                value={from || ""}
                options={semesterList || []}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
          )}
          {bonafideTypeName === "Bonafide Letter" && (
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="to"
                label="To"
                value={to || ""}
                options={semesterList || []}
                handleChangeAdvance={handleChangeAdvance}
              />
              <span style={{ fontSize: "10px", color: "red" }}>
                {!!to && !(from <= to) ? "To should be greater than From" : ""}
              </span>
            </Grid>
          )}
          <Grid item xs={12} align="right" mt={1}>
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={
                loading ||
                !auid ||
                !bonafideTypeId ||
                !(from <= to) ||
                auid.length != 12
              }
              onClick={handleSubmit}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{!!location.state ? "View" : "Submit"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
};

export default BonafideForm;
