import React, { lazy, useEffect, useState } from "react";
import {
	Box,
	FormControlLabel,
	FormGroup,
	Grid,
	IconButton,
	Stack,
	Typography,
	Tooltip,
	tooltipClasses,
	Paper,
	Table,
	TableBody,
	tableCellClasses,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from "@mui/material";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import CloseIcon from "@mui/icons-material/Close";
import {
	HorizontalBar,
	LineChart,
	PieChart,
	StackedBar,
	VerticalBar,
} from "../Chart";
import moment from "moment";
import { IOSSwitch } from "../IOSSwitch";
import styled from "@emotion/styled";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs";
import axios from "../../../../services/Api";
import useAlert from "../../../../hooks/useAlert.js";
import CustomDatePicker from "../../../../components/Inputs/CustomDatePicker";
import { GroupedColumnTable } from "./groupColumnTable";
const CustomAutocomplete = lazy(() =>
	import("../../../../components/Inputs/CustomAutocomplete.jsx")
);
const GridIndex = lazy(() => import("../../../../components/GridIndex"));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: "#376a7d",
		color: theme.palette.headerWhite.main,
		border: "1px solid #fff",
		textAlign: "center"
	},
	[`&.${tableCellClasses.body}`]: {
		border: "1px solid lightgray",
		textAlign: "center"
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	// "&:nth-of-type(odd)": {
	// 	backgroundColor: theme.palette.action.hover,
	// },
}));

const HtmlTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: "white",
		color: "rgba(0, 0, 0, 0.6)",
		maxWidth: 300,
		fontSize: 12,
		boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
		padding: "10px",
		textAlign: "justify",
	},
}));

const EnlargeChartIcon = styled(OpenInFullRoundedIcon)`
  position: absolute;
  right: 33px;
  top: 20px;
  color: #132353;
  cursor: pointer;

  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

const CloseButton = styled(CloseIcon)`
  position: absolute;
  right: 33px;
  top: 20px;
  color: #132353;
  cursor: pointer;
`;

const ChartSection = styled.div`
  visibility: 1;
  opacity: 1;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  transition: opacity 1s;
  z-index: 999;
  max-height: 100%;
  overflow: scroll;
`;

const ChartContainer = styled.div`
  max-width: 85%;
  margin: 90px auto;
  border-radius: 5px;
  width: 100%;
  position: relative;
  transition: all 2s ease-in-out;
  padding: 30px;
  background-color: #ffffff;
`;

const GraphOptions = [
	{ value: "Institute", label: "Institute" },
	{ value: "Year Wise", label: "Year Wise" },
	{ value: "Day Wise", label: "Day Wise" },
	{ value: "Programme", label: "Programme" },
	// { value: "Gender", label: "Gender" },
	{ value: "GeoLocation", label: "GeoLocation" },
	{ value: "AdmissionCategory", label: "Admission Category" },
	{ value: "Datewise Statistics", label: "Datewise Statistics" },
	{ value: "AdmissionReport", label: "Admission Report" },
];

const ChartOptions = [
	{ value: "verticalbar", label: "Vertical Bar" },
	{ value: "horizontalbar", label: "Horizontal Bar" },
	{ value: "stackedbarvertical", label: "Stacked Bar(Vertical)" },
	{ value: "stackedbarhorizontal", label: "Stacked Bar(Horizontal)" },
	{ value: "line", label: "Line" },
	{ value: "pie", label: "Pie" },
];

const MonthOptions = [
	{ label: "January", value: 1 },
	{ label: "February", value: 2 },
	{ label: "March", value: 3 },
	{ label: "April", value: 4 },
	{ label: "May", value: 5 },
	{ label: "June", value: 6 },
	{ label: "July", value: 7 },
	{ label: "August", value: 8 },
	{ label: "September", value: 9 },
	{ label: "October", value: 10 },
	{ label: "November", value: 11 },
	{ label: "December", value: 12 },
];

const standardColors = [
	"rgb(255, 99, 132)",
	"rgb(54, 162, 235)",
	"rgb(255, 206, 86)",
	"rgb(75, 192, 192)",
	"rgb(153, 102, 255)",
	"rgb(255, 159, 64)",
	"rgb(233, 30, 99)",
	"rgb(63, 81, 181)",
	"rgb(0, 188, 212)",
	"rgb(255, 87, 34)",
	"rgb(76, 175, 80)",
	"rgb(139, 195, 74)",
	"rgb(205, 220, 57)",
	"rgb(255, 235, 59)",
	"rgb(121, 85, 72)",
	"rgb(158, 158, 158)",
	"rgb(96, 125, 139)",
	"rgb(244, 67, 54)",
	"rgb(33, 150, 243)",
	"rgb(3, 169, 244)",
];

const AdmissionReportSubHeaderObj = [
	{ label: "TI" },
	{ label: "TA" },
	{ label: "TV" },
	{ label: "TR" },
	{ label: "TNR" },
];

const DEFAULT_CHART = "horizontalbar";
const DEFAULT_SELECTEDGRAPH = "Institute";
const DEFAULT_MONTH = new Date().getMonth() + 1;
const DEFAULT_YEAR = new Date().getFullYear();

const AdmissionPage = () => {
	const setCrumbs = useBreadcrumbs();
	const [loading, setLoading] = useState(true);
	const [tableRows, setTableRows] = useState([]);
	const [tableColumns, setTableColumns] = useState([]);
	const [chartData, setChartData] = useState({ labels: [], datasets: [] });
	const [pieChartData, setPieChartData] = useState([]);
	const [academicYears, setAcademicYears] = useState([]);
	const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
	const [selectedGraph, setSelectedGraph] = useState(DEFAULT_SELECTEDGRAPH);
	const [selectedChart, setSelectedChart] = useState(DEFAULT_CHART);
	const [selectedMonth, setSelectedMonth] = useState(DEFAULT_MONTH);
	const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR);
	const [yearOptions, setYearOptions] = useState([]);
	const [enlargeChart, setEnlargeChart] = useState(false);
	const [schoolColorsArray, setSchoolColorsArray] = useState([]);
	const [isTableView, setIsTableView] = useState(true);
	const [instituteList, setInstituteList] = useState([]);
	const [fullNameInstituteList, setFullNameInstituteList] = useState([]);
	const [selectedInstitute, setSelectedInstitute] = useState(null);
	const [allCountryList, setAllCountryList] = useState([]);
	const [countryList, setCountryList] = useState([]);
	const [programList, setProgramList] = useState([]);
	const [stateList, setstateList] = useState([]);
	const [cityList, setCityList] = useState([]);
	const [selectedCountry, setSlectedCountry] = useState(null);
	const [selectedState, setSlectedState] = useState(null);
	const [selectedCity, setSlectedCity] = useState(null);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [isGroupColumnTable, setIsGroupColumntable] = useState(false);
	const [data, setData] = useState([]);
	const [programId, setProgramId] = useState(null);
	const [detailsRows, setDetailsRows] = useState([]);
	const [admissionCategoryList, setAdmissionCategoryList] = useState([]);
	const [feeCategoryAllData, setFeeCategoryAllData] = useState([]);
	const [admissionReportRow, setAdmissionReportRow] = useState([]);
	const [isDetails, setIsDetails] = useState(false);
	const [isAdmissionRowClick, setIsAdmissionRowClick] = useState(false);
	const { setAlertMessage, setAlertOpen } = useAlert();
	const [columnVisibilityModel, setColumnVisibilityModel] = useState({
		usn:false,
		ac_year:false,
		school_name_short:false
	});

	useEffect(() => {
		isDetails ? setCrumbs([
			{ name: [selectedGraph], link: () => setIsDetails(false) }
		]) :
			setCrumbs([]);
	}, [selectedGraph, isDetails]);

	useEffect(() => {
		getSchoolColors();
		getAcademicYearList();
		getCountry();
	}, []);

	useEffect(() => {
		if (selectedGraph === "GeoLocation") {
			if (selectedCountry !== null) {
				let apiPath = "/api/misGeolocationWiseReport?";
				if (selectedInstitute !== null)
					apiPath = apiPath + `schoolId=${selectedInstitute}&`;
				if (selectedCountry !== null)
					apiPath = apiPath + `countryId=${selectedCountry}&`;
				handleApiCall(apiPath, handleGeoLocationWiseDataCountry);
			} else {
				let apiPath = "/api/misGeolocationWiseReport?";
				if (selectedInstitute !== null)
					apiPath = apiPath + `schoolId=${selectedInstitute}&`;
				handleApiCall(apiPath, handleGeoLocationWiseData);
			}
		}
	}, [selectedCountry]);

	useEffect(() => {
		if (selectedGraph === "GeoLocation") {
			if (selectedCountry !== null && selectedState !== null) {
				let apiPath = "/api/misGeolocationWiseReport?";
				if (selectedInstitute !== null)
					apiPath = apiPath + `schoolId=${selectedInstitute}&`;
				if (selectedCountry !== null)
					apiPath = apiPath + `countryId=${selectedCountry}&`;
				if (selectedState !== null)
					apiPath = apiPath + `stateId=${selectedState}&`;
				handleApiCall(apiPath, handleGeoLocationWiseDataState);
			} else if (selectedCountry !== null && selectedState === null) {
				let apiPath = "/api/misGeolocationWiseReport?";
				if (selectedInstitute !== null)
					apiPath = apiPath + `schoolId=${selectedInstitute}&`;
				if (selectedCountry !== null)
					apiPath = apiPath + `countryId=${selectedCountry}&`;
				handleApiCall(apiPath, handleGeoLocationWiseDataCountry);
			} else {
				setCityList([]);
				setSlectedCity(null);
			}
		}
	}, [selectedState]);

	useEffect(() => {
		if (selectedGraph === "GeoLocation") {
			if (selectedCountry !== null && selectedState !== null) {
				let apiPath = "/api/misGeolocationWiseReport?";
				if (selectedInstitute !== null)
					apiPath = apiPath + `schoolId=${selectedInstitute}&`;
				if (selectedCountry !== null)
					apiPath = apiPath + `countryId=${selectedCountry}&`;
				if (selectedState !== null)
					apiPath = apiPath + `stateId=${selectedState}&`;
				if (selectedCity !== null) apiPath = apiPath + `cityId=${selectedCity}`;
				handleApiCall(apiPath, handleGeoLocationWiseDataCity);
			}
		}
	}, [selectedCity]);

	useEffect(() => {
		if (selectedGraph !== "") {
			if (selectedGraph === "Institute" && selectedAcademicYear !== null)
				handleApiCall(
					`/api/misInstituteWiseReport?acYearId=${selectedAcademicYear}`,
					handleInstituteWiseData
				);
			else if (selectedGraph === "Year Wise")
				handleApiCall(`/api/misYearWiseReport`, handleYearWiseData);
			else if (selectedGraph === "Day Wise")
				handleApiCall(
					`/api/misDayWiseReport?month=${selectedMonth}&year=${selectedYear}`,
					handleDayWiseData
				);
			else if (selectedGraph === "Programme") {
				if (selectedAcademicYear !== "" && selectedInstitute !== null)
					handleApiCall(
						`/api/misProgramWiseReport?acYearId=${selectedAcademicYear}&schoolId=${selectedInstitute}`,
						handleProgrammeWiseData
					);
			} else if (selectedGraph === "Gender") {
				if (selectedInstitute !== "")
					handleApiCall(
						`/api/misGenderWiseReport?schoolId=${selectedInstitute}&acYearId=${selectedAcademicYear}`,
						handleGenderWiseData
					);
				else handleApiCall(`/api/misGenderWiseReport`, handleGenderWiseData);
			} else if (selectedGraph === "GeoLocation") {
				let apiPath = "/api/misGeolocationWiseReport?";
				if (selectedInstitute !== null)
					apiPath = apiPath + `schoolId=${selectedInstitute}&`;
				if (selectedCountry !== null)
					apiPath = apiPath + `countryId=${selectedCountry}&`;
				if (selectedState !== null)
					apiPath = apiPath + `stateId=${selectedState}&`;
				if (selectedCity !== null) apiPath = apiPath + `cityId=${selectedCity}&`;

				if (
					selectedCountry !== null &&
					selectedState !== null &&
					selectedCity !== null
				)
					handleApiCall(apiPath, handleGeoLocationWiseDataCity);
				else if (selectedCountry !== null && selectedState !== null)
					handleApiCall(apiPath, handleGeoLocationWiseDataState);
				else if (selectedCountry !== null)
					handleApiCall(apiPath, handleGeoLocationWiseDataCountry);
				else handleApiCall(apiPath, handleGeoLocationWiseData);
			} else if (selectedGraph === "AdmissionCategory") {
				handleApiCall(
					`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
					handleAdmissionCategory
				);
			} else if (selectedGraph === "Datewise Statistics") {
				const formattedDate = moment(selectedDate).format("DD-MM-YYYY");
				if (selectedInstitute !== null)
					handleApiCall(
						`/api/student/getCountOfAdmissionDate?date_of_admission=${formattedDate}&school_id=${selectedInstitute}`,
						handleDateWiseInstitute
					);
				else
					handleApiCall(
						`/api/student/getCountOfAdmissionDate?date_of_admission=${formattedDate}`,
						handleDateWise
					);
			}
		}
	}, [
		selectedGraph,
		selectedAcademicYear,
		selectedMonth,
		selectedYear,
		selectedInstitute,
		selectedDate,
	]);

	useEffect(() => {
		getInstituteList(selectedGraph);
		setSelectedAcademicYear(
			academicYears.length > 0 ? academicYears[0].value : ""
		);
		setTableColumns([]);
		setTableRows([]);
		setChartData({ labels: [], datasets: [] });
	}, [selectedGraph]);

	useEffect(() => {
		if (selectedGraph == "AdmissionReport") {
			getProgramData(selectedInstitute);
		}
	}, [selectedGraph, selectedInstitute]);

	useEffect(() => {
		if (selectedGraph == "AdmissionReport" && selectedInstitute) {
			getAdmissionReportData(programId)
		}
	}, [selectedGraph,selectedInstitute,programId]);

	useEffect(() => {
		if (Object.keys(chartData).length > 0) generatePieChartDataset();
		else setPieChartData([]);
	}, [chartData]);

	const getSubHeader = () => {
		let AdmissionReportSubHeader = [];
		for (let i = 0; i < admissionCategoryList?.length; i++) {
			AdmissionReportSubHeader.push(...AdmissionReportSubHeaderObj)
		}
		AdmissionReportSubHeader = [...AdmissionReportSubHeader];
		return AdmissionReportSubHeader;
	};

	const getInstituteList = (selectedGraph=DEFAULT_SELECTEDGRAPH) => {
		axios
			.get("/api/institute/school")
			.then((res) => {
				setSelectedInstitute(selectedGraph =="AdmissionReport" || selectedGraph =="Programme" ? res.data.data[0]?.school_id : null);
				setInstituteList(
					res.data.data.map((obj) => {
						return { label: obj.school_name_short, value: obj.school_id };
					})
				);
				setFullNameInstituteList(
					res.data.data.map((obj) => {
						return { label: obj.school_name, value: obj.school_id };
					})
				);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getProgramData = async (schoolId = fullNameInstituteList[0].value) => {
		try {
			const res = await axios.get(
				`/api/otherFeeDetails/getProgramsDetails?schoolId=${schoolId}`
			);
			if (res.status == 200 || res.status == 201) {
				const programList = res?.data?.data.map((el) => ({
					label: el.programName,
					value: el.programId
				}));
				setProgramList(programList);
				setProgramId(programList[0].value);
				getAdmissionReportData(programList[0].value)
			}
		} catch (error) {
			console.error(error);
		}
	};

	const getAdmissionReportData = async (programIdValue) => {
		try {
			setAdmissionReportRow([]);
			const params = new URLSearchParams();
			const keys = {
				"acYearId": selectedAcademicYear,
				"schoolId": selectedInstitute,
				"programId": programIdValue
			};
			Object.entries(keys).forEach(([key, value]) => {
				if (value != null) {
					params.append(key, value);
				}
			});
			const res = await axios.get(`api/admissionCategoryReport/getAdmissionCategoryCompleteReport?${params}`);
			if (res.status == 200 || res.status == 201) {
				const list = res.data.data;
				const uniqueBranch = [...new Set(list.map(nl => nl.program_specialization_short_name))];
				setFeeCategoryAllData(list);
				const filterCategory = [...new Set(list.map((li) => li.fee_admission_category_type))];
				setAdmissionCategoryList(filterCategory);
				const newList = list.map((ele) => ({
					"branch": ele.program_specialization_short_name,
					"category":ele.fee_admission_category_type,
					[`${ele.fee_admission_category_type}-intake`]: ele.intake || 0,
					[`${ele.fee_admission_category_type}-admitted`]: ele.admitted || 0,
					[`${ele.fee_admission_category_type}-vacant`]: ele.vacant || 0,
					[`${ele.fee_admission_category_type}-reported`]: ele.reportedStudent || 0,
					[`${ele.fee_admission_category_type}-notReported`]: ele.notReportedStudent || 0,
				}));

				let newArray = [];
				uniqueBranch.forEach(ub => {
					const branchWiseList = newList.filter((li) => li.branch == ub);
					const mergedObj = branchWiseList.reduce((acc, curr) => {
						return { ...acc, ...curr };
					}, {});
					newArray.push(mergedObj)
				});

				const updatedArray = newArray.map((obj) => {
					const totalAdmitted = Object.keys(obj)
						.filter((key) => key.includes("admitted"))
						.reduce((sum, key) => sum + obj[key], 0);
					return {
						...obj,
						totalAdmitted,
					};
				});

				const grandTotalObj = updatedArray.reduce((acc, curr) => {
					for (const key in curr) {
						if (typeof curr[key] === 'number') {
							acc[key] = (acc[key] || 0) + curr[key];
						}
					}
					return acc;
				}, {});

				let grandTotalList = {
					"branch": "Grand Total",
					...grandTotalObj,
					"type": "total"
				};
				const updatedList = [...updatedArray,grandTotalList];
				setAdmissionReportRow(updatedList);
			}
		} catch (error) {
			console.log(error)
		}
	};

	const getCountry = () => {
		axios(`/api/Country`)
			.then((res) => {
				setAllCountryList(
					res.data.map((obj) => ({
						value: obj.id,
						label: obj.name,
					}))
				);
			})
			.catch((err) => {
				console.error(err);
				setAllCountryList([]);
			});
	};

	const getSchoolColors = async () => {
		await axios
			.get(
				`/api/institute/fetchAllSchoolDetail?page=${0}&page_size=${10000000}&sort=created_date`
			)
			.then((Response) => {
				const response = Response.data.data;
				const schoolColorsArray = response.map((obj) => {
					let borderColor = "";
					let backgroundColor = "";
					const { school_color, school_name_short } = obj;
					if (
						school_color === "" ||
						school_color === undefined ||
						school_color === null
					) {
						const { r, g, b } = random_rgb();
						borderColor = `rgb(${r}, ${g}, ${b})`;
						backgroundColor = `rgb(${r}, ${g}, ${b}, 0.5)`;
					} else {
						borderColor = school_color;
						backgroundColor = `${school_color}80`;
					}

					return {
						borderColor,
						backgroundColor,
						schoolName: school_name_short,
					};
				});

				setSchoolColorsArray(schoolColorsArray);
			})
			.catch((err) => console.error(err));
	};

	const getAcademicYearList = () => {
		axios.get("/api/academic/academic_year").then((res) => {
			if (res.data.data.length <= 0) return;

			const yearsObj = res.data.data.filter((obj) => {
				const { current_year } = obj;
				if (current_year >= 2022) return obj;

				return null;
			});
			const acYear = yearsObj.map((ele) => ({ value: ele.ac_year_id, label: ele.ac_year }))?.filter((li) => (li.label).slice(0, 4) > "2024")
			setAcademicYears(acYear);
			setSelectedAcademicYear(
				yearsObj.length > 0 ? yearsObj[0].ac_year_id : ""
			);
			setYearOptions(
				yearsObj.map((obj) => {
					return { label: obj.current_year, value: obj.current_year };
				})
			);
		});
	};

	const detailsColumns = [
		{
			field: "student_name",
			headerName: "Student Name",
			headerClassName: "header-bg",
			flex: 1,
			valueGetter: (value, row) => (row.student_name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())).join(" ")
		},
		{
			field: "auid",
			headerName: "Auid",
			flex: 1,
			headerClassName: "header-bg",
		},
		{
			field: "concatProgram",
			headerName: "Program & Specialization",
			flex: 1,
			headerClassName: "header-bg",
		},
		{
			field: "date_of_admission",
			headerName: "DOA",
			flex: 1,
			headerClassName: "header-bg",
			valueGetter: (value, row) => (row.date_of_admission) ? `${moment(row.date_of_admission).format("DD-MM-YYYY")}` : ""
		},
		{
			field: "fee_admission_category_short_name",
			headerName: "Category",
			flex: 1,
			headerClassName: "header-bg",
			valueGetter: (value, row) => (row.fee_admission_category_short_name || row.fee_admission_sub_category_short_name) ? `${row.fee_admission_category_short_name} - ${row.fee_admission_sub_category_short_name}` : ""
		},
		{
			field: "counselorName",
			headerName: "Counselor",
			flex: 1,
			headerClassName: "header-bg",
			valueGetter: (value, row) => row.counselorName ? `${row.counselorName}` : row.counselorName1 ? `${row.counselorName1}` : ""
		},
		{
			field: "countryName",
			headerName: "Country",
			flex: 1,
			headerClassName: "header-bg",
		},
		{
			field: "stateName",
			headerName: "State",
			flex: 1,
			headerClassName: "header-bg",
		},
		{
			field: "cityName",
			headerName: "City",
			flex: 1,
			headerClassName: "header-bg",
		},
	];

	const admissionStudentReportColumns = [
		{
			field: "auid",
			headerName: "Auid",
			flex: 1,
			headerClassName: "header-bg",
		},
		{
			field: "student_name",
			headerName: "Student Name",
			headerClassName: "header-bg",
			flex: 1,
			valueGetter: (value, row) => (row.student_name?.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))?.join(" ")
		},
		{
			field: "usn",
			headerName: "USN",
			flex: 1,
			headerClassName: "header-bg",
		},
		{
			field: "date_of_admission",
			headerName: "DOA",
			flex: 1,
			headerClassName: "header-bg",
			valueGetter: (value, row) => (row.date_of_admission ? moment(row.date_of_admission).format("DD-MM-YYYY"):"")
		},
		{
			field: "fee_template_name",
			headerName: "Fee Template",
			flex: 1,
			headerClassName: "header-bg",
		},
		{
			field: "fee_admission_category_short_name",
			headerName: "Admission Category",
			flex: 1,
			headerClassName: "header-bg",
		},
		{
			field: "ac_year",
			headerName: "Academic Year",
			flex: 1,
			headerClassName: "header-bg",
		},
		{
			field: "school_name_short",
			headerName: "Institute",
			flex: 1,
			headerClassName: "header-bg",
		},
		{
			field: "program_specialization_short_name",
			headerName: "Program & Specilization",
			flex: 1,
			headerClassName: "header-bg",
			valueGetter: (value, row) => (row.program_specialization_short_name && row.program_short_name ? `${row.program_short_name}-${row.program_specialization_short_name}` :"")
		},
		{
			field: "stateName",
			headerName: "State",
			flex: 1,
			headerClassName: "header-bg",
		},
		{
			field: "counselorName",
			headerName: "Counselor Name",
			flex: 1,
			headerClassName: "header-bg",
			valueGetter: (value, row) => (row.counselorName ? row.counselorName?.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())?.join(" "): row.counselor_name ?
			row.counselor_name?.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())?.join(" ") : "")
		},
		{
			field: "reporting_date",
			headerName: "Reported Date",
			flex: 1,
			headerClassName: "header-bg",
			valueGetter: (value, row) => (row.reporting_date ? moment(row.reporting_date).format("DD-MM-YYYY") : "")
		},
		{
			field: "reportedBy",
			headerName: "Reported By",
			flex: 1,
			headerClassName: "header-bg",
			valueGetter: (value, row) => (row.reporting_date  ? row.reportedBy?.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())?.join(" ") : "")
		},
	];

	const handleApiCall = (path, callback) => {
		setLoading(true);
		setIsGroupColumntable(false)
		axios
			.get(path)
			.then((res) => {
				if (res.data.data && res.data?.data?.length <= 0) {
					setTableColumns([]);
					setTableRows([]);
					setChartData({ labels: [], datasets: [] });
					setLoading(false);
					return;
				}
				setLoading(false);
				if (selectedGraph === "Datewise Statistics") callback(res.data);
				else callback(res.data.data);
			})
			.catch((err) => {
				console.log(err);
				setTableColumns([]);
				setTableRows([]);
				setChartData({ labels: [], datasets: [] });
				setLoading(false);
			});
	};

	const handleInstituteWiseData = (data) => {
		const rowsToShow = [];
		let studentEntryTotal = 0;
		let lateralEntrytotal = 0;
		let inActiveEntrytotal = 0;
		let graduatesEntrytotal = 0;
		let total_ = 0;
		let id = 0;
		for (const obj of data) {
			const { school_name, Total, ac_year_id, Institute } = obj;
			rowsToShow.push({
				id: id,
				School: school_name,
				acYearId: ac_year_id,
				instId: Institute,
				"Student Entry": obj["Student Entry"],
				"Lateral Entry": obj["Lateral Entry"],
				InActive: obj["InActive"],
				Graduates: obj["Graduates"],
				Total: Total,
			});
			studentEntryTotal += obj["Student Entry"];
			lateralEntrytotal += obj["Lateral Entry"];
			inActiveEntrytotal += obj["InActive"];
			graduatesEntrytotal += obj["Graduates"];
			total_ += obj["Total"];
			id += 1;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			School: "Total",
			"Student Entry": studentEntryTotal,
			"Lateral Entry": lateralEntrytotal,
			InActive: inActiveEntrytotal,
			Graduates: graduatesEntrytotal,
			Total: total_,
		});

		const columns = [
			{
				field: "School",
				headerName: "School",
				headerClassName: "header-bg",
				minWidth: 350,
				flex: 1,
			},
			{
				field: "Student Entry",
				headerName: "Regular",
				flex: 1,
				align: "center",
				headerClassName: "header-bg",
			},
			{
				field: "Lateral Entry",
				headerName: "Lateral/WP",
				flex: 1,
				align: "center",
				headerClassName: "header-bg",
			},
			{
				field: "InActive",
				headerName: "Cancellation",
				flex: 1,
				align: "center",
				headerClassName: "header-bg",
			},
			{
				field: "Graduates",
				headerName: "Graduates ",
				flex: 1,
				align: "center",
				headerClassName: "header-bg",
			},
			{
				field: "Total",
				headerName: "Active",
				flex: 1,
				headerClassName: "header-bg",
				cellClassName: "last-column",
				align: "center",
				renderCell: (params) => {
					if (params.row.id === "last_row_of_table") {
						return (
							<Typography color="#fff" variant="subtitle2">{params.row.Total}</Typography>
						);
					}
					return (
						<HtmlTooltip title="View Students Detail">
							<IconButton
								onClick={() => getSchoolWiseData(params.row)}
							>
								<Typography color="primary" variant="subtitle2">{params.row.Total}</Typography>
							</IconButton>
						</HtmlTooltip>
					)
				},
			},
		];

		const getSchoolWiseData = async (rowData) => {
			try {
				setLoading(true);
				const res = await axios.get(`api/misInstituteWiseStudentDetails?acYearId=${rowData.acYearId}&schoolId=${rowData.instId}`);
				if (res.status == 200 || res.status == 201) {
					const list = res.data.map((ele, index) => ({ id: index + 1, ...ele }));
					setIsDetails(true);
					setLoading(false);
					setDetailsRows(list);
				}
			} catch (error) {
				setLoading(false)
				setAlertMessage({
					severity: "error",
					message: "An error occured",
				});
				setAlertOpen(true);
			}
		};

		setTableColumns(columns);
		setTableRows(rowsToShow);

		const datasets = [
			{
				id: 0,
				label: "Regular Entry",
				data: data.map((obj) =>
					obj["Student Entry"] ? obj["Student Entry"] : 0
				),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Lateral Entry",
				data: data.map((obj) =>
					obj["Lateral Entry"] ? obj["Lateral Entry"] : 0
				),
				borderColor: `rgb(153, 151, 228)`,
				backgroundColor: `rgb(153, 151, 228, 0.5)`,
			},
			{
				id: 0,
				label: "InActive",
				data: data.map((obj) => (obj["InActive"] ? obj["InActive"] : 0)),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Graduates",
				data: data.map((obj) => (obj["Graduates"] ? obj["Graduates"] : 0)),
				borderColor: `rgb(153, 151, 228)`,
				backgroundColor: `rgb(153, 151, 228, 0.5)`,
			},
		];

		const finalData = { labels: data.map((obj) => obj.school_name), datasets };
		setChartData(finalData);
	};

	const handleYearWiseData = (data) => {
		const rowsToShow = [];
		let studentEntryTotal = 0;
		let lateralEntrytotal = 0;
		let inActiveEntrytotal = 0;
		let graduatesEntrytotal = 0;
		let total_ = 0;
		let id = 0;
		for (const obj of data) {
			const { year, Total, ac_year_id } = obj;
			rowsToShow.push({
				id: id,
				Year: year,
				acYearId: ac_year_id,
				"Student Entry": obj["Student Entry"],
				"Lateral Entry": obj["Lateral Entry"],
				InActive: obj["InActive"],
				Graduates: obj["Graduates"],
				Total: Total,
			});
			studentEntryTotal += obj["Student Entry"];
			lateralEntrytotal += obj["Lateral Entry"];
			inActiveEntrytotal += obj["InActive"];
			graduatesEntrytotal += obj["Graduates"];
			total_ += obj["Total"];
			id += 1;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			Year: "Total",
			"Student Entry": studentEntryTotal,
			"Lateral Entry": lateralEntrytotal,
			InActive: inActiveEntrytotal,
			Graduates: graduatesEntrytotal,
			Total: total_,
		});

		const columns = [
			{
				field: "Year",
				headerName: "Year",
				headerClassName: "header-bg",
				minWidth: 350,
				flex: 1,
			},
			{
				field: "Student Entry",
				headerName: "Regular",
				flex: 1,
				align: "center",
				headerClassName: "header-bg",
			},
			{
				field: "Lateral Entry",
				headerName: "Lateral/WP",
				flex: 1,
				align: "center",
				headerClassName: "header-bg",
			},
			{
				field: "InActive",
				headerName: "Cancellation",
				flex: 1,
				align: "center",
				headerClassName: "header-bg",
			},
			{
				field: "Graduates",
				headerName: "Graduates",
				flex: 1,
				align: "center",
				headerClassName: "header-bg",
			},
			{
				field: "Total",
				headerName: "Active",
				flex: 1,
				headerClassName: "header-bg",
				cellClassName: "last-column",
				align: "center",
				renderCell: (params) => {
					if (params.row.id === "last_row_of_table") {
						return (
							<Typography color="#fff" variant="subtitle2">{params.row.Total}</Typography>
						);
					}
					return (
						<HtmlTooltip title="View Students Details">
							<IconButton
								onClick={() => getYearWiseDetailData(params.row)}
							>
								<Typography color="primary" variant="subtitle2">{params.row.Total}</Typography>
							</IconButton>
						</HtmlTooltip>
					)
				},
			},
		];
		setTableColumns(columns);
		setTableRows(rowsToShow);

		const getYearWiseDetailData = async (rowData) => {
			try {
				setLoading(true);
				const res = await axios.get(`api/misInstituteWiseStudentDetails?acYearId=${rowData.acYearId}`);
				if (res.status == 200 || res.status == 201) {
					const list = res.data.map((ele, index) => ({ id: index + 1, ...ele }));
					setIsDetails(true);
					setLoading(false);
					setDetailsRows(list);
				}
			} catch (error) {
				setLoading(false)
				setAlertMessage({
					severity: "error",
					message: "An error occured",
				});
				setAlertOpen(true);
			}
		};
		const datasets = [
			{
				id: 0,
				label: "Regular Entry",
				data: data.map((obj) => obj["Student Entry"]),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 1,
				label: "Lateral Entry",
				data: data.map((obj) => obj["Lateral Entry"]),
				borderColor: `rgb(153, 151, 228)`,
				backgroundColor: `rgb(153, 151, 228, 0.5)`,
			},
			{
				id: 1,
				label: "InActive",
				data: data.map((obj) => obj["InActive"]),
				borderColor: `rgb(153, 151, 228)`,
				backgroundColor: `rgb(153, 151, 228, 0.5)`,
			},
			{
				id: 1,
				label: "Graduates",
				data: data.map((obj) => obj["Graduates"]),
				borderColor: `rgb(153, 151, 228)`,
				backgroundColor: `rgb(153, 151, 228, 0.5)`,
			},
		];

		const finalData = { labels: data.map((obj) => obj.year), datasets };
		setChartData(finalData);
	};

	const handleDayWiseData = (data) => {
		const rowsToShow = [];
		let studentEntryTotal = 0;
		let lateralEntrytotal = 0;
		let total_ = 0;
		let id = 0;
		for (const obj of data) {
			const { created_day, Total } = obj;
			rowsToShow.push({
				id: id,
				Date: created_day,
				"Student Entry": obj["Student Entry"],
				"Lateral Entry": obj["Laternal Entry"],
				Total: Total,
			});
			studentEntryTotal += obj["Student Entry"];
			lateralEntrytotal += obj["Laternal Entry"];
			total_ += obj["Total"];
			id += 1;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			Date: "Total",
			"Student Entry": studentEntryTotal,
			"Lateral Entry": lateralEntrytotal,
			Total: total_,
		});

		const columns = [
			{
				field: "Date",
				headerName: "Date",
				flex: 1,
				headerClassName: "header-bg",
			},
			{
				field: "Student Entry",
				headerName: "Regular Entry",
				flex: 1,
				align: "center",
				headerClassName: "header-bg",
			},
			{
				field: "Lateral Entry",
				headerName: "Lateral Entry",
				flex: 1,
				align: "center",
				headerClassName: "header-bg",
			},
			{
				field: "Total",
				headerName: "Total",
				flex: 1,
				headerClassName: "header-bg",
				cellClassName: "last-column",
				align: "center",
				renderCell: (params) => {
					if (params.row.id === "last_row_of_table") {
						return (
							<Typography color="#fff" variant="subtitle2">{params.row.Total}</Typography>
						);
					}
					return (
						<HtmlTooltip title="View Students Details">
							<IconButton
								onClick={() => getDayWiseDetailData(params.row)}
							>
								<Typography color="primary" variant="subtitle2">{params.row.Total}</Typography>
							</IconButton>
						</HtmlTooltip>
					)
				},
			},
		];

		const getDayWiseDetailData = async (rowData) => {
			try {
				setLoading(true);
				const res = await axios.get(`/api/misDayWiseStudentDetails?date1=${moment(rowData.Date).format("YYYY-MM-DD")}`);
				if (res.status == 200 || res.status == 201) {
					const list = res.data.map((ele, index) => ({ id: index + 1, ...ele }));
					setIsDetails(true);
					setLoading(false);
					setDetailsRows(list);
				}
			} catch (error) {
				setLoading(false)
				setAlertMessage({
					severity: "error",
					message: "An error occured",
				});
				setAlertOpen(true);
			}
		};

		setTableColumns(columns);
		setTableRows(rowsToShow);

		const datasets = [
			{
				id: 0,
				label: "Regular Entry",
				data: data.map((obj) => obj["Student Entry"]),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Lateral Entry",
				data: data.map((obj) => obj["Laternal Entry"]),
				borderColor: `rgb(153, 151, 228)`,
				backgroundColor: `rgb(153, 151, 228, 0.5)`,
			},
		];

		const finalData = {
			labels: data.map((obj) => moment(obj.created_day).format("DD-MM-YYYY")),
			datasets,
		};
		setChartData(finalData);
	};

	const handleProgrammeWiseData = (data) => {
		const rowsToShow = [];
		let total = 0;
		let id = 0;
		for (const obj of data) {
			const { course, Total, ac_year_id, school_id, program_id, program_specialization_id } = obj;
			rowsToShow.push({
				id: id,
				course: course,
				acYearId: ac_year_id,
				schoolId: school_id,
				Total: Total,
				programId: program_id,
				programSpecializationId: program_specialization_id
			});
			total += Total;
			id += 1;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			course: "Total",
			Total: total,
		});

		const columns = [
			{
				field: "course",
				headerName: "Course",
				flex: 1,
				headerClassName: "header-bg",
			},
			{
				field: "Total",
				headerName: "Total",
				flex: 1,
				headerClassName: "header-bg",
				cellClassName: "last-column",
				align: "center",
				renderCell: (params) => {
					if (params.row.id === "last_row_of_table") {
						return (
							<Typography color="#fff" variant="subtitle2">{params.row.Total}</Typography>
						);
					}
					return (
						<HtmlTooltip title="View Students Details">
							<IconButton
								onClick={() => getProgrammeWiseDetailData(params.row)}
							>
								<Typography color="primary" variant="subtitle2">{params.row.Total}</Typography>
							</IconButton>
						</HtmlTooltip>
					)
				},
			},
		];

		const getProgrammeWiseDetailData = async (rowData) => {
			try {
				setLoading(true);
				const res = await axios.get(`/api/misProgramWiseStudentDetails?acYearId=${rowData.acYearId}&schoolId=${rowData.schoolId}&programId=${rowData.programId}&program_specializationId=${rowData.programSpecializationId}`);
				if (res.status == 200 || res.status == 201) {
					const list = res.data.map((ele, index) => ({ id: index + 1, ...ele }));
					setIsDetails(true);
					setLoading(false);
					setDetailsRows(list);
				}
			} catch (error) {
				setLoading(false)
				setAlertMessage({
					severity: "error",
					message: "An error occured",
				});
				setAlertOpen(true);
			}
		};

		setTableColumns(columns);
		setTableRows(rowsToShow);

		const datasets = [
			{
				id: 0,
				label: "Total",
				data: data.map((obj) => obj["Total"]),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
		];

		const finalData = { labels: data.map((obj) => obj.course), datasets };
		setChartData(finalData);
	};

	const handleGenderWiseData = (data) => {
		const rowsToShow = [];
		let studentEntryTotal = 0;
		let lateralEntrytotal = 0;
		let id = 0;
		for (const obj of data) {
			const { candidate_sex, Total } = obj;
			rowsToShow.push({
				id: id,
				sex: candidate_sex,
				"Student Entry": obj["Student Entry"],
				"Lateral Entry": obj["Laternal Entry"],
				Total: Total,
			});
			studentEntryTotal += obj["Student Entry"];
			lateralEntrytotal += obj["Laternal Entry"];
			id += 1;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			sex: "Total",
			"Student Entry": studentEntryTotal,
			"Lateral Entry": lateralEntrytotal,
			Total: lateralEntrytotal + studentEntryTotal,
		});

		const columns = [
			{
				field: "sex",
				headerName: "Sex",
				flex: 1,
				headerClassName: "header-bg",
			},
			{
				field: "Student Entry",
				headerName: "Regular Entry",
				flex: 1,
				align: "center",
				headerClassName: "header-bg",
			},
			{
				field: "Lateral Entry",
				headerName: "Lateral Entry",
				flex: 1,
				align: "center",
				headerClassName: "header-bg",
			},
			{
				field: "Total",
				headerName: "Total",
				flex: 1,
				align: "center",
				headerClassName: "header-bg",
				cellClassName: "last-column",
			},
		];

		setTableColumns(columns);
		setTableRows(rowsToShow);

		const datasets = [
			{
				id: 0,
				label: "Regular Entry",
				data: data.map((obj) => obj["Student Entry"]),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Lateral Entry",
				data: data.map((obj) => obj["Laternal Entry"]),
				borderColor: `rgb(153, 151, 228)`,
				backgroundColor: `rgb(153, 151, 228, 0.5)`,
			},
		];

		const finalData = {
			labels: data.map((obj) => obj.candidate_sex),
			datasets,
		};
		setChartData(finalData);
	};

	const handleGeoLocationColumnAndRowData = (
		data,
		acYears,
		fieldName,
		headerName
	) => {
		const columns = [
			{
				field: fieldName,
				headerName: headerName,
				flex: 1,
				headerClassName: "header-bg",
			},
		];
		acYears.forEach((year) => {
			columns.push({
				field: `${year}`,
				headerName: `${year}`,
				flex: 1,
				align: "center",
				headerClassName: "header-bg",
				renderCell: (params) => {
					if (params.row.id === "last_row_of_table") {
						return (
							<Typography color="#fff" variant="subtitle2">{params.row[year] || 0}</Typography>
						);
					} else if (year == 2025 && params.row[year] == 0) {
						return (
							<Typography color="primary" variant="subtitle2">{params.row[year] || 0}</Typography>
						);
					} else if (year == 2025 && params.row[year] != 0) {
						return (
							<HtmlTooltip title="View Students Detail">
								<IconButton
									onClick={() => getGeoLocationWiseDetailData(params.row, data, year)}
								>
									<Typography color="primary" variant="subtitle2">{params.row[year] || 0}</Typography>
								</IconButton>
							</HtmlTooltip>
						)
					}
				},
			});
		});
		columns.push({
			field: "Total",
			headerName: "Total",
			flex: 1,
			headerClassName: "header-bg",
			cellClassName: "last-column",
			align: "center"
		});

		const getGeoLocationWiseDetailData = async (rowData, details, year) => {
			try {
				const country_id = details.find((ele) => ele.name == rowData.country)?.id;
				const state_id = details.find((ele) => ele.name == rowData.state)?.states_id;
				const city_id = details.find((ele) => ele.name == rowData.city)?.cityId;
				const acYear_id_countryWise = details.find((ele) => ele.name == rowData.country && ele.academicYear == year)?.academicYearId;
				const acYear_id_stateWise = details.find((ele) => ele.name == rowData.state && ele.academicYear == year)?.academicYearId;
				const acYear_id_cityWise = details.find((ele) => ele.name == rowData.city && ele.academicYear == year)?.academicYearId;
				setLoading(true);
				const params = new URLSearchParams();
				const paramsObj = {
					schoolId: selectedInstitute,
					countryId: selectedCountry || country_id,
					stateId: selectedState || state_id,
					cityId: selectedCity || city_id,
					acYearId: acYear_id_countryWise || acYear_id_stateWise || acYear_id_cityWise
				};
				Object.entries(paramsObj).forEach(([key, value]) => {
					if (value != null) {
						params.append(key, value);
					}
				});
				const res = await axios.get(`/api/misGeolocationWiseStudentDetails?${params.toString()}`);
				if (res.status == 200 || res.status == 201) {
					const list = res.data.map((ele, index) => ({ id: index + 1, ...ele }));
					setIsDetails(true);
					setLoading(false);
					setDetailsRows(list);
				}
			} catch (error) {
				setLoading(false)
				setAlertMessage({
					severity: "error",
					message: "An error occured",
				});
				setAlertOpen(true);
			}
		};

		const rows = [];
		const groupedData = {};

		data.forEach((item) => {
			const { name, academicYear, total } = item;

			if (!groupedData[name]) {
				groupedData[name] = { [fieldName]: name, Total: 0 };

				acYears.forEach((year) => (groupedData[name][year] = 0));
			}

			groupedData[name][academicYear] = total;
			groupedData[name]["Total"] += total;
		});

		Object.values(groupedData).forEach((row) => rows.push(row));

		const rowsToShow = rows.map((row, i) => ({
			id: i + 1,
			...row,
		}));

		// Generate last row for column totals
		const lastRow = { id: "last_row_of_table", [fieldName]: "Total" };
		acYears.forEach((year) => {
			lastRow[year] = rows.reduce((sum, row) => sum + (row[year] || 0), 0);
		});
		lastRow["Total"] = rows.reduce((sum, row) => sum + (row["Total"] || 0), 0);
		rowsToShow.push(lastRow);

		setTableColumns(columns);
		setTableRows(rowsToShow);

		const datasets = acYears.map((year, index) => {
			const color =
				index < standardColors.length
					? standardColors[index]
					: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255
					})`;

			return {
				id: year,
				label: year,
				data: data
					.filter((obj) => obj.academicYear === year)
					.reduce((acc, obj) => {
						acc[obj.name] = obj.total;
						return acc;
					}, {}),
				borderColor: color,
				backgroundColor: color.replace("rgb", "rgba").replace(")", ", 0.5)"),
			};
		});

		// Fill missing values with 0
		const labelNames = [...new Set(data.map((obj) => obj.name))];
		datasets.forEach((dataset) => {
			dataset.data = labelNames.map((label) => dataset.data[label] || 0);
		});

		const finalData = { labels: labelNames, datasets };
		setChartData(finalData);
	};

	const handleGeoLocationWiseData = (data) => {
		const acYears = [...new Set(data.map((obj) => obj.academicYear))]
			.filter((year) => parseInt(year) > 2022) // Filter years greater than 2022
			.sort((a, b) => a - b); // Sort the years in ascending order

		handleGeoLocationColumnAndRowData(data, acYears, "country", "Country");

		if (selectedCountry === null) {
			const countryId = [...new Set(data.map((obj) => obj.id))];
			const countriesToShow = allCountryList.filter((obj) => {
				return countryId.find((id) => id.toString() === obj.value.toString());
			});

			setCountryList(countriesToShow);
			setstateList([]);
			setCityList([]);
			setSlectedState(null);
			setSlectedCity(null);
		}
	};

	const handleGeoLocationWiseDataCountry = (data) => {
		const acYears = [...new Set(data.map((obj) => obj.academicYear))]
			.filter((year) => parseInt(year) > 2022) // Filter years greater than 2022
			.sort((a, b) => a - b); // Sort the years in ascending order

		handleGeoLocationColumnAndRowData(data, acYears, "state", "State");

		const allStates = [...new Map(data.map((obj) => [obj.states_id, obj])).values()];

		setstateList(
			allStates.map((obj) => ({
				value: obj.states_id,
				label: obj.name,
			}))
		);
		setCityList([]);
		setSlectedState(null);
		setSlectedCity(null);
	};

	const handleGeoLocationWiseDataState = (data) => {
		const acYears = [...new Set(data.map((obj) => obj.academicYear))]
			.filter((year) => parseInt(year) > 2022) // Filter years greater than 2022
			.sort((a, b) => a - b); // Sort the years in ascending order

		handleGeoLocationColumnAndRowData(data, acYears, "city", "City");
		const allCities = [...new Map(data.map((obj) => [obj.cityId, obj])).values()];

		setCityList(
			allCities.map((obj) => ({
				value: obj.cityId,
				label: obj.name,
			}))
		);
		setSlectedCity(null);
	};

	const handleGeoLocationWiseDataCity = (data) => {
		const acYears = [...new Set(data.map((obj) => obj.academicYear))]
			.filter((year) => parseInt(year) > 2022) // Filter years greater than 2022
			.sort((a, b) => a - b); // Sort the years in ascending order

		handleGeoLocationColumnAndRowData(data, acYears, "city", "City");
	};

	const getAdmissionReports = (data, type) => {
		setIsAdmissionRowClick(!isAdmissionRowClick);
		if (
			data?.id !== "last_row_of_table" &&
			type === "Admission Category Report"
		) {
			handleApiCall(
				`/api/admissionCategoryReport/getAdmissionCategoryReportSchoolWiseWithCategory?feeAdmissionId=${data?.feeAdmissionId}&acYearId=${selectedAcademicYear}`,
				admissionCategoryReportCallBack
			);
			setCrumbs([
				{
					name: "Admission",
					link: () => {
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
							handleAdmissionCategory
						);
					},
				},
				{ name: data?.feeAdmissionType },
			])
		}
		if (
			data?.id === "last_row_of_table" &&
			type === "Admission Category Report"
		) {
			handleApiCall(
				`/api/admissionCategoryReport/getAdmissionCategoryTotalReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
				admissionCategoryReportInstituteWiseCallBack
			);
			setCrumbs([
				{
					name: "Admission",
					link: () => {
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
							handleAdmissionCategory
						);
					},
				},
				{ name: "Institute Wise Report" },
			]);
		}
	};

	const admissionReports = (data, type) => {

		if (data?.id !== "last_row_of_table" && type === "Institute Wise") {
			handleApiCall(
				`/api/admissionCategoryReport/getAdmissionCategoryReportSpecializationWise?schoolId=${data?.schoolId}&acYearId=${selectedAcademicYear}&feeAdmissionId=${data?.feeAdmissionId}`,
				instituteWiseCallBack
			);
			setCrumbs([
				{
					name: "Admission",
					link: () => {
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
							handleAdmissionCategory
						);
					},
				},
				{
					name: data?.feeAdmissionType,
					link: () => {
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryReportSchoolWiseWithCategory?feeAdmissionId=${data?.feeAdmissionId}&acYearId=${selectedAcademicYear}`,
							admissionCategoryReportCallBack
						);
						setCrumbs([
							{
								name: "Admission",
								link: () => {
									handleApiCall(
										`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
										handleAdmissionCategory
									);
								},
							},
							{ name: data?.feeAdmissionType },
						]);
					},
				},
				{ name: data?.schoolName },
			]);
		}
		if (data?.id === "last_row_of_table" && type === "Institute Wise") {
			handleApiCall(
				`/api/admissionCategoryReport/getAdmissionCategoryReportInstituteWise?acYearId=${selectedAcademicYear}`,
				admissionCategoryReportInstituteWiseCallBack
			);
			setCrumbs([
				{
					name: "Admission",
					link: () => {
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
							handleAdmissionCategory
						);
					},
				},
				{ name: "Institute Wise Report" },
			]);
		}
	};

	const admissionReportsSecondTable = (data, type) => {
		if (data?.id !== "last_row_of_table" && type === "secondtable") {
			handleApiCall(
				`api/admissionCategoryReport/getAdmissionCategoryTotalReportAcademicYearAndSchoolWise?acYearId=${selectedAcademicYear}&schoolId=${data?.schoolId}`,
				admissionReportSecondTableInstituteWise
			);
			setCrumbs([
				{
					name: "Admission",
					link: () => {
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
							handleAdmissionCategory
						);
					},
				},
				{
					name: "Institute Wise Report",
					link: () => {
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryTotalReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
							admissionCategoryReportInstituteWiseCallBack
						);
						setCrumbs([
							{
								name: "Admission",
								link: () => {
									handleApiCall(
										`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
										handleAdmissionCategory
									);
								},
							},
							{ name: "Institute Wise Report" }
						]);
					},
				},
				{ name: data?.schoolName },
			]);
		}

		if (data?.id === "last_row_of_table" && type === "secondtable") {
			handleApiCall(
				`/api/admissionCategoryReport/getAdmissionCategoryProgramWiseTotalReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
				admissionReportSecondTableInstituteWise
			);
			setCrumbs([
				{
					name: "Admission",
					link: () => {
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
							handleAdmissionCategory
						);
					},
				},
				{
					name: "Institute Wise Report",
					link: () => {
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryTotalReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
							admissionCategoryReportInstituteWiseCallBack
						);
						setCrumbs([
							{
								name: "Admission",
								link: () => {
									handleApiCall(
										`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
										handleAdmissionCategory
									);
								},
							},
							{ name: "Institute Wise Report" },
						]);
					},
				},
				{ name: "All Institute" },
			]);
		}
	};

	const handleAdmissionCategory = (data) => {
		const rowsToShow = [];
		let id_ = 0;
		let intakeTotalCount = 0;
		let admittedTotalCount = 0;
		let vacantTotalCount = 0;
		for (const obj of data) {
			const { admitted, feeAdmissionId, feeAdmissionType, intake, vacant } =
				obj;
			rowsToShow.push({
				id: id_,
				feeAdmissionType: feeAdmissionType,
				admitted: admitted,
				feeAdmissionId: feeAdmissionId,
				intake: intake,
				vacant: vacant,
				Total: admitted + intake + vacant,
			});
			id_ += 1;
			intakeTotalCount += intake;
			admittedTotalCount += admitted;
			vacantTotalCount += vacant;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			feeAdmissionType: "Total",
			admitted: admittedTotalCount,
			feeAdmissionId: 999999,
			intake: intakeTotalCount,
			vacant: vacantTotalCount,
			Total: intakeTotalCount + admittedTotalCount + vacantTotalCount,
		});

		const columns = [
			{
				field: "feeAdmissionType",
				headerName: "Admission Type",
				flex: 1,
				headerClassName: "header-bg",
				renderCell: (params) => {
					if (params.row.id === "last_row_of_table") {
						return (
							<Typography color="#fff" variant="subtitle2">{params.row.feeAdmissionType}</Typography>
						);
					} else {
						return (
							<>
								<Typography
									sx={{ cursor: "pointer" }}
									color="primary" variant="subtitle2"
									onClick={() => getAdmissionReports(params.row, "Admission Category Report")}
								>
									{params.row.feeAdmissionType}
								</Typography>
							</>
						);
					}
				},
			},
			{
				field: "intake",
				headerName: "Intake",
				flex: 1,
				headerClassName: "header-bg",
				align: "center",
				renderCell: (params) => {
					if (params.row.id === "last_row_of_table") {
						return (
							<Typography
								sx={{ cursor: "pointer" }}
								color="#fff"
								variant="subtitle2"
								onClick={() => getAdmissionReports(params.row, "Admission Category Report")}
							>{params.row.intake}</Typography>
						);
					} else {
						return (
							<>
								<Typography
									sx={{ cursor: "pointer" }}
									color="primary" variant="subtitle2"
									onClick={() => getAdmissionReports(params.row, "Admission Category Report")}
								>
									{params.row.intake}
								</Typography>
							</>
						);
					}
				},
			},
			{
				field: "admitted",
				headerName: "Admitted",
				flex: 1,
				headerClassName: "header-bg",
				align: "center",
				renderCell: (params) => {
					if (params.row.id === "last_row_of_table") {
						return (
							<Typography
								sx={{ cursor: "pointer" }}
								color="#fff"
								variant="subtitle2"
								onClick={() => getAdmissionReports(params.row, "Admission Category Report")}
							>{params.row.admitted}</Typography>
						);
					} else {
						return (
							<>
								<Typography
									sx={{ cursor: "pointer" }}
									color="primary" variant="subtitle2"
									onClick={() => getAdmissionReports(params.row, "Admission Category Report")}
								>
									{params.row.admitted}
								</Typography>
							</>
						);
					}
				},
			},
			{
				field: "vacant",
				headerName: "Vacant",
				flex: 1,
				headerClassName: "header-bg",
				align: "center",
				renderCell: (params) => {
					if (params.row.id === "last_row_of_table") {
						return (
							<Typography
								sx={{ cursor: "pointer" }}
								color="#fff"
								variant="subtitle2"
								onClick={() => getAdmissionReports(params.row, "Admission Category Report")}
							>{params.row.vacant}</Typography>
						);
					} else {
						return (
							<>
								<Typography
									sx={{ cursor: "pointer" }}
									color="primary" variant="subtitle2"
									onClick={() => getAdmissionReports(params.row, "Admission Category Report")}
								>
									{params.row.vacant}
								</Typography>
							</>
						);
					}
				},
			},
			// { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
		];

		setTableColumns(columns);
		setTableRows(rowsToShow);
		// setCrumbs([
		// 	{ name: "Charts Dashboard", link: "/charts-dashboard/" },
		// ]);
		const datasets = [
			{
				id: 0,
				label: "Intake",
				data: data.map((obj) => obj.intake),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Admitted",
				data: data.map((obj) => obj.admitted),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Vacant",
				data: data.map((obj) => obj.vacant),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
		];

		const finalData = {
			labels: data.map((obj) => obj.feeAdmissionType),
			datasets,
		};
		setChartData(finalData);
	};

	const admissionCategoryReportCallBack = (data) => {
		const rowsToShow = [];
		let id_ = 0;
		let intakeTotalCount = 0;
		let admittedTotalCount = 0;
		let vacantTotalCount = 0;
		for (const obj of data) {
			const {
				schoolName,
				admitted,
				feeAdmissionId,
				intake,
				vacant,
				schoolId,
				feeAdmissionType,
			} = obj;

			rowsToShow.push({
				id: id_,
				schoolId: schoolId,
				schoolName: schoolName,
				admitted: admitted,
				feeAdmissionType: feeAdmissionType,
				feeAdmissionId: feeAdmissionId,
				intake: intake,
				vacant: vacant,
				Total: admitted + intake + vacant,
			});
			id_ += 1;
			intakeTotalCount += intake;
			admittedTotalCount += admitted;
			vacantTotalCount += vacant;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			schoolName: "Total",
			admitted: admittedTotalCount,
			feeAdmissionId: 999999,
			intake: intakeTotalCount,
			vacant: vacantTotalCount,
			Total: intakeTotalCount + admittedTotalCount + vacantTotalCount,
		});

		const columns = [
			{
				field: "schoolName",
				headerName: "School Name",
				flex: 1,
				headerClassName: "header-bg",
				renderCell: (params) => {
					if (params.row.id === "last_row_of_table") {
						return (
							<Typography color="#fff" variant="subtitle2">{params.row.schoolName}</Typography>
						);
					} else {
						return (
							<>
								<Typography
									sx={{ cursor: "pointer" }}
									color="primary" variant="subtitle2"
									onClick={() => admissionReports(params.row, "Institute Wise")}
								>
									{params.row.schoolName}
								</Typography>
							</>
						);
					}
				},
			},
			{
				field: "intake",
				headerName: "Intake",
				flex: 1,
				headerClassName: "header-bg",
				align: "center",
				renderCell: (params) => {
					if (params.row.id === "last_row_of_table") {
						return (
							<Typography color="#fff" variant="subtitle2">{params.row.intake}</Typography>
						);
					} else {
						return (
							<>
								<Typography
									sx={{ cursor: "pointer" }}
									color="primary" variant="subtitle2"
									onClick={() => admissionReports(params.row, "Institute Wise")}
								>
									{params.row.intake}
								</Typography>
							</>
						);
					}
				},
			},
			{
				field: "admitted",
				headerName: "Admitted",
				flex: 1,
				headerClassName: "header-bg",
				align: "center",
				renderCell: (params) => {
					if (params.row.id === "last_row_of_table") {
						return (
							<Typography color="#fff" variant="subtitle2">{params.row.admitted}</Typography>
						);
					} else {
						return (
							<>
								<Typography
									sx={{ cursor: "pointer" }}
									color="primary" variant="subtitle2"
									onClick={() => admissionReports(params.row, "Institute Wise")}
								>
									{params.row.admitted}
								</Typography>
							</>
						);
					}
				},
			},
			{
				field: "vacant",
				headerName: "Vacant",
				flex: 1,
				headerClassName: "header-bg",
				align: "center",
				renderCell: (params) => {
					if (params.row.id === "last_row_of_table") {
						return (
							<Typography color="#fff" variant="subtitle2">{params.row.vacant}</Typography>
						);
					} else {
						return (
							<>
								<Typography
									sx={{ cursor: "pointer" }}
									color="primary" variant="subtitle2"
									onClick={() => admissionReports(params.row, "Institute Wise")}
								>
									{params.row.vacant}
								</Typography>
							</>
						);
					}
				},
			},
			// { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
		];

		setTableColumns(columns);
		setTableRows(rowsToShow);

		const datasets = [
			{
				id: 0,
				label: "Intake",
				data: data.map((obj) => obj.intake),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Admitted",
				data: data.map((obj) => obj.admitted),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Vacant",
				data: data.map((obj) => obj.vacant),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
		];

		const finalData = { labels: data.map((obj) => obj.schoolName), datasets };
		setChartData(finalData);
	};

	const admissionCategoryReportInstituteWiseCallBack = (data) => {
		const rowsToShow = [];
		let id_ = 0;
		let intakeTotalCount = 0;
		let admittedTotalCount = 0;
		let vacantTotalCount = 0;
		for (const obj of data) {
			const { schoolName, admitted, feeAdmissionId, intake, vacant, schoolId } = obj;
			rowsToShow.push({
				id: id_,
				schoolName: schoolName,
				admitted: admitted,
				feeAdmissionId: feeAdmissionId,
				schoolId: schoolId,
				intake: intake,
				vacant: vacant,
				Total: admitted + intake + vacant,
			});
			id_ += 1;
			intakeTotalCount += intake;
			admittedTotalCount += admitted;
			vacantTotalCount += vacant;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			schoolName: "Total",
			admitted: admittedTotalCount,
			feeAdmissionId: 999999,
			intake: intakeTotalCount,
			vacant: vacantTotalCount,
			schoolId: "schoolId",
			Total: intakeTotalCount + admittedTotalCount + vacantTotalCount,
		});

		const columns = [
			{
				field: "schoolName",
				headerName: "School Name",
				flex: 1,
				headerClassName: "header-bg",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
								onClick={() => admissionReportsSecondTable(params.row, "secondtable")}
							>
								{params.row.schoolName}
							</Typography>
						</>
					);
				},
			},
			{
				field: "intake",
				headerName: "Intake",
				flex: 1,
				headerClassName: "header-bg",
				align: "center",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
								onClick={() => admissionReportsSecondTable(params.row, "secondtable")}
							>
								{params.row.intake}
							</Typography>
						</>
					);
				},
			},
			{
				field: "admitted",
				headerName: "Admitted",
				flex: 1,
				headerClassName: "header-bg",
				align: "center",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
								onClick={() => admissionReportsSecondTable(params.row, "secondtable")}
							>
								{params.row.admitted}
							</Typography>
						</>
					);
				},
			},
			{
				field: "vacant",
				headerName: "Vacant",
				flex: 1,
				headerClassName: "header-bg",
				align: "center",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
								onClick={() => admissionReportsSecondTable(params.row, "secondtable")}
							>
								{params.row.vacant}
							</Typography>
						</>
					);
				},
			},
			// { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
		];

		setTableColumns(columns);
		setTableRows(rowsToShow);

		const datasets = [
			{
				id: 0,
				label: "Intake",
				data: data.map((obj) => obj.intake),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Admitted",
				data: data.map((obj) => obj.admitted),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Vacant",
				data: data.map((obj) => obj.vacant),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
		];

		const finalData = { labels: data.map((obj) => obj.schoolName), datasets };
		setChartData(finalData);
	};

	const instituteWiseCallBack = (data) => {
		const rowsToShow = [];
		let id_ = 0;
		let intakeTotalCount = 0;
		let admittedTotalCount = 0;
		let vacantTotalCount = 0;
		for (const obj of data) {
			const {
				schoolName,
				admitted,
				feeAdmissionId,
				intake,
				vacant,
				program_short_name,
				program_specialization_short_name,
				fee_admission_category_type,
			} = obj;
			rowsToShow.push({
				id: id_,
				schoolName: schoolName,
				program_short_name: program_short_name,
				program_specialization_short_name: program_specialization_short_name,
				fee_admission_category_type: fee_admission_category_type,
				admitted: admitted,
				feeAdmissionId: feeAdmissionId,
				intake: intake,
				vacant: vacant,
				Total: admitted + intake + vacant,
			});
			id_ += 1;
			intakeTotalCount += intake;
			admittedTotalCount += admitted;
			vacantTotalCount += vacant;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			schoolName: "Total",
			admitted: admittedTotalCount,
			feeAdmissionId: 999999,
			intake: intakeTotalCount,
			vacant: vacantTotalCount,
			Total: intakeTotalCount + admittedTotalCount + vacantTotalCount,
		});

		const detailscolumn = [
			{
				field: "schoolName",
				headerName: "School",
				flex: 1,
				headerClassName: "header-bg",
			},
			{
				field: "program_short_name",
				headerName: "Program",
				flex: 1,
				headerClassName: "header-bg",
			},
			{
				field: "program_specialization_short_name",
				headerName: "Specialization",
				flex: 1,
				headerClassName: "header-bg",
			},
			// { field: "fee_admission_category_type", headerName: "Category", flex: 1, headerClassName: "header-bg", hide: true },
			{
				field: "intake",
				headerName: "Intake",
				flex: 1,
				headerClassName: "header-bg",
				align: "center",
				renderCell: (params) => {
					if (params.row.id === "last_row_of_table") {
						return (
							<Typography color="#fff" variant="subtitle2">{params.row.intake}</Typography>
						);
					} else {
						return (
							<Typography color="#000" variant="body2">{params.row.intake}</Typography>
						)
					}
				}
			},
			{
				field: "admitted",
				headerName: "Admitted",
				flex: 1,
				headerClassName: "header-bg",
				align: "center",
				renderCell: (params) => {
					if (params.row.id === "last_row_of_table") {
						return (
							<Typography color="#fff" variant="subtitle2">{params.row.admitted}</Typography>
						);
					} else {
						return (
							<Typography color="#000" variant="body2">{params.row.admitted}</Typography>
						)
					}
				}
			},
			{
				field: "vacant",
				headerName: "Vacant",
				flex: 1,
				headerClassName: "header-bg",
				align: "center",
				renderCell: (params) => {
					if (params.row.id === "last_row_of_table") {
						return (
							<Typography color="#fff" variant="subtitle2">{params.row.vacant}</Typography>
						);
					} else {
						return (
							<Typography color="#000" variant="body2">{params.row.vacant}</Typography>
						)
					}
				}
			},
			// { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
		];

		setTableColumns(detailscolumn);
		setTableRows(rowsToShow);

		const datasets = [
			{
				id: 0,
				label: "Intake",
				data: data.map((obj) => obj.intake),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Admitted",
				data: data.map((obj) => obj.admitted),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Vacant",
				data: data.map((obj) => obj.vacant),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
		];

		const finalData = { labels: data.map((obj) => obj.schoolName), datasets };
		setChartData(finalData);
	};

	const admissionReportSecondTableInstituteWise = (data) => {
		setIsGroupColumntable(true)
		setData(data)
	}

	const handleDateWise = (data) => {
		// Filter data for years >= 2022-2023
		const filteredData = data.filter((item) => item.ac_year >= "2023-2024");

		// Get unique school names
		const schoolNames = [
			...new Set(filteredData.map((item) => item.school_name_short)),
		];

		// Get academic years >= 2022-2023
		const academicYears = [
			...new Set(filteredData.map((item) => item.ac_year)),
		].sort();

		// Create the grouped structure
		const result = schoolNames.map((school, i) => {
			let row = { schoolName: school };

			academicYears.forEach((year) => {
				const entry = filteredData.find(
					(item) => item.school_name_short === school && item.ac_year === year
				);
				row[year] = entry ? entry.studentCount : 0;
			});
			row.id = `${school}__${i}`;
			row.schoolId = filteredData.find((ele) => ele.school_name_short == school)?.school_id;
			return row;
		});

		// Add the "Total" row
		const totalRow = { schoolName: "Total", id: "last_row_of_table" };
		academicYears.forEach((year) => {
			totalRow[year] = filteredData
				.filter((item) => item.ac_year === year)
				.reduce((sum, item) => sum + item.studentCount, 0);
		});
		result.push(totalRow);

		const columns = [
			{
				field: "schoolName",
				headerName: "School Name",
				flex: 1,
				headerClassName: "header-bg",
			},
		];

		columns.push(
			...academicYears.map((year, i) => {
				if (academicYears.length === i + 1)
					return {
						field: year,
						headerName: year,
						flex: 1,
						headerClassName: "header-bg",
						align: "center",
						cellClassName: (params) => {
							if (params.row.id === "last_row_of_table") {
								return "";
							}
							return academicYears.length === i + 1 ? "latest-year" : "";
						},
						renderCell: (params) => {
							if (params.row.id === "last_row_of_table") {
								return (
									<Typography color="#fff" variant="subtitle2">{params.row[`${year}`]}</Typography>
								);
							}
							return (
								<HtmlTooltip title="View Students Detail">
									<IconButton
										disabled={params.row[`${year}`] == 0}
										onClick={() => getDateWiseDetailData(params.row, year, filteredData)}
									>
										<Typography color="primary" variant="subtitle2">{params.row[`${year}`]}</Typography>
									</IconButton>
								</HtmlTooltip>
							)
						},
					};

				return {
					field: year,
					headerName: year,
					flex: 1,
					headerClassName: "header-bg",
					align: "center",
					cellClassName: (params) => {
						if (params.row.id === "last_row_of_table") {
							return "";
						}
						return academicYears.length === i + 1 ? "latest-year" : "";
					},
					renderCell: (params) => {
						if (params.row.id === "last_row_of_table") {
							return (
								<Typography color="#fff" variant="subtitle2">{params.row[`${year}`]}</Typography>
							);
						}
						return (
							<HtmlTooltip title="View Students Detail">
								<IconButton
									disabled={params.row[`${year}`] == 0}
									onClick={() => getDateWiseDetailData(params.row, year, filteredData)}
								>
									<Typography color="primary" variant="subtitle2">{params.row[`${year}`]}</Typography>
								</IconButton>
							</HtmlTooltip>
						)
					},
				};
			})
		);

		const getDateWiseDetailData = async (rowData, year, filteredData) => {
			try {
				const date = selectedDate;
				const acYearId = filteredData.find((ele) => ele?.ac_year == year && ele?.school_id == rowData?.schoolId)?.ac_year_id;
				setLoading(true);
				const res = await axios.get(`/api/student/getCountOfAdmissionDateStudentDetails?date_of_admission=${year.slice(0, 5)}${moment(date).format("MM-DD")}&school_id=${rowData.schoolId}&ac_year_id=${acYearId}`);
				if (res.status == 200 || res.status == 201) {
					const list = res.data.data.map((ele, index) => ({ id: index + 1, ...ele }));
					setIsDetails(true);
					setLoading(false);
					setDetailsRows(list);
				}
			} catch (error) {
				setLoading(false)
				setAlertMessage({
					severity: "error",
					message: "An error occured",
				});
				setAlertOpen(true);
			}
		};

		setTableColumns(columns);
		setTableRows(result);
	};

	const handleDateWiseInstitute = (data) => {
		// Filter data for years >= 2023-2024
		const filteredData = data.filter((item) => item.ac_year >= "2023-2024");

		// Get unique combinations of program and specialization names
		const programmeSpecializations = filteredData.map((item) => ({
			"programme": item.program_short_name,
			"specialization": item.program_specialization_short_name,
			"programmeId": item.program_id,
			"specializationId": item.program_specialization_id
		})
		).filter(
			(item, index, self) =>
				index === self.findIndex((obj) => JSON.stringify(obj) === JSON.stringify(item)))

		// Get academic years >= 2023-2024
		const academicYears = [
			...new Set(filteredData.map((item) => item.ac_year)),
		].sort();

		// Create the grouped structure
		const result = programmeSpecializations.map((programmeSpec, i) => {
			const { programme, specialization, programmeId, specializationId } = programmeSpec; // Separate program and specialization

			const row = {
				programmeName: programme,
				specialization: specialization,
				programmeId: programmeId,
				specializationId: specializationId,
			};

			academicYears.forEach((year) => {
				const entry = filteredData.find(
					(item) =>
						item.program_short_name == programme && item.program_specialization_short_name === specialization
						&& item.ac_year === year
				);
				row[year] = entry ? entry.studentCount : 0;
			});
			row.id = `${programme}__${specialization}__${i}`;
			row.schoolId = selectedInstitute;
			return row;
		});

		// Add the "Total" row
		const totalRow = { programmeName: "Total", id: "last_row_of_table" };
		academicYears.forEach((year) => {
			totalRow[year] = filteredData
				.filter((item) => item.ac_year === year)
				.reduce((sum, item) => sum + item.studentCount, 0);
		});
		result.push(totalRow);

		const columns = [
			{
				field: "programmeName",
				headerName: "Programme",
				flex: 1,
				headerClassName: "header-bg",
			},
			{
				field: "specialization",
				headerName: "Specialization",
				flex: 1,
				headerClassName: "header-bg",
			},
		];

		columns.push(
			...academicYears.map((year, i) => {
				if (academicYears.length === i + 1)
					return {
						field: year,
						headerName: year,
						flex: 1,
						headerClassName: "header-bg",
						align: "center",
						cellClassName: (params) => {
							if (params.row.id === "last_row_of_table") {
								return "";
							}
							return academicYears.length === i + 1 ? "latest-year" : "";
						},
						renderCell: (params) => {
							if (params.row.id === "last_row_of_table") {
								return (
									<Typography color="#fff" variant="subtitle2">{params.row[`${year}`]}</Typography>
								);
							}
							return (
								<HtmlTooltip title="View Students Detail">
									<IconButton
										disabled={params.row[`${year}`] == 0}
										onClick={() => getDateWiseDetailData(params.row, year, filteredData)}
									>
										<Typography color="primary" variant="subtitle2">{params.row[`${year}`]}</Typography>
									</IconButton>
								</HtmlTooltip>
							)
						},
					};

				return {
					field: year,
					headerName: year,
					flex: 1,
					headerClassName: "header-bg",
					align: "center",
					cellClassName: (params) => {
						if (params.row.id === "last_row_of_table") {
							return "";
						}
						return academicYears.length === i + 1 ? "latest-year" : "";
					},
					renderCell: (params) => {
						if (params.row.id === "last_row_of_table") {
							return (
								<Typography color="#fff" variant="subtitle2">{params.row[`${year}`]}</Typography>
							);
						}
						return (
							<HtmlTooltip title="View Students Detail">
								<IconButton
									disabled={params.row[`${year}`] == 0}
									onClick={() => getDateWiseDetailData(params.row, year, filteredData)}
								>
									<Typography color="primary" variant="subtitle2">{params.row[`${year}`]}</Typography>
								</IconButton>
							</HtmlTooltip>
						)
					},
				};
			})
		);

		const getDateWiseDetailData = async (rowData, year, filteredData) => {
			try {
				const date = selectedDate;
				const acYearId = filteredData.find((ele) => ele?.ac_year == year && ele?.school_id == rowData?.schoolId)?.ac_year_id;
				setLoading(true);
				const res = await axios.get(`/api/student/getCountOfAdmissionDateStudentDetails?date_of_admission=${year.slice(0, 5)}${moment(date).format("MM-DD")}&school_id=${rowData.schoolId}&ac_year_id=${acYearId}&program_id=${rowData.programmeId}&program_specialization_id=${rowData.specializationId}`);
				if (res.status == 200 || res.status == 201) {
					const list = res.data.data.map((ele, index) => ({ id: index + 1, ...ele }));
					setIsDetails(true);
					setLoading(false);
					setDetailsRows(list);
				}
			} catch (error) {
				setLoading(false)
				setAlertMessage({
					severity: "error",
					message: "An error occured",
				});
				setAlertOpen(true);
			}
		};

		setTableColumns(columns);
		setTableRows(result);
	};

	const random_rgb = () => {
		let o = Math.round,
			r = Math.random,
			s = 255;
		return { r: o(r() * s), g: o(r() * s), b: o(r() * s) };
	};

	const renderChart = () => {
		if (chartData.datasets.length <= 0)
			return <h3 style={{ textAlign: "center" }}>No Data found!!!</h3>;

		switch (selectedChart) {
			case "verticalbar":
				return (
					<VerticalBar
						data={chartData}
						title={selectedGraph}
						showDataLabel={false}
					/>
				);
			case "horizontalbar":
				return (
					<HorizontalBar
						data={chartData}
						title={selectedGraph}
						showDataLabel={false}
					/>
				);
			case "line":
				return (
					<LineChart
						data={chartData}
						title={selectedGraph}
						showDataLabel={false}
					/>
				);
			case "stackedbarvertical":
				return (
					<StackedBar
						data={chartData}
						title={selectedGraph}
						vertical={true}
						showDataLabel={false}
					/>
				);
			case "stackedbarhorizontal":
				return (
					<StackedBar
						data={chartData}
						title={selectedGraph}
						vertical={false}
						showDataLabel={false}
					/>
				);
			case "pie":
				if (chartData.datasets.length === 1)
					return (
						<Grid container sx={{ justifyContent: "center" }}>
							<Grid
								item
								xs={12}
								md={12}
								lg={chartData.datasets.length === 1 ? 8 : 12}
							>
								<PieChart
									data={{
										labels: chartData.labels,
										datasets:
											pieChartData.length > 0
												? pieChartData[0].datasets
												: chartData.datasets,
									}}
									title={selectedGraph}
									showDataLabel={true}
								/>
							</Grid>
						</Grid>
					);
				else {
					return (
						<Grid container>
							{pieChartData.map((dataset, index) => (
								<Grid item xs={12} md={12} lg={6} pb={10} key={index}>
									<PieChart
										data={dataset}
										title={dataset.datasets[0].label}
										showDataLabel={true}
									/>
								</Grid>
							))}
						</Grid>
					);
				}
			default:
				return <h3 style={{ textAlign: "center" }}>No Data found!!!</h3>;
		}
	};

	const generatePieChartDataset = () => {
		const backgroundColor = [
			"rgb(255, 99, 132, 0.5)",
			"rgb(54, 162, 235, 0.5)",
			"rgb(255, 206, 86, 0.5)",
			"rgb(75, 192, 192, 0.5)",
			"rgb(153, 102, 255, 0.5)",
			"rgb(255, 159, 64, 0.5)",
			"rgb(255, 99, 132, 0.5)",
			"rgb(201, 203, 207, 0.5)",
			"rgb(255, 205, 86, 0.5)",
			"rgb(75, 192, 192, 0.5)",
			"rgb(54, 162, 235, 0.5)",
			"rgb(241, 92, 96, 0.5)",
			"rgb(131, 66, 16, 0.5)",
			"rgb(100, 221, 23, 0.5)",
			"rgb(0, 188, 212, 0.5)",
			"rgb(255, 82, 82, 0.5)",
			"rgb(63, 81, 181, 0.5)",
			"rgb(255, 127, 0, 0.5)",
			"rgb(129, 212, 250, 0.5)",
			"rgb(123, 31, 162, 0.5)",
		];

		const borderColor = [
			"rgb(255, 99, 132)",
			"rgb(54, 162, 235)",
			"rgb(255, 206, 86)",
			"rgb(75, 192, 192)",
			"rgb(153, 102, 255)",
			"rgb(255, 159, 64)",
			"rgb(255, 99, 132)",
			"rgb(201, 203, 207)",
			"rgb(255, 205, 86)",
			"rgb(75, 192, 192)",
			"rgb(54, 162, 235)",
			"rgb(241, 92, 96)",
			"rgb(131, 66, 16)",
			"rgb(100, 221, 23)",
			"rgb(0, 188, 212)",
			"rgb(255, 82, 82)",
			"rgb(63, 81, 181)",
			"rgb(255, 127, 0)",
			"rgb(129, 212, 250)",
			"rgb(123, 31, 162)",
		];
		const { datasets, labels } = chartData;

		const data = datasets.map((data, i) => {
			return {
				labels,
				datasets: [
					{
						data: data.data,
						backgroundColor: backgroundColor.slice(0, data.data.length),
						borderColor: borderColor.slice(0, data.data.length),
						label: data.label,
					},
				],
			};
		});
		setPieChartData(data);
	};


	const AdmissionReportComponent = () => (
		<Paper elevation={2} sx={{ marginBottom: "10px" }}>
			<Box p={1}><Typography color="primary" variant="subtitle2">TI-TOTAL INTAKE / TA-TOTAL ADMITTED / TV-TOTAL VACANT / TR-TOTAL REPORTED / TNR-TOTAL NOT-REPORTED</Typography></Box>
			<TableContainer>
				<Table size="small" aria-label="table">
					<TableHead>
						<StyledTableRow>
							<StyledTableCell></StyledTableCell>
							{admissionCategoryList.length > 0 && admissionCategoryList.map((li, idd) => (
								<StyledTableCell colSpan={5} key={idd}>
									{li}
								</StyledTableCell>
							))}
							<StyledTableCell></StyledTableCell>
						</StyledTableRow>
						<StyledTableRow>
							<StyledTableCell>
								Branch
							</StyledTableCell>
							{getSubHeader()?.map((column, id) => (
								<StyledTableCell
									key={`${id}-${new Date()}`}
									align={column.align}
									style={{ top: 57, minWidth: column.minWidth }}
								>
									{column.label}
								</StyledTableCell>
							))}
							<StyledTableCell >Admitted Total</StyledTableCell>
						</StyledTableRow>
					</TableHead>
					<TableBody>
						{admissionReportRow.map((row, index) => {
							return (
								<StyledTableRow hover key={index}>
									<StyledTableCell>
										{row.type == "total" ? <Typography variant="subtitle2" sx={{fontSize:"13px"}}>{row.branch}</Typography> :  row.branch}
									</StyledTableCell>
									{admissionCategoryList.map((al) => (
										<>
											<StyledTableCell style={{backgroundColor: row.type == "total" ? "#fff" : "#efebe9"}}>
												{row.type == "total" ? <Typography variant="subtitle2">{row[`${al}-intake`] || 0}</Typography> : row[`${al}-intake`] || 0}
											</StyledTableCell>
											<StyledTableCell style={{backgroundColor: row.type == "total" ? "#fff" : "#f5f5f0"}}>
												{row.type == "total" ? <Typography variant="subtitle2">{row[`${al}-admitted`] || 0}</Typography> : row[`${al}-admitted`] || 0}
											</StyledTableCell>
											<StyledTableCell style={{backgroundColor: row.type == "total" ? "#fff" : "#fffde7"}}>
												{row.type == "total" ? <Typography variant="subtitle2">{row[`${al}-vacant`] || 0}</Typography> : row[`${al}-vacant`] || 0}
											</StyledTableCell>
											<StyledTableCell style={{backgroundColor: row.type == "total" ? "#fff" : "#e6ffe6", color: row.type == "total" ? "#000": "blue", cursor: row[`${al}-reported`] == 0 || row[`${al}-reported`] == null || row.type == "total" ? "auto" : "pointer" }}>
												{row.type == "total" ? <Typography variant="subtitle2">{row[`${al}-reported`] || 0}</Typography> :  row[`${al}-reported`] == 0 || row[`${al}-reported`] == null ? <Typography>{row[`${al}-reported`] || 0}</Typography> :
													<Typography onClick={() => getStudentDetail(row, al, "tr")}>{row[`${al}-reported`] || 0}</Typography>}
											</StyledTableCell>
											<StyledTableCell style={{backgroundColor: row.type == "total" ? "#fff" : "#ffebee", color: row.type == "total" ? "#000" : "blue", cursor: row[`${al}-notReported`] == 0 || row[`${al}-notReported`] == null || row.type == "total" ? "auto" : "pointer" }}>
												{row.type == "total" ? <Typography variant="subtitle2">{row[`${al}-notReported`] || 0}</Typography> :  row[`${al}-notReported`] == 0 || row[`${al}-notReported`] == null ? <Typography>{row[`${al}-notReported`] || 0}</Typography> :
													<Typography onClick={() => getStudentDetail(row, al, "tnr")}>{row[`${al}-notReported`] || 0}</Typography>}
											</StyledTableCell>
										</>
									))}
									<StyledTableCell style={{textAlign:"center"}}>
										<Typography variant="subtitle2">{row.totalAdmitted}</Typography>
									</StyledTableCell>
								</StyledTableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);

	const AdmissionStudentReport = () => (
		<GridIndex
			rows={detailsRows}
			columns={admissionStudentReportColumns}
			loading={loading}
			columnVisibilityModel={columnVisibilityModel}
			setColumnVisibilityModel={setColumnVisibilityModel}
		/>
	);

	const getStudentDetail = async(obj,feeCategory,type)=> {	
			const selectedData = feeCategoryAllData.find((ob=>ob.program_specialization_short_name == obj.branch && ob.fee_admission_category_type == feeCategory && ob.schoolId == selectedInstitute));
			const {acYearId,schoolId,program_id,fee_admission_category_id,program_specialization_id} = selectedData;
			const params = new URLSearchParams();
			const keys = {
				"acYearId": acYearId,
				"schoolId": schoolId,
				"programId": program_id,
				"feeAdmissionCategoryId": fee_admission_category_id,
				"programSpecializationId": program_specialization_id,
			};
			Object.entries(keys).forEach(([key, value]) => {
				if (value != null) {
					params.append(key, value);
				}
			});
		try {
			if (type == "tr") {
				const res = await axios.get(`/api/admissionCategoryReport/getReportingStudentData?${params}`);
				if (res.status == 200 || res.status == 201) {
					if(res.data.data.length > 0){
						setIsDetails(true);
						setDetailsRows(res.data.data.map((li, index) => ({ ...li, id: index + 1 })))
					}else {
						setIsDetails(false);
							setAlertMessage({
								severity: "error",
								message: "No Data Found!!",
							});
							setAlertOpen(true);
					};	
				}
			} else {
				const res = await axios.get(`/api/admissionCategoryReport/getNotReportingStudentData?${params}`);
				if (res.status == 200 || res.status == 201) {
					if (res.data.data.length > 0) {
						setIsDetails(true);
						setDetailsRows(res.data.data.map((li, index) => ({ ...li, id: index + 1 })))
					} else {
						setIsDetails(false);
						setAlertMessage({
							severity: "error",
							message: "No Data Found!!",
						});
						setAlertOpen(true);
					};
				}
			}
		} catch (error) {
			setIsDetails(false)
			console.log(error)
		}
	};

	return (
		<Box
			sx={{
				position: "relative"
			}}
		>
			<Grid container>
				{enlargeChart && (
					<ChartSection>
						<ChartContainer>
							<Grid item xs={12} sm={12} md={12} lg={12} xl={12} p={2}>
								<CloseButton
									fontSize="large"
									onClick={() => setEnlargeChart(false)}
								/>
								{renderChart()}
							</Grid>
						</ChartContainer>
					</ChartSection>
				)}
				{isAdmissionRowClick && <Grid item xs={2} sx={{ marginTop: { xs: 1, md: 1 } }}></Grid>}
				{!isDetails && <Grid item xs={isAdmissionRowClick ? 10 : 12} sx={{ marginTop: { xs: 1, md: isAdmissionRowClick ? -5 : 1 } }}>
					<Grid container>
						<Grid item xs={12}>
							<Grid container sx={{ display: "flex", justifyContent: isAdmissionRowClick ? "flex-end" : "flex-start", gap: "15px", flexWrap: "nowrap" }}>
								<Grid item xs={12} md={2}>
									<CustomAutocomplete
										name="graph"
										value={selectedGraph}
										label="Graph By"
										handleChangeAdvance={(name, newValue) => (setSelectedGraph(newValue), setIsAdmissionRowClick(false))}
										options={GraphOptions || []}
										required
									/>
								</Grid>

								{selectedGraph === "Datewise Statistics" && (
									<Grid item xs={12} md={2}>
										<CustomDatePicker
											name="Datewise"
											label="Datewise"
											minDate="01-01-2025"
											value={selectedDate}
											handleChangeAdvance={(name, newValue) =>
												setSelectedDate(newValue)
											}
										/>
									</Grid>
								)}

								{selectedGraph !== "Year Wise" &&
									selectedGraph !== "Day Wise" &&
									selectedGraph !== "GeoLocation" &&
									selectedGraph !== "Datewise Statistics" && (
										<Grid item xs={12} md={2}>
											<CustomAutocomplete
												name="AcademicYear"
												value={selectedAcademicYear}
												label="Academic Year"
												handleChangeAdvance={(name, newValue) => setSelectedAcademicYear(newValue)}
												options={academicYears || []}
												required
											/>
										</Grid>
									)}

								{selectedGraph === "GeoLocation" && (
									<>
										<Grid item xs={12} md={2}>
											<CustomAutocomplete
												name="Country"
												value={selectedCountry}
												label="Country"
												handleChangeAdvance={(name, newValue) => setSlectedCountry(newValue)}
												options={countryList || []}
											/>
										</Grid>
										<Grid item xs={12} md={2}>
											<CustomAutocomplete
												name="State"
												value={selectedState}
												label="State"
												handleChangeAdvance={(name, newValue) => setSlectedState(newValue)}
												options={stateList || []}
											/>
										</Grid>
										<Grid item xs={12} md={2}>
											<CustomAutocomplete
												name="City"
												value={selectedCity}
												label="City"
												handleChangeAdvance={(name, newValue) => setSlectedCity(newValue)}
												options={cityList || []}
											/>
										</Grid>
									</>
								)}

								{(selectedGraph === "Programme" ||
									selectedGraph === "Gender" ||
									selectedGraph === "GeoLocation" ||
									selectedGraph === "Datewise Statistics" ||
									selectedGraph == "AdmissionReport") && (
										<Grid item xs={12} md={selectedGraph !== "AdmissionReport" ? 1 : 4}>
											<CustomAutocomplete
												name="Institute"
												value={selectedInstitute}
												label="Institute"
												handleChangeAdvance={(name, newValue) => { setSelectedInstitute(newValue); getProgramData(newValue)}}
												options={selectedGraph !== "AdmissionReport" ? instituteList : fullNameInstituteList}
												required={selectedGraph == "AdmissionReport" || selectedGraph =="Programme" ? true : false}
											/>
										</Grid>
									)}

								{(selectedGraph == "AdmissionReport") && (
									<Grid item xs={12} md={2}>
										<CustomAutocomplete
											name="programId"
											value={programId}
											label="Program"
											handleChangeAdvance={(name, newValue) => {setProgramId(newValue);getAdmissionReportData(newValue)}}
											options={programList}
											required
										/>
									</Grid>
								)}

								{selectedGraph === "Day Wise" && (
									<>
										<Grid item xs={12} md={2}>
											<CustomAutocomplete
												name="month"
												value={selectedMonth}
												label="Month"
												handleChangeAdvance={(name, newValue) => setSelectedMonth(newValue)}
												options={MonthOptions || []}
											/>
										</Grid>
										<Grid item xs={12} md={2}>
											<CustomAutocomplete
												name="year"
												value={selectedYear}
												label="Year"
												handleChangeAdvance={(name, newValue) => setSelectedYear(newValue)}
												options={yearOptions || []}
											/>
										</Grid>
									</>
								)}
								{selectedGraph !== "AdmissionReport" && <Grid item xs={12} md={2}>
									<CustomAutocomplete
										name="chart"
										value={selectedChart}
										label="Chart"
										handleChangeAdvance={(name, newValue) => setSelectedChart(newValue)}
										options={ChartOptions || []}
									/>
								</Grid>}
								{selectedGraph !== "AdmissionReport" && <Grid item xs={12} md={3}>
									<FormGroup>
										<Box>
											<Stack direction="row" spacing={1} alignItems="center">
												<Typography>Chart view</Typography>
												<FormControlLabel
													control={
														<IOSSwitch
															sx={{ m: 1 }}
															checked={isTableView}
															handlechange={() => setIsTableView(!isTableView)}
															disabled={selectedGraph === "Datewise Statistics" || isGroupColumnTable}
														/>
													}
												/>
												<Typography>Table view</Typography>
											</Stack>
										</Box>
									</FormGroup>
								</Grid>}
							</Grid>
						</Grid>
					</Grid>
				</Grid>}

				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Box mt={1} mb={1} sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}><b>Note: </b><Typography color="error" variant="subtitle2">Data shown up to 2024–25 is migrated data and includes only active Count. For complete and accurate records, please refer to the old ERP software.</Typography></Box>
						<Grid container sx={{ justifyContent: "center" }}>
							{isTableView ? (
								<Grid
									item
									xs={12}
									md={12}
									lg={isGroupColumnTable ? [...new Set(data.map((item) => item.fee_admission_category_short_name))].length > 2 ? 12 : 8 : (tableColumns.length <= 4 && !isDetails && selectedGraph !== "AdmissionReport") ? 8 : 12}
									pt={1}
									sx={{
										position: "absolute", width: "100%",
										"& .last-row": {
											fontWeight: "bold",
											backgroundColor: "#376a7d !important",
											color: "#fff",
										},
										"& .last-column": { fontWeight: "bold" },
										"& .last-row:hover": {
											backgroundColor: "#376a7d !important",
											color: "#fff",
										},
										"& .header-bg": {
											fontWeight: "bold",
											backgroundColor: "#376a7d",
											color: "#fff",
										},
										"& .latest-year": {
											color: "#000",
											fontWeight: "bold"
										},
									}}
								>
									{isGroupColumnTable ? <GroupedColumnTable data={data} /> :
										!isDetails && selectedGraph !== "AdmissionReport" ? <GridIndex
											rows={tableRows}
											columns={tableColumns}
											getRowId={(row) => row.id}
											isRowSelectable={(params) =>
												tableRows.length - 1 !== params.row.id
											}
											getRowClassName={(params) => {
												return params.row.id === "last_row_of_table"
													? "last-row"
													: "";
											}}
											loading={loading}
											columnVisibilityModel={columnVisibilityModel}
											setColumnVisibilityModel={setColumnVisibilityModel}
										/> : selectedGraph !== "AdmissionReport" ?
											<GridIndex
												rows={detailsRows}
												columns={detailsColumns}
												getRowId={(row) => row.id}
												isRowSelectable={(params) =>
													tableRows.length - 1 !== params.row.id
												}
												getRowClassName={(params) => {
													return params.row.id === "last_row_of_table"
														? "last-row"
														: "";
												}}
												loading={loading}
												columnVisibilityModel={columnVisibilityModel}
												setColumnVisibilityModel={setColumnVisibilityModel}
											/> : selectedGraph == "AdmissionReport" && !isDetails ? AdmissionReportComponent() : AdmissionStudentReport()
									}
								</Grid>
							) : (
								<Grid
									item
									xs={12}
									md={12}
									lg={12}
									p={3}
									style={{ position: "relative" }}
								>
									{Object.keys(chartData).length > 0 && (
										<EnlargeChartIcon
											fontSize="medium"
											onClick={() => setEnlargeChart(!enlargeChart)}
										/>
									)}
									{Object.keys(chartData).length > 0 ? renderChart() : null}
								</Grid>
							)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

export default AdmissionPage;