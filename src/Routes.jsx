import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  MemoryRouter as MRouter,
} from "react-router-dom";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Chart from "chart.js/auto";
import OverlayLoader from "./components/OverlayLoader";
import CreateRefreshmentRequest from "./pages/forms/cateringMaster/refreshmentApprover/CreateRefreshmentRequest.jsx";
import RefreshmentMaster from "./pages/forms/cateringMaster/refreshmentReport/RefreshmentMaster.jsx";
import AttendServiceTransportMaster from "./pages/forms/myRequest/AttendServiceTransportMaster.jsx";
import AttendServiceMaster from "./pages/forms/myRequest/AttendServiceMaster.jsx";
import AttendServiceHistory from "./pages/forms/myRequest/AttendServiceHistory.jsx";
import AttendRequestMaster from "./pages/forms/myRequest/RequestMasterReport.jsx";
import ServiceRequestGraph from "./pages/forms/myRequest/graphView/ServiceRequestGraph.jsx";
import StoreIndentRequests from "./containers/indeces/inventoryMaster/StoreIndentRequests.jsx";
import RestrictWindowMaster from "./pages/masters/RestrictWindow.jsx";
import PaysliplockCreate from "./containers/indeces/restrictwindowMaster/paysliplock/createpaysliploack.jsx";
import PaysliplockEdit from "./containers/indeces/restrictwindowMaster/paysliplock/editpaysliploack.jsx";
import EventForm from "./containers/indeces/dailyPlanner/eventCreation.jsx";
import TaskList from "./containers/indeces/dailyPlanner/taskList.jsx";
import HostelBedForm from "./pages/forms/hostelBedView/HostelBedForm.jsx";
import StudentMarks from "./pages/forms/studentMaster/StudentMarks.jsx";
import StudentMarksIndex from "./pages/forms/studentMaster/StudentMarksIndex.jsx";
import FRRO from "./pages/forms/frro/index.jsx";
import FRROCreate from "./pages/forms/frro/create.jsx";
import FRROUpdate from "./pages/forms/frro/update.jsx";
import StudentRazorPayWindow from "./pages/forms/StudentPaymentMaster/StudentRazorPayWindow.jsx";
import FeeTransfer from "./pages/forms/studentMaster/FeeTransfer.jsx";
import HodEmployeeDetail from "./components/HodEmployeeDetail.jsx";
import StudentFedbackWindow from "./containers/indeces/studentFeedbackMaster/StudentFeedbackWindow.jsx";
import StudentFeedbackFreezeCreate from "./containers/indeces/studentFeedbackMaster/StudentFeedbackFreezeCreate.jsx";
import StudentFeedbackWindowUpdate from "./containers/indeces/studentFeedbackMaster/StudentFeedbackWindowUpdate.jsx";
import StudentFeddbackFreezeUpdate from "./containers/indeces/studentFeedbackMaster/StudentFeddbackFreezeUpdate.jsx";
import AllowStudentFeedback from "./containers/indeces/studentFeedbackMaster/AllowStudentFeedback.jsx";
import SubmitFeedbackSelect from "./containers/indeces/studentFeedbackMaster/SubmitFeedbackSelect.jsx";
import SubmitFeedback from "./containers/indeces/studentFeedbackMaster/SubmitFeedback.jsx";
import EmployeeFeedbackIndex from "./containers/indeces/studentFeedbackMaster/EmployeeFeedbackIndex.jsx";
import EmployeeFeedbackReport from "./containers/indeces/studentFeedbackMaster/EmployeeFeedbackReport.jsx";
import StudentProctorIndex from "./containers/indeces/mentorMaster/StudentProctorIndex.jsx";
import CourseAssignmentIndex from "./containers/indeces/timeTableMaster/CourseAssignmentIndex.jsx";
import PaymentGatewayTransaction from "./components/Gatewaygateway.jsx";
import ProctorStudentAssignmentFormInst from "./pages/forms/mentorMaster/ProctorStudentAssignmentFormInst.jsx";
import GRNCreationForm from "./pages/forms/inventoryMaster/GRNCreationForm.jsx";
import RazorPayPendingSettlementDetail from "./containers/indeces/razorpaySettlementMaster/razorpayPendingSettlement.jsx";
import NewAdmissionsDueReport from "./pages/forms/studentDueReport/newAdmissionsDueReport.jsx";
import InstituteBankBalance from "./containers/indeces/bankGroupBankBalanceMaster/InstituteBankBalance.jsx";
import BRSTransactionDetail from "./containers/indeces/bankGroupBankBalanceMaster/BRSTransactionDetails.jsx";
import BRSChqNotIssuedDebitedDetail from "./containers/indeces/bankGroupBankBalanceMaster/BRSChqIssuedNotDebitedDetails.jsx";
import BRSDirectCreditedToBankDetail from "./containers/indeces/bankGroupBankBalanceMaster/BRSDirectCreditedToBankDetails.jsx";
import BRSChqDepositedNotCreditedDetail from "./containers/indeces/bankGroupBankBalanceMaster/BrsChqDepositedNotCreditedDetails.jsx";

const PaysliplockIndex = lazy(() =>
  import("./containers/indeces/restrictwindowMaster/paysliplock")
);

const StudentFeedbackMaster = lazy(() =>
  import("./pages/masters/StudentFeedbackMaster")
);

const FacultyFeedbackReport = lazy(() =>
  import("./containers/indeces/facultyFeedbackMaster/FacultyFeedbackReport.jsx")
);

const FacultyFeedbackReportBySection = lazy(() =>
  import(
    "./containers/indeces/facultyFeedbackMaster/FacultyFeedbackReportBySection.jsx"
  )
);

const FacultyFeedbackReportCourseForm = lazy(() =>
  import(
    "./pages/forms/facultyFeedbackMasterCourse/facultyFeedbackReportCourseForm.jsx"
  )
);

const FacultyFeedbackReportByCourse = lazy(() =>
  import(
    "./pages/forms/facultyFeedbackMasterCourse/facultyFeedbackReportByCourse.jsx"
  )
);

const EmpDocumentCollection = lazy(() =>
  import("./components/EmpDocumentCollectionPdf")
);
const StudentDocumentUpload = lazy(() =>
  import("./components/StudentDocumentUpload")
);
const StudentDocument = lazy(() => import("./components/StudentDocument"));
const PoPaymentList = lazy(() =>
  import("./containers/indeces/inventoryMaster/PoPaymentList.jsx")
);

// Student Feedback Master Forms
const StudentDetailsSearch = lazy(() =>
  import("./pages/indeces/StudentDetailsSearch")
);
const StudentDetailsViewAttendance = lazy(() =>
  import("./components/StudentDetailsViewAttendance.jsx")
);
const StudentFeedbackForm = lazy(() =>
  import("./pages/forms/studentFeedbackMaster/StudentFeedbackForm")
);

const AllowStudentFeedbackMaster = lazy(() =>
  import("./pages/masters/AllowStudentFeedbackMaster")
);

const AllowStudentFeedbackForm = lazy(() =>
  import("./pages/forms/allowStudentFeedbackMaster/AllowStudentFeedbackForm")
);

const StudentFeedbackReportMaster = lazy(() =>
  import("./pages/masters/StudentFeedbackReportMaster")
);

const FacultyFeedbackMaster = lazy(() =>
  import("./pages/masters/FacultyFeedbackMaster")
);

const StudentRazorPayWindowUniform = lazy(() =>
  import("./pages/forms/StudentPaymentMaster/StudentRazorPayWindowUniform.jsx")
);

const StudentExternalPayment = lazy(() =>
  import("./pages/forms/StudentPaymentMaster/StudentExternalPayment.jsx")
);

const PaymentSuccessForm = lazy(() =>
  import("./pages/forms/StudentPaymentMaster/PaymentSuccessForm.jsx")
);

const StudentWebView = lazy(() =>
  import("./pages/forms/StudentPaymentMaster/StudentWebView.jsx")
);

const StudentUniformWebView = lazy(() =>
  import("./pages/forms/StudentPaymentMaster/StudentUniformWebView.jsx")
);

const StudentBulkWebView = lazy(() =>
  import("./pages/forms/StudentPaymentMaster/StudentBulkWebView.jsx")
);

const StudentExamWebView = lazy(() =>
  import("./pages/forms/StudentPaymentMaster/StudentExamWebView.jsx")
);

Chart.register(ChartDataLabels);
const ChartsDashboard = lazy(() => import("./pages/forms/chartsDashboard"));
const FinancePage = lazy(() =>
  import("./pages/forms/chartsDashboard/finance/index")
);
const HRMPage = lazy(() => import("./pages/forms/chartsDashboard/hrm/index"));
const AdmissionPage = lazy(() =>
  import("./pages/forms/chartsDashboard/admission/index")
);

const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const FormExample = lazy(() => import("./containers/examples/FormExample"));
const NavigationLayout = lazy(() => import("./layouts/NavigationLayout"));
const SchedulerMaster = lazy(() => import("./components/SchedulerMaster.jsx"));
const EmpDashboard = lazy(() => import("./components/EmpDashboard.jsx"));
const HodDashboard = lazy(() => import("./components/HodDashboard.jsx"));
const PrincipalDashboard = lazy(() =>
  import("./components/PrincipalDashboard.jsx")
);
const ChangePassword = lazy(() => import("./pages/ChangePassword"));

// Master pages
const AcademicSectionMaster = lazy(() =>
  import(
    "./containers/indeces/academicSectionMaster/ClassCommencementIndex.jsx"
  )
);
const CourseMaster = lazy(() => import("./pages/masters/CourseMaster"));
const BankMaster = lazy(() => import("./pages/masters/BankMaster.jsx"));
const NavigationMaster = lazy(() => import("./pages/masters/NavigationMaster"));
const InstituteMaster = lazy(() => import("./pages/masters/InstituteMaster"));
const HostelCreationMaster = lazy(() =>
  import("./pages/masters/HostelCreationMaster")
);
const InventoryMaster = lazy(() => import("./pages/masters/InventoryMaster"));
const TimeTableMaster = lazy(() =>
  import("./pages/masters/TimeTableMaster.jsx")
);

const FacultyMaster = lazy(() => import("./pages/masters/FacultyMaster.jsx"));

const FacultyMasterUser = lazy(() =>
  import("./pages/masters/FacultyMasterUser.jsx")
);

const FacultyMasterDept = lazy(() =>
  import("./pages/masters/FacultyMasterDept.jsx")
);

const HostelBedViewMaster = lazy(() =>
  import("./pages/masters/HostelBedViewMaster")
);
const HostelDueMaster = lazy(() => import("./pages/masters/HostelDueMaster"));

const HostelBlockView = lazy(() =>
  import("./containers/indeces/hostelDueIndex/HostelBlockView")
);

const HostelDueReport = lazy(() =>
  import("./containers/indeces/hostelDueIndex/HostelDueReport")
);
const HostelStudenDue = lazy(() =>
  import("./containers/indeces/hostelDueIndex/HostelStudentDueIndex")
);
const PublicationReport = lazy(() =>
  import("./pages/masters/ProfessionalReport.jsx")
);

const ApproveIncentive = lazy(() =>
  import("./pages/masters/ApprovedIncentive.jsx")
);
const ApproveIncentiveReport = lazy(() =>
  import("./pages/masters/ApprovedIncentiveReport.jsx")
);

const ExitFormMaster = lazy(() => import("./pages/masters/ExitFormMaster"));
const FinanceMaster = lazy(() => import("./pages/masters/FinanceMaster.jsx"));
const PaymentMaster = lazy(() => import("./pages/masters/PaymentMaster"));
const FeeRecieptDayBookMaster = lazy(() =>
  import("./pages/masters/FeeReceiptMaster.jsx")
);

const FeereceiptReportInst = lazy(() =>
  import("./containers/indeces/studentMaster/FeereceiptReportInst.jsx")
);

const StudentPaymentMaster = lazy(() =>
  import("./pages/masters/StudentPaymentMaster.jsx")
);

const ExamFeePayment = lazy(() => import("./pages/masters/ExamFeePayment.jsx"));

const UniformFeePayment = lazy(() =>
  import("./pages/forms/StudentPaymentMaster/StudentUniformFee.jsx")
);

const StudentUniformTransaction = lazy(() =>
  import(
    "./containers/indeces/studentUniformTransactionMaster/studentUniformTransactionIndex.jsx"
  )
);

const FeepaymentTransactions = lazy(() =>
  import("./pages/masters/FeepaymentTransactions.jsx")
);

const StudentProfile = lazy(() =>
  import("./pages/forms/studentMaster/StudentProfile.jsx")
);

const StudentRazorPayTransaction = lazy(() =>
  import("./pages/forms/StudentPaymentMaster/StudentRazorPayTransaction.jsx")
);

//Academic Section Master
const ClassCommencementForm = lazy(() =>
  import("./pages/forms/academicSectionMaster/ClassCommencementForm")
);

// Navigation Master
const ModuleForm = lazy(() =>
  import("./pages/forms/navigationMaster/ModuleForm")
);
const MenuForm = lazy(() => import("./pages/forms/navigationMaster/MenuForm"));
const SubmenuForm = lazy(() =>
  import("./pages/forms/navigationMaster/SubmenuForm")
);
const RoleForm = lazy(() => import("./pages/forms/navigationMaster/RoleForm"));

// User Creation
const UserForm = lazy(() => import("./pages/forms/UserForm"));
const UserIndex = lazy(() => import("./pages/indeces/UserIndex"));

// Hostel Creation
const HostelBlockForm = lazy(() =>
  import("./pages/forms/hostelCreation/HostelBlockForm")
);
const HostelRoomForm = lazy(() =>
  import("./pages/forms/hostelCreation/HostelRoomForm")
);

// Institute Master
const OrganizationForm = lazy(() =>
  import("./pages/forms/instituteMaster/OrganizationForm")
);
const SchoolForm = lazy(() =>
  import("./pages/forms/instituteMaster/SchoolForm")
);
const JobtypeForm = lazy(() =>
  import("./pages/forms/instituteMaster/JobtypeForm")
);
const EmptypeForm = lazy(() =>
  import("./pages/forms/instituteMaster/EmptypeForm")
);
const GraduationForm = lazy(() =>
  import("./pages/forms/instituteMaster/GraduationForm")
);
const SchoolVisionForm = lazy(() =>
  import("./pages/forms/instituteMaster/SchoolVisionForm")
);

const HostelBedViewForm = lazy(() =>
  import("./pages/forms/hostelBedView/HostelBedViewForm")
);

// Shift
const ShiftMaster = lazy(() => import("./pages/masters/ShiftMaster"));
const ShiftForm = lazy(() => import("./pages/forms/shiftMaster/ShiftForm"));

//PO

const ApproverCreation = lazy(() =>
  import("./pages/forms/inventoryMaster/ApproverCreation.jsx")
);

const ApproverIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/ApproverIndex.jsx")
);

const DirectPOCreation = lazy(() =>
  import("./pages/forms/inventoryMaster/DirectPOCreation")
);

const DraftPoView = lazy(() =>
  import("./pages/forms/inventoryMaster/DraftPoView.jsx")
);

const PoMaster = lazy(() => import("./pages/masters/PoMaster.jsx"));

const CreateGrn = lazy(() =>
  import("./pages/forms/inventoryMaster/CreateGrn.jsx")
);

const AssignPoApprover = lazy(() =>
  import("./containers/indeces/inventoryMaster/AssignPoApprover.jsx")
);

const PoBillApprover = lazy(() =>
  import("./containers/indeces/inventoryMaster/BillApprover.jsx")
);

const PoAssignedData = lazy(() =>
  import("./containers/indeces/inventoryMaster/PoAssignedData.jsx")
);

const DirectPOPdf = lazy(() =>
  import("./pages/forms/inventoryMaster/DirectPOPdf.jsx")
);

const PoPdf = lazy(() => import("./pages/forms/inventoryMaster/PoPdf.jsx"));

const DraftPoPdf = lazy(() =>
  import("./pages/forms/inventoryMaster/DraftPoPdf.jsx")
);

const PoUpdate = lazy(() =>
  import("./pages/forms/inventoryMaster/PoUpdate.jsx")
);

const CreatedGRN = lazy(() => import("./components/CreatedGRN.jsx"));

const GrnIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/GrnIndex.jsx")
);

const GrnPdf = lazy(() => import("./pages/forms/inventoryMaster/GrnPdf.jsx"));

//Inventory Master
const StoreForm = lazy(() => import("./pages/forms/inventoryMaster/StoreForm"));
const MeasureForm = lazy(() =>
  import("./pages/forms/inventoryMaster/MeasureForm")
);
const VendorForm = lazy(() =>
  import("./pages/forms/inventoryMaster/VendorForm")
);
const VendorHistory = lazy(() =>
  import("./containers/indeces/inventoryMaster/VendorHistory.jsx")
);
const ItemCreation = lazy(() =>
  import("./pages/forms/inventoryMaster/ItemCreation.jsx")
);

const ItemIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/ItemIndex.jsx")
);

const ItemAssignemnt = lazy(() =>
  import("./pages/forms/inventoryMaster/ItemAssignment.jsx")
);

const ItemAssignmentIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/ItemInstoreIndexNew.jsx")
);

const View = lazy(() => import("./pages/forms/inventoryMaster/View.jsx"));

//Event Master
const EventMaster = lazy(() => import("./pages/masters/EventMaster"));

const EventCreationForm = lazy(() =>
  import("./pages/forms/eventMaster/EventCreationForm")
);
const TimeTableRoom = lazy(() =>
  import("./pages/forms/timeTableRoom/TimeTableRoomForm")
);
const TimeTableRoomView = lazy(() =>
  import("./pages/forms/timeTableRoom/TimeTableRoomView")
);

const RoomCreationForm = lazy(() =>
  import("./pages/forms/eventMaster/RoomCreationForm")
);

const EventRoomView = lazy(() =>
  import("./pages/forms/eventMaster/EventRoomView")
);

// Event User
const EventUserMaster = lazy(() =>
  import("./pages/masters/EventUserMaster.jsx")
);

const EventUserCreationForm = lazy(() =>
  import("./pages/forms/eventUserMaster/EventUserCreationForm.jsx")
);
const RoomUserCreationForm = lazy(() =>
  import("./pages/forms/eventUserMaster/RoomUserCreationForm.jsx")
);
const EventUserRoomView = lazy(() =>
  import("./pages/forms/eventUserMaster/EventUserRoomView.jsx")
);

const EventApproverIndex = lazy(() =>
  import("./containers/indeces/eventMaster/EventApproverIndex.jsx")
);

// Candidate Walkin
const CandidateWalkinForm = lazy(() =>
  import("./pages/forms/candidateWalkin/CandidateWalkinForm")
);
const CandidateWalkinIndex = lazy(() =>
  import("./pages/indeces/CandidateWalkinIndex")
);
const CandidateWalkinIntlIndex = lazy(() =>
  import("./pages/indeces/CandidateWalkinIntlIndex.jsx")
);
const PreAdmissionProcessForm = lazy(() =>
  import("./pages/forms/candidateWalkin/PreAdmissionProcessForm")
);
const PreGrantApproveMaster = lazy(() =>
  import("./pages/masters/PreGrantApproveMaster")
);
const PreScholarshipApproverForm = lazy(() =>
  import("./pages/forms/candidateWalkin/PreScholarshipApproverForm")
);
const PreScholarshipVerifierForm = lazy(() =>
  import("./pages/forms/candidateWalkin/PreScholarshipVerifierForm")
);
const OfferLetterView = lazy(() =>
  import("./pages/forms/candidateWalkin/OfferLetterView")
);
const AuidForm = lazy(() => import("./pages/forms/candidateWalkin/AuidForm"));
const MyProfile = lazy(() => import("./components/MyProfile"));
const StudentProfileView = lazy(() =>
  import("./components/StudentProfileView")
);
const DirectScholarshipForm = lazy(() =>
  import("./pages/forms/candidateWalkin/DirectScholarshipForm")
);
const ScholarshipApproverForm = lazy(() =>
  import("./pages/forms/candidateWalkin/ScholarshipApproverForm")
);
const ScholarshipApplicationPrint = lazy(() =>
  import("./pages/forms/candidateWalkin/ScholarshipApplicationPrint")
);
const ScholarshipApproverIndex = lazy(() =>
  import("./pages/indeces/ScholarshipApproverIndex")
);
const ScholarshipApproverHistory = lazy(() =>
  import("./pages/indeces/ScholarshipApproverHistory")
);
const GrantPrintApplication = lazy(() =>
  import("./pages/forms/studentDetailMaster/GrantPrintApplication")
);
const PreScholarshipVerifierIndex = lazy(() =>
  import("./pages/indeces/PreScholarshipVerifierIndex")
);
const PreScholarshipVerifierHistory = lazy(() =>
  import("./pages/indeces/PreScholarshipVerifierHistory")
);
const ScholarshipUpdateForm = lazy(() =>
  import("./pages/forms/candidateWalkin/ScholarshipUpdateForm")
);
const CandidateAcceptanceForm = lazy(() =>
  import("./pages/forms/candidateWalkin/CandidateAcceptanceForm")
);
const CandidateRegistrationPayment = lazy(() =>
  import("./pages/forms/candidateWalkin/CandidateRegistrationPayment")
);
const AdmissionForm = lazy(() =>
  import("./pages/forms/candidateWalkin/AdmissionForm")
);
const CandidateRazorPay = lazy(() =>
  import("./pages/forms/candidateWalkin/CandidateRazorPay")
);
const CandidateWalkinUserwise = lazy(() =>
  import("./pages/indeces/CandidateWalkinUserwise")
);
// Academic Calendar
const AcademicCalendars = lazy(() =>
  import("./pages/masters/AcademicCalendars")
);
const AcademicyearForm = lazy(() =>
  import("./pages/forms/academicCalendars/AcademicyearForm")
);
const CalenderyearForm = lazy(() =>
  import("./pages/forms/academicCalendars/CalenderyearForm")
);
const FinancialyearForm = lazy(() =>
  import("./pages/forms/academicCalendars/FinancialyearForm")
);

// Academic Master
const AcademicMaster = lazy(() => import("./pages/masters/AcademicMaster"));
const DepartmentForm = lazy(() =>
  import("./pages/forms/academicMaster/DepartmentForm")
);
const DepartmentAssignmentForm = lazy(() =>
  import("./pages/forms/academicMaster/DepartmentAssignmentForm")
);
const ProgramForm = lazy(() =>
  import("./pages/forms/academicMaster/ProgramForm")
);
const ProgramAssignmentForm = lazy(() =>
  import("./pages/forms/academicMaster/ProgramAssignmentForm")
);
const ProgramSpecializationForm = lazy(() =>
  import("./pages/forms/academicMaster/ProgramSpecializationForm")
);
const VisionMissionForm = lazy(() =>
  import("./pages/forms/academicMaster/VisionMissionForm")
);
const InternalAssesmentForm = lazy(() =>
  import("./pages/forms/academicMaster/InternalAssesmentForm")
);
const InternalRoomAssignment = lazy(() =>
  import("./pages/forms/academicMaster/InternalRoomAssignment")
);
const InternalAssesmentIndex = lazy(() =>
  import("./pages/indeces/InternalAssesmentIndex")
);
const InternalRoomAssignmentIndex = lazy(() =>
  import("./pages/indeces/InternalRoomAssignmentIndex")
);
const InternalAssesmentUpdate = lazy(() =>
  import("./pages/forms/academicMaster/InternalAssesmentUpdate")
);
const InternalAssesmentAttendance = lazy(() =>
  import("./pages/forms/academicMaster/InternalAssesmentAttendance.jsx")
);
const InternalMarksForm = lazy(() =>
  import("./pages/forms/academicMaster/InternalMarksForm.jsx")
);
const InternalMarksIndex = lazy(() =>
  import("./pages/indeces/InternalMarksIndex")
);
const InternalMarksUserIndex = lazy(() =>
  import("./pages/indeces/InternalMarksUserIndex")
);
const InternalsTimeTable = lazy(() =>
  import("./pages/forms/academicMaster/InternalsTimeTable.jsx")
);
const InternalMarksInstituteIndex = lazy(() =>
  import("./pages/indeces/InternalMarksInstituteIndex")
);
const InternalMarksDeptIndex = lazy(() =>
  import("./pages/indeces/InternalMarksDeptIndex")
);
const StudentInternalReport = lazy(() =>
  import("./pages/forms/studentMaster/StudentInternalReport.jsx")
);
const InternalFinalMarksIndex = lazy(() =>
  import("./pages/indeces/InternalFinalMarksIndex")
);
const InternalResultAnalysis = lazy(() =>
  import("./pages/indeces/InternalResultAnalysis")
);
const InternalFinalMarksfilter = lazy(() =>
  import("./pages/forms/academicMaster/InternalFinalMarksfilter.jsx")
);

// Course Pattern

const CourseForm = lazy(() => import("./pages/forms/courseMaster/CourseForm"));

const CourseAssignmentEmployee = lazy(() =>
  import("./pages/forms/courseMaster/CourseAssignmentEmployee.jsx")
);

const CourseTypeForm = lazy(() =>
  import("./pages/forms/courseMaster/CourseTypeForm")
);
const CourseCategoryForm = lazy(() =>
  import("./pages/forms/courseMaster/CourseCategoryForm")
);
const CourseStudentAssignment = lazy(() =>
  import("./pages/forms/courseMaster/CourseStudentAssignment")
);
const CourseStudentAssignmentIndex = lazy(() =>
  import("./containers/indeces/courseMaster/CourseStudentAssignmentIndex")
);

const Courseassignmentstudentindex = lazy(() =>
  import("./containers/indeces/courseMaster/CourseAssignmentStudentIndex")
);

const CoursePatternIndex = lazy(() =>
  import("./containers/indeces/courseMaster/CoursePatternIndex")
);
const CoursePatternForm = lazy(() =>
  import("./pages/forms/courseMaster/CoursePatternForm")
);

const CourseSubjectiveMaster = lazy(() =>
  import("./pages/masters/CourseSubjectiveMaster")
);

// CategoryType Master Forms

const CommencementTypeForm = lazy(() =>
  import("./pages/forms/categoryTypeMaster/CommencementTypeForm")
);

// Course Assignment
const CourseassignmentIndex = lazy(() =>
  import("./containers/indeces/courseMaster/CourseassignmentIndex")
);

const CourseAssignmentEmployeeIndex = lazy(() =>
  import("./containers/indeces/courseMaster/CourseAssignmentEmployeeIndex.jsx")
);

const CourseAssignment = lazy(() =>
  import("./pages/forms/courseMaster/CourseAssignment")
);

const CourseObjectiveForm = lazy(() =>
  import("./pages/forms/courseMaster/CourseObjectiveForm")
);
const CourseOutcomeForm = lazy(() =>
  import("./pages/forms/courseMaster/CourseOutcomeForm")
);
const SyllabusForm = lazy(() =>
  import("./pages/forms/academicMaster/SyllabusForm")
);

// Admission Master
const AdmissionMaster = lazy(() => import("./pages/masters/AdmissionMaster"));
const AdmCategoryForm = lazy(() =>
  import("./pages/forms/admissionMaster/AdmCategoryForm")
);
const AdmSubCategoryForm = lazy(() =>
  import("./pages/forms/admissionMaster/AdmSubcategoryForm")
);
const BoardForm = lazy(() => import("./pages/forms/admissionMaster/BoardForm"));
const CurrencytypeForm = lazy(() =>
  import("./pages/forms/admissionMaster/CurrencyForm")
);
const ProgramtypeForm = lazy(() =>
  import("./pages/forms/admissionMaster/ProgramtypeForm")
);

// ExitForm Master Forms
const ExitForm = lazy(() => import("./pages/forms/exitFormMaster/ExitForm"));
const ExitQuestionsForm = lazy(() =>
  import("./pages/forms/exitFormMaster/ExitQuestionsForm")
);

//Consumables

const Consumables = lazy(() => import("./pages/masters/Consumables.jsx"));

const StockRegister = lazy(() => import("./pages/masters/StockRegister.jsx"));

const ConsumablesReport = lazy(() =>
  import("./containers/indeces/inventoryMaster/Expenditure.jsx")
);

const ClosingstockReport = lazy(() =>
  import("./components/ClosingstockReport.jsx")
);

// Fee Template
const FeetemplateMaster = lazy(() =>
  import("./pages/masters/FeetemplateMaster")
);
const FeeTemplate = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeeTemplate")
);
const FeetemplateSubamount = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeetemplateSubamount")
);
const FeetemplateLateral = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeetemplateLateral.jsx")
);

const FeetemplateApprovalIndex = lazy(() =>
  import("./containers/indeces/feetemplateMaster/FeetemplateApprovalIndex")
);
const ViewFeetemplateSubAmount = lazy(() =>
  import("./pages/forms/feetemplateMaster/ViewFeetemplateSubAmount")
);
const FeetemplateAttachmentView = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeetemplateAttachmentView")
);
const FeetemplateSubAmountHistory = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeetemplateSubAmountHistory")
);
const FeetemplateApproval = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeetemplateApproval")
);

const FeetemplatePdf = lazy(() =>
  import("./containers/indeces/feetemplateMaster/FeetemplatePdf.jsx")
);

const FeetemplateMultiplePdf = lazy(() =>
  import("./containers/indeces/feetemplateMaster/FeetemplateMultiplePdf.jsx")
);

const AddonFee = lazy(() =>
  import("./pages/forms/feetemplateMaster/AddonFeeForm.jsx")
);

// Account Master
const AccountMaster = lazy(() => import("./pages/masters/AccountMaster"));
const TallyHeadForm = lazy(() =>
  import("./pages/forms/accountMaster/TallyheadForm.jsx")
);
const VoucherForm = lazy(() =>
  import("./pages/forms/accountMaster/VoucherForm")
);
const VoucherAssignmentForm = lazy(() =>
  import("./pages/forms/accountMaster/VoucherAssignmentForm")
);
const GroupForm = lazy(() => import("./pages/forms/accountMaster/GroupForm"));
const LedgerForm = lazy(() => import("./pages/forms/accountMaster/LedgerForm"));
const OpeningBalanceUpdateForm = lazy(() =>
  import("./pages/forms/accountMaster/OpeningBalanceUpdateForm")
);
const JournalVoucherForm = lazy(() =>
  import("./pages/forms/accountMaster/JournalVoucherForm.jsx")
);
const JournalVoucherPdf = lazy(() =>
  import("./pages/forms/accountMaster/GenerateJournalVoucherPdf.jsx")
);
const PaymentVoucherForm = lazy(() =>
  import("./pages/forms/accountMaster/PaymentVoucherForm.jsx")
);

const PaymentVoucherPdf = lazy(() =>
  import("./pages/forms/accountMaster/PaymentVoucherPdf.jsx")
);

const FundTransferPdf = lazy(() =>
  import("./pages/forms/accountMaster/FundTransferPdf.jsx")
);

const ContraVoucherPdf = lazy(() =>
  import("./pages/forms/accountMaster/ContraPdf.jsx")
);

const ContraVoucherPdfAuto = lazy(() =>
  import("./pages/forms/accountMaster/ContraPdfAuto.jsx")
);

const AdvancePaymentVoucherIndex = lazy(() =>
  import("./containers/indeces/accountMaster/AdvancePaymentVoucherIndex.jsx")
);

const AccountVoucherMaster = lazy(() =>
  import("./pages/masters/AccountVoucherMaster.jsx")
);
const JournalVerifierIndex = lazy(() =>
  import("./pages/indeces/JournalVerifierIndex.jsx")
);
const VerifyPaymentVoucherIndex = lazy(() =>
  import("./containers/indeces/accountMaster/VerifyPaymentVoucherIndex.jsx")
);

const PaymentVoucherApprove = lazy(() =>
  import("./containers/indeces/accountMaster/PaymentVoucherApprove.jsx")
);

const PaymentVoucherIndex = lazy(() =>
  import("./containers/indeces/accountMaster/PaymentVoucherIndex.jsx")
);

const SalaryVoucherForm = lazy(() =>
  import("./pages/forms/accountMaster/SalaryVoucherForm.jsx")
);

const ConsultantVoucherForm = lazy(() =>
  import("./pages/forms/accountMaster/ConsultantVoucherForm.jsx")
);

const DraftJournalVoucherIndex = lazy(() =>
  import("./pages/indeces/DraftJournalVoucherIndex.jsx")
);
const JournalVerifyForm = lazy(() =>
  import("./pages/forms/accountMaster/JournalVerifyForm.jsx")
);
const JournalGrnIndex = lazy(() => import("./pages/indeces/JournalGrnIndex"));
const JournalVoucherIndex = lazy(() =>
  import("./pages/indeces/JournalVoucherIndex")
);

const FundTransfer = lazy(() =>
  import("./pages/forms/accountMaster/FundTransfer.jsx")
);

const ContraVoucher = lazy(() =>
  import("./pages/forms/accountMaster/ContraVoucher.jsx")
);

//Bank Master
const BankGroup = lazy(() => import("./pages/forms/bankMaster/BankGroup.jsx"));
const BankForm = lazy(() => import("./pages/forms/bankMaster/BankForm"));
const BankImport = lazy(() => import("./pages/forms/bankMaster/BankImport"));
const BankClearedHistory = lazy(() =>
  import("./containers/indeces/bankMaster/BankImportClearedHistory")
);
const BankIndex = lazy(() =>
  import("./containers/indeces/bankMaster/BankIndex.jsx")
);

const DollartoInrForm = lazy(() =>
  import("./pages/forms/bankMaster/DollartoInrForm.jsx")
);

const DollartoInrIndex = lazy(() =>
  import("./containers/indeces/bankMaster/DollartoInr.jsx")
);

// Category Type Master
const CategoryTypeMaster = lazy(() =>
  import("./pages/masters/CategoryTypeMaster")
);
const CategoryTypeForm = lazy(() =>
  import("./pages/forms/categoryTypeMaster/CategoryTypeForm")
);
const CategoryDetailsForm = lazy(() =>
  import("./pages/forms/categoryTypeMaster/CategoryDetailsForm")
);

// Job Portal
const JobPortalIndex = lazy(() => import("./pages/indeces/JobPortalIndex"));
const InterView = lazy(() => import("./pages/forms/jobPortal/InterView"));
const ResultForm = lazy(() => import("./pages/forms/jobPortal/ResultForm"));
const SalaryBreakupForm = lazy(() =>
  import("./pages/forms/jobPortal/SalaryBreakupForm")
);
const OfferForm = lazy(() => import("./pages/forms/jobPortal/OfferForm"));
const RecruitmentForm = lazy(() =>
  import("./pages/forms/jobPortal/RecruitmentForm")
);
const HodCommentsIndex = lazy(() => import("./pages/indeces/HodCommentsIndex"));
const OfferLetterPrint = lazy(() =>
  import("./pages/forms/jobPortal/OfferLetterPrint")
);
const SalaryBreakupPrint = lazy(() =>
  import("./pages/forms/jobPortal/SalaryBreakupPrint")
);
const OfferAccepted = lazy(() =>
  import("./pages/forms/jobPortal/OfferAccepted")
);

// Desgination Master
const DesignationMaster = lazy(() =>
  import("./pages/masters/DesignationMaster")
);
// Notification Master
const NotificationMaster = lazy(() =>
  import("./pages/masters/NotificationMaster.jsx")
);
const NotificationForm = lazy(() =>
  import("./pages/forms/notificationMaster/NotificationForm.jsx")
);
const DesignationForm = lazy(() =>
  import("./pages/forms/designationMaster/DesignationForm")
);

// Hostel Fee Template Master
const HostelFeeTemplateMaster = lazy(() =>
  import("./pages/masters/HostelFeeTemplateMaster")
);
const HostelFeeTemplateForm = lazy(() =>
  import("./pages/forms/hostelFeeTemplateMaster/HostelFeeTemplateForm")
);

// Salary Master
const SalaryMaster = lazy(() => import("./pages/masters/SalaryMaster"));
const SalaryStructureForm = lazy(() =>
  import("./pages/forms/salaryMaster/SalaryStructureForm")
);
const SalaryStructureHeadForm = lazy(() =>
  import("./pages/forms/salaryMaster/SalaryStructureHeadForm")
);
const SalaryStructureAssignment = lazy(() =>
  import("./pages/forms/salaryMaster/SalaryStructureAssignment")
);
const SlabStructureForm = lazy(() =>
  import("./pages/forms/salaryMaster/SlabStructureForm")
);

// Mentor Master
const ProctorheadForm = lazy(() =>
  import("./pages/forms/mentorMaster/ProctorheadForm")
);

const ProctorHeadIndex = lazy(() =>
  import("./containers/indeces/mentorMaster/ProctorheadIndex.jsx")
);

const ProctorStudentAssignmentForm = lazy(() =>
  import("./pages/forms/mentorMaster/ProctorStudentAssignmentForm")
);
const ProctorStudentAssignmentIndex = lazy(() =>
  import("./containers/indeces/mentorMaster/ProctorStudentAssignmentIndex")
);
const ProctorStudentHistory = lazy(() =>
  import("./containers/indeces/mentorMaster/ProctorStudentHistory.jsx")
);
const ProctorMeeting = lazy(() =>
  import("./pages/forms/mentorMaster/ProctorMeeting.jsx")
);
const ProctorStudentMeeting = lazy(() =>
  import("./pages/forms/mentorMaster/ProctorStudentMeeting.jsx")
);
const ProctorStudentMeetingIndex = lazy(() =>
  import("./containers/indeces/mentorMaster/ProctorStudentMeetingIndex.jsx")
);
const ProctorStudentMaster = lazy(() =>
  import("./pages/masters/ProctorStudentMaster.jsx")
);

const ProctorMasterIndex = lazy(() =>
  import("./containers/indeces/mentorMaster/ProctorMasterIndex.jsx")
);

const ProctorEmployeeMaster = lazy(() =>
  import("./pages/masters/ProctorEmployeeMaster.jsx")
);

const MentorMaster = lazy(() => import("./pages/masters/MentorMaster"));

const MentorMasterSchool = lazy(() =>
  import("./pages/masters/MentorMasterSchool.jsx")
);

const ReportMaster = lazy(() =>
  import("./pages/masters/StudentReportingMaster")
);

// TimeTable Master Forms

const SectionAssignmentForm = lazy(() =>
  import("./pages/forms/sectionMaster/SectionAssignmentForm")
);
const StudentPromote = lazy(() =>
  import("./pages/forms/sectionMaster/StudentPromote")
);
const FacultySectionAssignmentForm = lazy(() =>
  import("./pages/forms/FacultyScreens/FacultySectionAssignmentForm.jsx")
);

const FacultyBatchAssignmentForm = lazy(() =>
  import("./pages/forms/FacultyScreens/FacultyBatchAssignmentForm.jsx")
);

const FacultySubjectAssignmentForm = lazy(() =>
  import("./pages/forms/FacultyScreens/FacultySubjectAssignmentForm.jsx")
);

const BatchAssignmentForm = lazy(() =>
  import("./pages/forms/timeTableMaster/BatchAssignmentForm")
);
const TimetableForSectionForm = lazy(() =>
  import("./pages/forms/timeTableMaster/TimetableForSectionForm")
);
const TimetableForBatchForm = lazy(() =>
  import("./pages/forms/timeTableMaster/TimetableForBatchForm")
);

const FacultyTimetableSectionSchoolWise = lazy(() =>
  import("./pages/forms/timeTableMaster/FacultyTimetableSectionSchoolWise.jsx")
);

const FacultyTimetableBatchSchoolWise = lazy(() =>
  import("./pages/forms/timeTableMaster/FacultyTimetableBatchSchoolWise.jsx")
);

const FacultyTimetableSectionDeptWise = lazy(() =>
  import("./pages/forms/FacultyScreens/FacultyTimetableSectionDept.jsx")
);

const FacultyTimetableBatchDeptWise = lazy(() =>
  import("./pages/forms/FacultyScreens/FacultyTimetableBatchDept.jsx")
);

const FacultytimetableSchoolIndex = lazy(() =>
  import("./containers/indeces/timeTableMaster/FacultytimetableSchoolIndex.jsx")
);

const FacultyTimetableSectionUserwise = lazy(() =>
  import("./pages/forms/timeTableMaster/FacultyTimetableSectionUserwise.jsx")
);

const FacultyTimetableBatchUserwise = lazy(() =>
  import("./pages/forms/timeTableMaster/FacultyTimetableBatchUserwise.jsx")
);

const FacultytimetableUserwiseIndex = lazy(() =>
  import(
    "./containers/indeces/timeTableMaster/FacultytimetableUserwiseIndex.jsx"
  )
);

const CourseAssignmentForm = lazy(() =>
  import("./pages/forms/timeTableMaster/CourseAssignmentForm")
);

const EmployeeCourseAssignment = lazy(() =>
  import("./pages/forms/courseMaster/CoursesAssignmentEmployee.jsx")
);

const EmployeeCourseAssignmentIndex = lazy(() =>
  import("./containers/indeces/courseMaster/EmployeeCourseAssignmentIndex.jsx")
);

const TimeTabeleView = lazy(() =>
  import("./pages/forms/timeTableMaster/TimeTableView")
);
const TimeTableViewDateWise = lazy(() =>
  import("./pages/forms/timeTableMaster/TimeTableViewDateWise")
);
const TimeTableDateWisePDF = lazy(() =>
  import("./pages/forms/timeTableMaster/TimeTableDateWisePDF")
);
const TimeTableViewForCourse = lazy(() =>
  import("./pages/forms/timeTableMaster/TimeTableViewForCourse")
);
const TimeTableViewWeekWise = lazy(() =>
  import("./pages/forms/timeTableMaster/TimeTableViewWeekWise")
);
const TimeTableFacultyViewPDF = lazy(() =>
  import("./pages/forms/timeTableMaster/TimeTableFacultyViewPDF")
);
const TimeTableViewWeekWisePdf = lazy(() =>
  import("./pages/forms/timeTableMaster/TimeTableViewWeekWisePdf")
);

const FeetemplateNew = lazy(() => import("./components/FeetemplateNew.jsx"));

// Employee Master
const EmployeeIndex = lazy(() => import("./pages/indeces/EmployeeIndex"));
const EmployeeUpdateForm = lazy(() =>
  import("./pages/forms/jobPortal/EmployeeUpdateForm")
);
const ContractPaymentHistory = lazy(() =>
  import("./pages/indeces/ContractPaymentHistory")
);
const ConsultantPaySheet = lazy(() =>
  import("./pages/indeces/ConsultantPaySheet")
);

const EmployeeDetailsView = lazy(() =>
  import("./components/EmployeeDetailsView")
);
const EmpAttendanceTrigger = lazy(() =>
  import("./pages/forms/employeeMaster/EmpAttendanceTrigger")
);
const ImportBioTrans = lazy(() =>
  import("./pages/forms/employeeMaster/ImportBioTranse")
);
const EmpAttendanceFilterForm = lazy(() =>
  import("./pages/forms/employeeMaster/EmpAttendanceFilterForm")
);
const EmployeeDetailsMaster = lazy(() =>
  import("./pages/masters/EmployeeDetailsMaster.jsx")
);
const EmpDetailsMaster = lazy(() =>
  import("./pages/masters/EmpDetailsMaster.jsx")
);
const EmployeeSalaryApprovalIndex = lazy(() =>
  import("./pages/indeces/EmployeeSalaryApproverIndex.jsx")
);
const EmployeeDetailsHistory = lazy(() =>
  import("./pages/indeces/EmployeeDetailsHistory.jsx")
);
const EmpResignationForm = lazy(() =>
  import("./pages/forms/employeeMaster/EmpResignationForm")
);
const EmployeeResignationIndex = lazy(() =>
  import("./pages/indeces/EmployeeResignationIndex")
);

//Report Master

const StudentReporting = lazy(() =>
  import("./pages/forms/studentReportingMaster/ReportFormFirst.jsx")
);

const ReportIndex = lazy(() =>
  import("./containers/indeces/studentReportingMaster/ReportingIndex.jsx")
);

const ReportIndexFirst = lazy(() =>
  import("./containers/indeces/studentReportingMaster/ReportIndexFirst.jsx")
);

const StudentEligibleForm = lazy(() =>
  import("./pages/forms/studentReportingMaster/StudentEligibleForm")
);
const StudentEligibleIndex = lazy(() =>
  import("./containers/indeces/studentReportingMaster/StudentEligibleIndex")
);
const StudentPromoteForm = lazy(() =>
  import("./pages/forms/studentReportingMaster/StudentPromoteForm")
);
const StudentPromoteIndex = lazy(() =>
  import("./containers/indeces/studentReportingMaster/StudentPromoteIndex")
);
const StudentHistory = lazy(() =>
  import("./pages/forms/studentReportingMaster/StudentHistory")
);
const StudentHistoryIndex = lazy(() =>
  import("./containers/indeces/studentReportingMaster/StudentHistoryIndex")
);

const StudentDepromote = lazy(() =>
  import("./pages/forms/studentReportingMaster/StudentDepromote.jsx")
);

const StudentDepromoteIndex = lazy(() =>
  import("./containers/indeces/studentReportingMaster/DepromoteIndex.jsx")
);

const EmployeeCalendar = lazy(() => import("./components/employeeCalendar"));

const EmployeeCalenderAdmin = lazy(() =>
  import("./components/EmployeeCalenderAdmin.jsx")
);

const PaySlip = lazy(() => import("./components/payslip.jsx"));
const MasterSalary = lazy(() => import("./components/masterSalary"));
const PayreportPdf = lazy(() => import("./components/payreportPdf.jsx"));
const DeductionMaster = lazy(() => import("./pages/masters/DeductionMaster"));
const TdsForm = lazy(() => import("./pages/forms/employeeMaster/TdsForm"));
const AdvanceDeductionForm = lazy(() =>
  import("./pages/forms/employeeMaster/AdvanceDeductionForm.jsx")
);
const ExtraRemuneration = lazy(() =>
  import("./pages/forms/employeeMaster/ExtraRemuneration")
);
const ExtraRemunerationIndex = lazy(() =>
  import("./pages/indeces/ExtraRemunerationIndex")
);
const EmployeeUserwiseMaster = lazy(() =>
  import("./pages/masters/EmployeeUserwiseMaster")
);
const EmployeeInstwiseMaster = lazy(() =>
  import("./pages/masters/EmployeeInstwiseMaster")
);
const EmployeeProfile = lazy(() => import("./components/EmployeeProfile.jsx"));
const NoduesApproverIndex = lazy(() =>
  import("./pages/indeces/NoduesApproverIndex")
);
const NoduesApproverHistoryIndex = lazy(() =>
  import("./pages/indeces/NoduesApproverHistoryIndex")
);

// Catering Master
const AssignmentDetailsMaster = lazy(() =>
  import("./pages/forms/cateringMaster/AssignmentDetailsMaster")
);
const RefreshmentDetailsMaster = lazy(() =>
  import(
    "./pages/forms/cateringMaster/refreshmentApprover/RefreshmentMasterDetails"
  )
);
const RefreshmentBillingLockedIndex = lazy(() =>
  import(
    "./pages/forms/cateringMaster/refreshmentApprover/RefreshmentBillingLockedIndex.jsx"
  )
);
const RefreshmentTypeForm = lazy(() =>
  import("./pages/forms/cateringMaster/CreateRefreshmentForm")
);
const MessAssignmentForm = lazy(() =>
  import("./pages/forms/cateringMaster/MessAssignmentForm.jsx")
);
const MealAssignmentForm = lazy(() =>
  import("./pages/forms/cateringMaster/MealAssignmentForm")
);
const RefreshmentRequestForm = lazy(() =>
  import(
    "./pages/forms/cateringMaster/refreshmentRequest/RefreshmentRequestForm"
  )
);

// Service Request
const ServiceMaster = lazy(() =>
  import("./pages/forms/myRequest/ServiceMaster")
);
const ServiceTypeForm = lazy(() =>
  import("./pages/forms/myRequest/ServiceTypeForm")
);
const ServiceAssignmentForm = lazy(() =>
  import("./pages/forms/myRequest/ServiceAssignmentForm")
);
const ServiceRequestIndex = lazy(() =>
  import("./pages/forms/myRequest/CreateServiceRequestIndex")
);
const AttendServiceTransportRequest = lazy(() =>
  import("./pages/forms/myRequest/AttendServiceTransportRequest")
);
const AttendServiceTransportRequestHistory = lazy(() =>
  import("./pages/forms/myRequest/AttendServiceTransportRequestHistory")
);
const CreateServiceReqForm = lazy(() =>
  import("./pages/forms/myRequest/CreateServiceRequest")
);
const AttendServiceRequest = lazy(() =>
  import("./pages/forms/myRequest/AttendServiceRequest")
);
const AttendServiceRendorIndex = lazy(() =>
  import("./pages/forms/myRequest/AttendServiceRequestRendorIndex")
);

const ServiceRequestDept = lazy(() =>
  import("./pages/forms/myRequest/ServiceRequestDept.jsx")
);

const ServiceRequestDeptWise = lazy(() =>
  import("./pages/forms/myRequest/ServiceRequestDeptWise.jsx")
);
const ServiceRequestEventWise = lazy(() =>
  import("./pages/forms/myRequest/ServiceRequestEventWise.jsx")
);
const ServiceRequestForm = lazy(() =>
  import("./pages/forms/myRequest/ServiceReqestForm.jsx")
);

const ServiceRequestTransport = lazy(() =>
  import("./pages/forms/myRequest/ServiceRequestTransport.jsx")
);

const ServiceRequestTransportForm = lazy(() =>
  import("./pages/forms/myRequest/ServiceRequestTransportForm.jsx")
);

const ServiceTransportView = lazy(() =>
  import("./pages/forms/myRequest/ServiceTransportView.jsx")
);

// Store Indent
const StoreIndentApproverIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/StoreIndentApproverIndex.jsx")
);

const IndentHistory = lazy(() =>
  import("./containers/indeces/inventoryMaster/IndentHistory.jsx")
);

const StoreIndentHistoryUser = lazy(() =>
  import("./containers/indeces/inventoryMaster/StoreIndentHistoryUser.jsx")
);

const StoreIndent = lazy(() =>
  import("./pages/forms/inventoryMaster/StoreIndent.jsx")
);
const StoreIndentIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/StoreIndentIndex.jsx")
);

const Pojspdf = lazy(() => import("./pages/forms/inventoryMaster/Pojspdf.jsx"));

const StockIssuePdf = lazy(() =>
  import("./pages/forms/inventoryMaster/StockIssuePdf.jsx")
);

const PurchaseIndent = lazy(() =>
  import("./pages/forms/inventoryMaster/PurchaseIndent.jsx")
);

const PurchaseIndentIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/PurchaseIndentIndex.jsx")
);

const PurchaseIndentApprovalIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/PurchaseIndentApprovalIndex.jsx")
);

const PurchaseIndentIndexUserwise = lazy(() =>
  import("./containers/indeces/inventoryMaster/PurchaseIndentIndexUserwise.jsx")
);

const PurchaseIndentHistory = lazy(() =>
  import("./containers/indeces/inventoryMaster/PurchaseIndentHistory.jsx")
);

// Leave Master
const LeaveMaster = lazy(() => import("./pages/masters/LeaveMaster"));
const LeaveTypeForm = lazy(() =>
  import("./pages/forms/leaveMaster/LeaveTypeForm")
);
const LeavePatternForm = lazy(() =>
  import("./pages/forms/leavePatternMaster/LeavePatternForm")
);
const LeaveApplyForm = lazy(() =>
  import("./pages/forms/leaveMaster/LeaveApplyForm")
);
const LeaveApplyIndex = lazy(() =>
  import("./containers/indeces/leaveMaster/LeaveApplyIndex")
);
const InitialLeave = lazy(() =>
  import("./pages/forms/leaveMaster/LeaveApplyAdminForm")
);
const LeaveApproverIndex = lazy(() =>
  import("./containers/indeces/leaveMaster/LeaveApproverIndex")
);
const LeaveApprovedHistoryIndex = lazy(() =>
  import("./containers/indeces/leaveMaster/LeaveApprovedHistoryIndex")
);
const LeaveApplyAdminIndex = lazy(() =>
  import("./containers/indeces/leaveMaster/LeaveApplyAdminIndex")
);
const DeatilsByLeaveType = lazy(() =>
  import("./containers/indeces/leaveMaster/DetailsByLeaveType.jsx")
);
const InitiateLeaveAdmin = lazy(() =>
  import("./pages/forms/leaveMaster/LeaveApplyHodForm")
);

const LeaveDetailsFilter = lazy(() =>
  import("./pages/forms/leavePatternMaster/LeaveDetailsFilter.jsx")
);

const LeaveDetailsById = lazy(() =>
  import("./containers/indeces/leaveMaster/LeaveDetailsById.jsx")
);

// Infrastructure Master
const InfrastructureMaster = lazy(() =>
  import("./pages/masters/InfrastructureMaster")
);
const FacilityForm = lazy(() =>
  import("./pages/forms/infrastructureMaster/FacilityForm")
);
const BlockForm = lazy(() =>
  import("./pages/forms/infrastructureMaster/BlockForm")
);
const RoomForm = lazy(() =>
  import("./pages/forms/infrastructureMaster/RoomForm")
);
const DocumentsRepo = lazy(() =>
  import("./pages/forms/documentrepo/index.jsx")
);
const DocumentsRepoUser = lazy(() =>
  import("./pages/forms/documentrepoUser/index.jsx")
);
const InwardSubmission = lazy(() =>
  import("./pages/forms/documentrepo/inwardsubmission.jsx")
);
const InwardSubmissionUser = lazy(() =>
  import("./pages/forms/documentrepoUser/inwardsubmission.jsx")
);
const DocumentList = lazy(() =>
  import("./pages/forms/documentrepo/documentsList")
);
const CustomTemplate = lazy(() =>
  import("./pages/forms/documentrepo/custom-template.jsx")
);
const CustomTemplateUser = lazy(() =>
  import("./pages/forms/documentrepoUser/custom-template.jsx")
);

// Holiday Calendar Master
const HolidayCalenderMaster = lazy(() =>
  import("./pages/masters/HolidayCalenderMaster")
);
const HolidayCalenderForm = lazy(() =>
  import("./pages/forms/holidayCalenderMaster/HolidayCalenderForm")
);
const DeAssignDepartment = lazy(() =>
  import("./pages/forms/holidayCalenderMaster/DeAssignDepartment")
);

// Section Master
const SectionMaster = lazy(() => import("./pages/masters/SectionMaster"));
const SectionForm = lazy(() =>
  import("./pages/forms/sectionMaster/SectionForm")
);
const BatchForm = lazy(() => import("./pages/forms/sectionMaster/BatchForm"));
const TimeIntervalTypesForm = lazy(() =>
  import("./pages/forms/sectionMaster/TimeIntervalTypesForm")
);
const InternalCreationForm = lazy(() =>
  import("./pages/forms/academicMaster/InternalCreationForm")
);
const TimeSlotsForm = lazy(() =>
  import("./pages/forms/sectionMaster/TimeSlotsForm")
);

//  Research Profile
const ResearchProfileIndex = lazy(() =>
  import("./pages/indeces/ResearchProfileIndex.jsx")
);
const ResearchProfileForm = lazy(() =>
  import("./pages/forms/employeeMaster/ResearchProfileForm.jsx")
);

const ResearchProfileAttachmentView = lazy(() =>
  import("./pages/indeces/ResearchProfileAttachmentView.jsx")
);

const ResearchProfileReport = lazy(() =>
  import("./pages/indeces/ResearchProfileReport.jsx")
);

// Transcript Master
const TranscriptMaster = lazy(() => import("./pages/masters/TranscriptMaster"));
const StudentTranscriptMaster = lazy(() =>
  import("./pages/masters/StudentTranscriptMaster")
);
const TranscriptForm = lazy(() =>
  import("./pages/forms/transcriptMaster/TranscriptForm")
);
const TranscriptAssignmentForm = lazy(() =>
  import("./pages/forms/transcriptMaster/TranscriptAssignmentForm")
);
const UniversityForm = lazy(() =>
  import("./pages/forms/transcriptMaster/UniversityForm")
);
const StudentTranscriptForm = lazy(() =>
  import("./pages/forms/studentTranscriptsMaster/StudentTranscriptForm")
);
const DocumentCollectionForm = lazy(() =>
  import("./pages/forms/studentDetailMaster/DocumentCollectionForm")
);

const StudentDocumentCollectionPdf = lazy(() =>
  import("./components/StudentDocumentCollectionPdf")
);
const StudentTranscriptApplication = lazy(() =>
  import("./components/StudentTranscriptApplication")
);
const ChangeOfCourseIndex = lazy(() =>
  import("./containers/indeces/studentMaster/ChangeOfCourseIndex")
);
const ChangeOfCourseAttachment = lazy(() =>
  import("./pages/forms/inventoryMaster/ChangeOfCourseAttachment")
);
const ApproveChangeofcourse = lazy(() =>
  import("./pages/forms/studentMaster/ApproveChangeofcourse.jsx")
);

//Voucher Master
const VoucherMaster = lazy(() => import("./pages/masters/VoucherMaster.jsx"));

const AdvanceVoucherMaster = lazy(() =>
  import("./pages/masters/AdvanceVoucherMaster.jsx")
);

const JournalMaster = lazy(() => import("./pages/masters/JournalMaster.jsx"));

// Make Employee Permanent - Employee Index
const EmployeePermanentAttachmentView = lazy(() =>
  import("./components/EmployeePermanentAttachmentView.jsx")
);

//  ID Card
const IDCardPrint = lazy(() => import("./pages/indeces/IDCardPrint.jsx"));
const StudentIdCard = lazy(() =>
  import("./pages/indeces/StudentIdCardIndex.jsx")
);
const HostelStudentIdCard = lazy(() =>
  import("./pages/indeces/HostelStudentIdCardIndex.jsx")
);
const PhotoIdCard = lazy(() => import("./pages/indeces/PhotoIdCard.jsx"));
const StaffIdCard = lazy(() => import("./pages/indeces/StaffIdCardIndex.jsx"));
const ViewStaffIdCard = lazy(() =>
  import("./containers/indeces/StaffIdCard/ViewStaffIDCard.jsx")
);
const ViewStudentIdCard = lazy(() =>
  import("./containers/indeces/StudentIdCard/ViewStudentIDCard.jsx")
);
const ViewHostelStudentIdCard = lazy(() =>
  import("./containers/indeces/HostelStudentIdCard/ViewHostelStudentIDCard.jsx")
);
// Student Master
const SpotAdmissionForm = lazy(() =>
  import("./pages/forms/studentDetailMaster/SpotAdmissionForm")
);
const StudentDetailsIndex = lazy(() =>
  import("./containers/indeces/studentDetailMaster/StudentDetailsIndex")
);
const InactiveStudentsIndex = lazy(() =>
  import("./containers/indeces/studentDetailMaster/InactiveStudentIndex")
);
const ReadmissionForm = lazy(() =>
  import("./pages/forms/studentMaster/ReadmissionForm")
);
const ChangeOfCourse = lazy(() =>
  import("./pages/forms/studentMaster/ChangeOfCourse")
);
const CancelAdmissionForm = lazy(() =>
  import("./pages/forms/studentMaster/CancelAdmissionForm")
);
const ApproveCancelAdmissionIndex = lazy(() =>
  import("./containers/indeces/studentMaster/ApproveCancelAdmissionIndex")
);
const ApproveCancelAdmission = lazy(() =>
  import("./pages/forms/studentMaster/ApproveCancelAdmission")
);
const CancelAdmissionHistoryIndex = lazy(() =>
  import("./containers/indeces/studentMaster/CancelAdmissionHistoryIndex")
);
const CancelAdmissionView = lazy(() =>
  import("./pages/forms/studentMaster/CancelAdmissionView")
);
const StudentDetailsView = lazy(() =>
  import("./components/StudentDetailsView.jsx")
);
const StudentDetailsUpdate = lazy(() =>
  import("./pages/forms/studentMaster/StudentDetailsUpdate.jsx")
);
const StudentLedger = lazy(() =>
  import("./pages/forms/studentMaster/StudentLedger.jsx")
);
const StudentNodueForm = lazy(() =>
  import("./pages/forms/studentMaster/StudentNodueForm.jsx")
);
const LessonplanForm = lazy(() =>
  import("./pages/forms/studentMaster/LessonplanForm")
);
const Referencebookform = lazy(() =>
  import("./pages/forms/studentMaster/ReferencebookForm")
);
const LessonplanIndex = lazy(() =>
  import("./containers/indeces/studentMaster/LessonplanIndex")
);

const AdminLessonplanIndex = lazy(() =>
  import("./containers/indeces/studentMaster/AdminLessonplanIndex.jsx")
);

const ReferencebookIndex = lazy(() =>
  import("./containers/indeces/studentMaster/ReferencebookIndex")
);

const ReceivedAmount = lazy(() =>
  import("./pages/forms/admissionMaster/ReceivedAmount.jsx")
);

const PaidAtBoardTag = lazy(() =>
  import("./pages/forms/studentMaster/PaidAtBoardTag.jsx")
);

const PaidAtBoardIndex = lazy(() =>
  import("./containers/indeces/studentMaster/PaidAtBoardIndex.jsx")
);

const PaidAtBoardStdList = lazy(() =>
  import("./containers/indeces/studentMaster/PaidAtBoardStdList.jsx")
);

const PaidAtBoardReceipt = lazy(() =>
  import("./containers/indeces/studentMaster/PaidAtBoardReceipt.jsx")
);

const PaidAtBoardReport = lazy(() =>
  import("./pages/forms/studentMaster/PaidAtBoardReport.jsx")
);

const PaidAtBoardSchoolWise = lazy(() =>
  import("./pages/forms/studentMaster/PaidAtBoardSchoolWise.jsx")
);

const PaidAtBoardAcYearWise = lazy(() =>
  import("./pages/forms/studentMaster/PaidAtBoardAcYearWise.jsx")
);

const PaidAtBoardStdWise = lazy(() =>
  import("./pages/forms/studentMaster/PaidAtBoardStdList.jsx")
);

const StudentMarksMaster = lazy(() =>
  import("./pages/forms/studentMaster/StudentMarksMasterIndex")
);

const FeePaymentWindow = lazy(() =>
  import("./pages/forms/studentMaster/FeePaymentWindow.jsx")
);

const FeePaymentWindowIndex = lazy(() =>
  import("./containers/indeces/studentMaster/FeePaymentWindowIndex.jsx")
);
const FeePaymentWindowIndexUser = lazy(() =>
  import("./containers/indeces/studentMaster/FeePaymentWindowIndexUser.jsx")
);

const ExternalPaymentForm = lazy(() =>
  import("./pages/forms/candidateWalkin/ExternalPaymentForm")
);
const ExternalPaymentSuccessPrint = lazy(() =>
  import("./pages/forms/candidateWalkin/ExternalPaymentSuccessPrint")
);
const ExternalPaymentReport = lazy(() =>
  import("./pages/forms/candidateWalkin/ExternalPaymentReport")
);
const RegistrationDetails = lazy(() =>
  import("./pages/forms/studentMaster/RegistrationDetails")
);
const StudentAttendanceSummary = lazy(() =>
  import("./pages/forms/studentMaster/StudentAttendanceSummary")
);
const StudentCoursewiseAttendance = lazy(() =>
  import("./pages/forms/studentMaster/StudentCoursewiseAttendance")
);
const DetailedAttendancefilter = lazy(() =>
  import("./pages/forms/studentMaster/DetailedAttendancefilter")
);

const StudentOverallAttendance = lazy(() =>
  import("./pages/forms/studentMaster/StudentOverallAttendence.jsx")
);

const FacultyDetails = lazy(() => import("./pages/masters/FacultyDetails.jsx"));

const FacultyDetailsAttendaceReport = lazy(() =>
  import("./pages/masters/FacultyDetailsAttendanceReportView.jsx")
);

const InternaltimeTable = lazy(() =>
  import("./pages/masters/InternalTimeTable.jsx")
);

const InternaltimeTableAttendaceReport = lazy(() =>
  import("./pages/masters/InternalTimeTableAttendanceReport.jsx")
);

const StudentDetailsByBatch = lazy(() =>
  import("./pages/masters/StudentDetailsByBatch.jsx")
);

const StudentAttendace = lazy(() =>
  import("./pages/forms/studentMaster/StudentAttendace.jsx")
);

const StudentAttendenceSchool = lazy(() =>
  import("./pages/forms/studentMaster/StudentAttendenceSchool.jsx")
);

const StudentAttendenceDept = lazy(() =>
  import("./pages/forms/studentMaster/StudentAttendenceDept.jsx")
);

const StudentAttendaceReport = lazy(() =>
  import("./pages/indeces/StudentAttendaceReport")
);

//Student Intake

const StudentIntakeMaster = lazy(() =>
  import("./pages/masters/StudentIntakeMaster")
);

const StudentIntakeForm = lazy(() =>
  import("./pages/forms/studentIntake/StudentIntakeForm")
);
const StudentIntakeSelection = lazy(() =>
  import("./pages/forms/studentIntake/StudentIntakeSelectionForm")
);
const StudentIntakeSummary = lazy(() =>
  import("./pages/forms/studentIntake/StudentIntakeSummary")
);
// Student NoDue
const StudentNoDue = lazy(() => import("./pages/indeces/StudentNoDue"));
const StudentNoDueDetails = lazy(() =>
  import("./pages/forms/studentMaster/StudentNoDueDetails")
);

//Frro Master
const FrroMaster = lazy(() => import("./pages/masters/FrroMaster.jsx"));

const FrroBonafied = lazy(() =>
  import("./pages/forms/studentBonafide/FRROBonafied.jsx")
);

// Salary Lock
const SalaryLockForm = lazy(() =>
  import("./pages/forms/employeeMaster/SalaryLockForm")
);
const SalaryIncrementInitIndex = lazy(() =>
  import("./pages/indeces/SalaryIncrementInitiation.jsx")
);

const SalaryBudgetCreate = lazy(() =>
  import("./pages/forms/salaryIncrement/SalaryBudgetCreate.jsx")
);

const BudgetIncrementIndex = lazy(() =>
  import("./pages/forms/salaryIncrement/BudgetIncrementIndex.jsx")
);

const BudgetCreateCsv = lazy(() =>
  import("./pages/indeces/BudgetCreateCsv.jsx")
);

const IncrementIndex = lazy(() => import("./pages/indeces/IncrementIndex.jsx"));

const IncrementFinalizedList = lazy(() =>
  import("./pages/indeces/IncrementFinalizedList.jsx")
);
const IncrementApproveList = lazy(() =>
  import("./pages/indeces/IncrementApproveList.jsx")
);

const FeeReceipt = lazy(() => import("./pages/forms/studentMaster/FeeReceipt"));

const NiniskillupForm = lazy(() =>
  import("./pages/forms/studentMaster/NiniskillupForm.jsx")
);

const NiniskillupPdf = lazy(() =>
  import("./pages/forms/studentMaster/NiniskillupPdf.jsx")
);

const NiniskillPdf = lazy(() =>
  import("./pages/forms/studentMaster/NiniskillPdf.jsx")
);

const UniformAndStationaryFeeReceipt = lazy(() =>
  import("./pages/forms/studentMaster/UniformAndStationaryFeeReceipt.jsx")
);

const UniformAndStationaryReceiptPdf = lazy(() =>
  import("./pages/forms/studentMaster/UniformAndStationaryReceiptPdf.jsx")
);

const UniformReceiptPdf = lazy(() =>
  import("./pages/forms/studentMaster/UniformReceiptPdf.jsx")
);

const StudentFeeReceipt = lazy(() =>
  import("./pages/forms/studentMaster/StudentFeeReceipt")
);
const StudentReceipt = lazy(() =>
  import("./pages/forms/studentMaster/StudentReceipt.jsx")
);
const FeeReceiptDetails = lazy(() =>
  import("./pages/forms/studentMaster/FeeReceiptDetails")
);
const StudentFeeReceiptDetailsPDF = lazy(() =>
  import("./pages/forms/studentMaster/StudentFeeReceiptPDF.jsx")
);
const FeeReceiptDetailsPDF = lazy(() =>
  import("./pages/forms/studentMaster/FeeReceiptDetailsPDF")
);
const FeeReceiptDetailsPDFNew = lazy(() =>
  import("./pages/forms/studentMaster/FeeReceiptDetailsPDFV1")
);
const FeeReceiptIndex = lazy(() =>
  import("./containers/indeces/studentMaster/StudentFeereceiptIndex")
);
const FeeReceiptReportIndex = lazy(() =>
  import("./containers/indeces/studentMaster/StudentFeereceiptReportIndex")
);
const StudentRefund = lazy(() =>
  import("./pages/forms/studentMaster/StudentRefund.jsx")
);

const StudentRefundIndex = lazy(() =>
  import("./containers/indeces/studentMaster/StudentRefundIndex.jsx")
);

const StudentRefundPdf = lazy(() =>
  import("./pages/forms/studentMaster/StudentRefundPdf.jsx")
);

const DailyCounterSummaryIndex = lazy(() =>
  import("./containers/indeces/studentMaster/DailyCounterSummaryIndex")
);
const BulkFeeReceipt = lazy(() =>
  import("./pages/forms/studentMaster/BulkFeeReceipt")
);
const BulkFeeReceiptView = lazy(() =>
  import("./pages/forms/studentMaster/BulkFeeReceiptView")
);
const BulkFeeReceiptPdf = lazy(() =>
  import("./pages/forms/studentMaster/BulkFeeReceiptPdf")
);
const BulkFeeReceiptPdfNew = lazy(() =>
  import("./pages/forms/studentMaster/BulkFeeReceiptPdfV1")
);

const ExamReceiptPdf = lazy(() =>
  import("./pages/forms/studentMaster/ExamReceiptPdf.jsx")
);

const ExamReceiptPdfNew = lazy(() =>
  import("./pages/forms/studentMaster/ExamReceiptPdfV1.jsx")
);

const HostelFeeReceipt = lazy(() =>
  import("./pages/forms/studentMaster/HostelFeeReceipt.jsx")
);

const HostelFeeReceiptBulk = lazy(() =>
  import("./pages/forms/studentMaster/HostelFeeReceiptBulk.jsx")
);

const HostelBulkFeeReceiptV1 = lazy(() =>
  import("./pages/forms/studentMaster/HostelBulkFeeReceiptV1.jsx")
);

const ExamFeeReceipt = lazy(() =>
  import("./pages/forms/studentMaster/ExamFeeReceipt.jsx")
);

const BulkFeeReceiptForm = lazy(() =>
  import("./pages/forms/studentMaster/BulkFeeReceiptForm")
);

const HostelFeePdf = lazy(() =>
  import("./pages/forms/studentMaster/HostelFeePdf.jsx")
);
const HostelFeePdfNew = lazy(() =>
  import("./pages/forms/studentMaster/HostelFeePdfV1.jsx")
);

const HostelFeeBulkPdf = lazy(() =>
  import("./pages/forms/studentMaster/HostelFeeBulkPdf")
);

const CancelFeeReceipt = lazy(() =>
  import("./pages/forms/studentMaster/CancelFeeReceipt")
);

const CancelFeeReceiptIndex = lazy(() =>
  import("./containers/indeces/studentMaster/CancelReceiptIndex.jsx")
);

const CancelHostelReceipt = lazy(() =>
  import("./pages/forms/studentMaster/CancelHostelReceipt.jsx")
);

const HostelFeeTemplate = lazy(() =>
  import("./pages/indeces/HostelFeeTemplate")
);

const StudentOnlineClass = lazy(() =>
  import("./pages/forms/academicMaster/StudentOnlineClass")
);

const LedgerDayWiseTransactionDetail = lazy(() =>
  import("./containers/indeces/vendorMaster/LedgerDebitReceiptTransaction.jsx")
);

const LedgerDayTransaction = lazy(() =>
  import("./containers/indeces/vendorMaster/LedgerDayTransaction.jsx")
);

const VendorMonthlyDetails = lazy(() =>
  import("./containers/indeces/vendorMaster/vendorMonthlyDetails.jsx")
)
const LedgerMonthlyInstTransaction = lazy(() =>
  import("./containers/indeces/vendorMaster/LedgerMonthlyInstituteTransaction.jsx")
)
const InflowDayCreditTransaction = lazy(()=>
  import("./containers/indeces/vendorMaster/LedgerInflowDayTransaction-credit.jsx")
)
const ExpensesDayCreditTransaction = lazy(()=>
  import("./containers/indeces/vendorMaster/AssetsAndExpenditurePaymentVoucher.jsx")
)

const AssetsAndExpenditureCreditDayTransaction = lazy(()=>
  import("./containers/indeces/vendorMaster/AssetsAndExpenditureDayTransaction-credit.jsx")
)

const AssetsAndExpenditureDebitDayTransaction = lazy(()=>
  import("./containers/indeces/vendorMaster/AssetsAndExpenditureDaytransaction-debit.jsx")
)

const VendorDetailMaster = lazy(() =>
  import("./pages/masters/VendorHeadMaster.jsx")
);

//  Vacation Leave
const VacationLeaveIndex = lazy(() =>
  import("./containers/indeces/vacationLeaveMaster/VacationLeaveIndex.jsx")
);

const VacationLeaveForm = lazy(() =>
  import("./pages/forms/vacationLeave/VacationLeaveForm.jsx")
);

//  ACERP Fee Template
const AcerpAmountIndex = lazy(() =>
  import("./pages/indeces/PaidACERPAmountIndex.jsx")
);

const AcerpAmountForm = lazy(() =>
  import("./pages/forms/paidAcerpAmount/PaidAcerpAmountForm.jsx")
);

// Third Force Fee
const ThirdForceFeeForm = lazy(() =>
  import("./pages/forms/thirdForceFee/ThirdForceFeeForm.jsx")
);

const ThirdForceFeeIndex = lazy(() =>
  import("./containers/indeces/thirdForceFee/ThirdForceFeeIndex.jsx")
);

// Hostel Waiver
const HostelWaiverForm = lazy(() =>
  import("./pages/forms/hostelWaiverMaster/HostelWaiverForm.jsx")
);
const HostelWaiverIndex = lazy(() =>
  import("./containers/indeces/hostelWaiverMaster/HostelWaiverIndex.jsx")
);

//Bonafide
const AcerpBonafideForm = lazy(() =>
  import("./pages/forms/studentBonafide/BonafideForm.jsx")
);
const AcerpBonafideIndex = lazy(() =>
  import("./containers/indeces/studentBonafide/studentBonafideIndex.jsx")
);
const ViewBonafide = lazy(() =>
  import("./pages/forms/studentBonafide/ViewBonafide.jsx")
);

// Permission
const PermissionForm = lazy(() =>
  import("./pages/forms/studentPermissionMaster/StudentPermissionForm.jsx")
);

const PermissionFormPartFee = lazy(() =>
  import("./pages/forms/studentPermissionMaster/StudentPermissionPartFee.jsx")
);

const PermissionIndex = lazy(() =>
  import("./containers/indeces/studentPermission/Index.jsx")
);

const PermissionIndexPartFee = lazy(() =>
  import(
    "./containers/indeces//studentPermission/StudentPermissionIndexUser.jsx"
  )
);

//budget
const BudgetFilter = lazy(() =>
  import("./pages/forms/budgetMaster/FinancialyearBudgetFilter.jsx")
);
const BudgetForm = lazy(() =>
  import("./pages/forms/budgetMaster/FinancialyearBudgetForm.jsx")
);
const BudgetIndex = lazy(() =>
  import("./containers/indeces/financialYearBudget/BudgetIndex.jsx")
);

//External Exam Marks
const ExternalExamMarkForm = lazy(() =>
  import("./pages/forms/ExternalExamMarks/ExternalExamMarkForm.jsx")
);
const ExamIndex = lazy(() =>
  import("./containers/indeces/ExternalExamMarks/ExamIndex.jsx")
);
const ExternalExamAddMark = lazy(() =>
  import("./containers/indeces/ExternalExamMarks/ExternalExamAddMark.jsx")
);

//Fine Slab
const FineSlabForm = lazy(() =>
  import("./pages/forms/fineSlabMaster/FineSlabForm.jsx")
);
const FineSlabIndex = lazy(() =>
  import("./containers/indeces/fineSlabMaster/FineSlabIndex.jsx")
);

const IncentiveApplication = lazy(() =>
  import("./pages/indeces/IncentiveApplication.jsx")
);
const IncentiveApplicationAll = lazy(() =>
  import("./pages/indeces/IncentiveApplicationAll.jsx")
);

const AddonReport = lazy(() => import("./pages/indeces/AddonReportAll.jsx"));

const StudentDueReport = lazy(() => import("./pages/forms/studentDueReport"));

const StudentDueReportDetail = lazy(() =>
  import(
    "./containers/indeces/studentDueReportDetail/studentDueReportDetailIndex.jsx"
  )
);

const StudentDueReportForProgramme = lazy(() =>
  import(
    "./containers/indeces/studentDueReportDetail/studentDueReportDetail-programme.jsx"
  )
);

const DirectDemandIndex = lazy(() =>
  import("./pages/indeces/DirectDemandIndex.jsx")
);

const DirectPaymentIndex = lazy(() =>
  import("./pages/indeces/DirectPayment.jsx")
);

const DirectPayDemandForm = lazy(() =>
  import("./pages/forms/directPayDemand/DirectPayDemandForm.jsx")
);
const DirectPayDemandUserIndex = lazy(() =>
  import("./pages/indeces/directPayDemand/DirectPayDemandUserIndex.jsx")
);

//Student Daily Counter Summary
const CounterSummaryIndex = lazy(() =>
  import("./containers/indeces/counterSummary/Index.jsx")
);

const LedgerDebitDayTransaction = lazy(() =>
  import("./containers/indeces/vendorMaster/LedgerDayTransaction-debit.jsx")
);
const LedgerDayCreditTransaction = lazy(() =>
  import("./containers/indeces/vendorMaster/LedgerDayTransaction-credit.jsx")
);
const VendorDayDebitTransaction = lazy(() =>
  import("./containers/indeces/vendorMaster/vendorDayTransaction-debit.jsx")
);
const VendorDayCreditTransaction = lazy(() =>
  import("./containers/indeces/vendorMaster/vendorDayTransaction-credit.jsx")
);
const BankGroupBankBalanceMaster = lazy(() =>
  import("./pages/masters/BankGroupBankBalanceMaster.jsx")
);
const PettyCashPayment = lazy(() =>
  import("./pages/indeces/PettyCashPayment.jsx")
);
const PettyCashPaymentForm = lazy(() =>
  import("./pages/forms/pettyCashPaymentMaster/PettyCashPaymentForm.jsx")
);
const DDDetailReport = lazy(() =>
  import("./pages/indeces/DDDetailsReport.jsx")
);
const SalaryMisIndex = lazy(() => import("./pages/indeces/SalaryMisIndex.jsx"));
const ServiceIndentReport = lazy(() =>
  import("./pages/indeces/ServiceIndentReport.jsx")
);
const ServiceIndentTransportReport = lazy(() =>
  import("./pages/indeces/ServiceIndentTransportReport.jsx")
);
const SalaryReport = lazy(() => import("./pages/indeces/SalaryReport.jsx"));

const LaptopIssueIndex = lazy(() =>
  import("./containers/indeces/laptopIssue/Index.jsx")
);
const LaptopIssueForm = lazy(() =>
  import("./containers/indeces/laptopIssue/LaptopIssueForm.jsx")
);

const SendWhatsApp = lazy(() => import("./pages/indeces/SendWhatsApp.jsx"));

const EmployeeReport = lazy(() => import("./pages/indeces/EmployeeReport.jsx"));

const EmployeeReportView = lazy(() =>
  import("./pages/indeces/EmployeeReportView.jsx")
);

const Health = lazy(() => import("./pages/Health.jsx"));
const SalarySheetMaster = lazy(() =>
  import("./pages/indeces/SalarySheetMaster.jsx")
);

// LMS
const LMS = lazy(() => import("./pages/indeces/LMS.jsx"));

const RazorPaySettlementMaster = lazy(() =>
  import("./pages/masters/RozarpaySettlementMaster.jsx")
);
const RazorPaySettlementDetail = lazy(() =>
  import(
    "./containers/indeces/razorpaySettlementMaster/razorpaySettlementdetails.jsx"
  )
);
const RazorPayReceiptDetail = lazy(() =>
  import(
    "./containers/indeces/razorpaySettlementMaster/razorpayReceiptDetails.jsx"
  )
);

function RouteConfig() {
  const token = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.token;

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            token ? (
              <Navigate replace to="/Dashboard" />
            ) : (
              <Navigate replace to="/Login" />
            )
          }
        />

        <Route
          element={
            <Suspense fallback={<OverlayLoader />}>
              <NavigationLayout />
            </Suspense>
          }
        >
          <Route
            exact
            path="/Dashboard"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SchedulerMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/employee-dashboard"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpDashboard />
              </Suspense>
            }
          />
          <Route
            exact
            path="/hod-dashboard"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HodDashboard />
              </Suspense>
            }
          />
          <Route
            exact
            path="/principal-dashboard"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PrincipalDashboard />
              </Suspense>
            }
          />
          <Route
            exact
            path="/employee-detail"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HodEmployeeDetail />
              </Suspense>
            }
          />
          <Route
            exact
            path="/payment-gateway-transactions"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaymentGatewayTransaction />
              </Suspense>
            }
          />
          {/* Notification Master  */}
          <Route
            exact
            path="/NotificationMaster"
            element={<Navigate replace to="/NotificationMaster/Notification" />}
          />
          {["NotificationMaster/Notification"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <NotificationMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/NotificationMaster/Notification/user"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <NotificationMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NotificationMaster/Notification/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <NotificationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NotificationMaster/Notification/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <NotificationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FormExample"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FormExample />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/charts-dashboard"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ChartsDashboard />
              </Suspense>
            }
          />
          {[
            { path: "/charts-dashboard/hrm", comp: <HRMPage /> },
            { path: "/charts-dashboard/finance", comp: <FinancePage /> },
            { path: "/charts-dashboard/admission", comp: <AdmissionPage /> },
          ].map((obj) => (
            <Route
              exact
              key={obj.path}
              path={obj.path}
              element={
                <Suspense fallback={<OverlayLoader />}>{obj.comp}</Suspense>
              }
            />
          ))}
          <Route
            exact
            path={"/intl/frro"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FRRO />
              </Suspense>
            }
          />
          {[
            { path: "/intl/frro/create", comp: <FRROCreate /> },
            {
              path: "/intl/frro/update/:id/:student_auid",
              comp: <FRROUpdate />,
            },
          ].map((obj) => (
            <Route
              exact
              key={obj.path}
              path={obj.path}
              element={
                <Suspense fallback={<OverlayLoader />}>{obj.comp}</Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/student-due-report"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDueReport />
              </Suspense>
            }
          />
          <Route
            exact
            path="/student-due-report-inst"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDueReport />
              </Suspense>
            }
          />
          <Route
            exact
            path="/student-due-report-detail"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDueReportDetail />
              </Suspense>
            }
          />
          <Route
            exact
            path="/student-due-report-detail/programme"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDueReportForProgramme />
              </Suspense>
            }
          />
          <Route
            exact
            path="/new-admissions-due-report"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <NewAdmissionsDueReport />
              </Suspense>
            }
          />
          <Route
            exact
            path="/new-admissions-due-report-inst"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <NewAdmissionsDueReport />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ChangePassword"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ChangePassword />
              </Suspense>
            }
          />
          <Route
            exact
            path="/student-search"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDetailsSearch />
              </Suspense>
            }
          />
          {/* Navigation Master  */}
          <Route
            exact
            path={"/NavigationMaster"}
            element={<Navigate replace to="/NavigationMaster/Module" />}
          />
          {[
            "/NavigationMaster/Module",
            "/NavigationMaster/Menu",
            "/NavigationMaster/Submenu",
            "/NavigationMaster/Role",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <NavigationMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/NavigationMaster/Module/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ModuleForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Module/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ModuleForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Menu/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MenuForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Menu/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MenuForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Submenu/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SubmenuForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Submenu/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SubmenuForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Role/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RoleForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Role/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RoleForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/document-repo"
            element={<Navigate replace to="/document-repo-outward" />}
          />
          {["/document-repo-outward", "/document-repo-inward"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <DocumentsRepo />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/document-repo-inward-create"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InwardSubmission />
              </Suspense>
            }
          />
          <Route
            exact
            path="/documentsrepo/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DocumentList />
              </Suspense>
            }
          />
          <Route
            exact
            path="/documentsrepo/custom-template"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CustomTemplate />
              </Suspense>
            }
          />
          <Route
            exact
            path="/document-repo-user"
            element={<Navigate replace to="/document-repo-user-outward" />}
          />
          {["/document-repo-user-outward", "/document-repo-user-inward"].map(
            (path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <DocumentsRepoUser />
                  </Suspense>
                }
              />
            )
          )}
          <Route
            exact
            path="/document-repo-user-inward-create"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InwardSubmissionUser />
              </Suspense>
            }
          />
          <Route
            exact
            path="/documentsrepo-user/custom-template"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CustomTemplateUser />
              </Suspense>
            }
          />
          {/* User Creation  */}
          <Route
            exact
            path="/UserIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <UserIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/UserForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <UserForm />
              </Suspense>
            }
          />
          {/* Hostel Creation  */}
          <Route
            exact
            path={"/HostelCreationMaster"}
            element={
              <Navigate replace to="/HostelCreationMaster/HostelBlock" />
            }
          />
          {[
            "/HostelCreationMaster/HostelBlock",
            "/HostelCreationMaster/HostelRoom",
            "/HostelCreationMaster/HostelBed",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <HostelCreationMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/HostelCreationMaster/HostelBlock/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelBlockForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HostelCreationMaster/HostelBlock/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelBlockForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HostelCreationMaster/HostelRoom/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelRoomForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HostelCreationMaster/HostelRoom/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelRoomForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HostelBlockView"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelBlockView />
              </Suspense>
            }
          />
            <Route
            exact
            path="/hostel-due-report"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelDueReport />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmpDocumentCollection"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpDocumentCollection />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StudentDocumentUpload"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDocumentUpload />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StudentDocument"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDocument />
              </Suspense>
            }
          />
          {/* Institute Master  */}
          <Route
            exact
            path={"/InstituteMaster"}
            element={<Navigate replace to="/InstituteMaster/Organization" />}
          />
          {[
            "/InstituteMaster/Organization",
            "/InstituteMaster/School",
            "/InstituteMaster/JobType",
            "/InstituteMaster/EmpType",
            "/InstituteMaster/Graduation",
            "/InstituteMaster/Visions",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <InstituteMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/InstituteMaster/Organization/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OrganizationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Organization/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OrganizationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/School/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SchoolForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/School/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SchoolForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Jobtype/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JobtypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Jobtype/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JobtypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Emptype/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmptypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Emptype/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmptypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Graduation/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GraduationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Graduation/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GraduationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/SchoolVision/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SchoolVisionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/SchoolVision/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SchoolVisionForm />
              </Suspense>
            }
          />
          {/* Shift   */}
          <Route
            exact
            path="/ShiftMaster"
            element={<Navigate replace to="/ShiftMaster/Shifts" />}
          />
          {["ShiftMaster/Shifts"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ShiftMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/ShiftMaster/Shifts/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ShiftForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ShiftMaster/Shifts/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ShiftForm />
              </Suspense>
            }
          />
          {/* Candidate Walkin  */}
          <Route
            exact
            path="/instant-candidate"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CandidateWalkinForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/admissions"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CandidateWalkinIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/admissions-intl"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CandidateWalkinIntlIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/admissions/offer-create/:id/:type"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PreAdmissionProcessForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/scholarship"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PreScholarshipVerifierIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/PrescholarshipapproverIndex"}
            element={<Navigate replace to="/PreGrantMaster/Approve" />}
          />
          {["/PreGrantMaster/Approve", "/PreGrantMaster/History"].map(
            (path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <PreGrantApproveMaster />
                  </Suspense>
                }
              />
            )
          )}
          <Route
            exact
            path="/PreScholarshipApproverForm/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PreScholarshipApproverForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/scholarship/verify/:auid/:scholarshipId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PreScholarshipVerifierForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/scholarship/history"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PreScholarshipVerifierHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/update-scholarship/:auid/:scholarshipId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ScholarshipUpdateForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/admissions/offer-view/:id/:type"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OfferLetterView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AuidForm/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AuidForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/admissions-userwise"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CandidateWalkinUserwise />
              </Suspense>
            }
          />
          <Route
            exact
            path="/MyProfile"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MyProfile />
              </Suspense>
            }
          />
          <Route
            exact
            path="/student-profile"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentProfileView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/scholarship/direct"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DirectScholarshipForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ScholarshipApproverForm/:auid/:scholarshipId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ScholarshipApproverForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ScholarshipApplicationPrint/:studentId/:scholarshipId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ScholarshipApplicationPrint />
              </Suspense>
            }
          />
          <Route
            exact
            path="/approve-scholarship"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ScholarshipApproverIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/scholarship/report"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ScholarshipApproverHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/GrantApplicationPrint/:studentId/:scholarshipId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GrantPrintApplication />
              </Suspense>
            }
          />
          <Route
            exact
            path="/admissions/auid-creation/:id/:type"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdmissionForm />
              </Suspense>
            }
          />

          {/* Academic Calendar  */}
          <Route
            exact
            path={"/AcademicCalendars"}
            element={<Navigate replace to="/AcademicCalendars/AcademicYear" />}
          />
          {[
            "/AcademicCalendars/AcademicYear",
            "/AcademicCalendars/FinancialYear",
            "/AcademicCalendars/CalendarYear",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AcademicCalendars />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/AcademicCalendars/Academicyear/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AcademicyearForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicCalendars/Academicyear/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AcademicyearForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicCalendars/Financialyear/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FinancialyearForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicCalendars/Financialyear/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FinancialyearForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicCalendars/Calenderyear/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CalenderyearForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicCalendars/Calenderyear/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CalenderyearForm />
              </Suspense>
            }
          />
          {/*Consumables */}
          <Route
            exact
            path="/Consumables"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <Consumables />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StockRegister"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StockRegister />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Consumables/:groupName/:groupId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ConsumablesReport />
              </Suspense>
            }
          />

          <Route
            exact
            path="/ClosingstockReport/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ClosingstockReport />
              </Suspense>
            }
          />

          {/* Academic Master  */}
          <Route
            exact
            path={"/AcademicMaster"}
            element={<Navigate replace to="/AcademicMaster/Department" />}
          />
          {[
            "/AcademicMaster/Department",
            "/AcademicMaster/Assignment",
            "/AcademicMaster/Program",
            "/AcademicMaster/Assign",
            "/AcademicMaster/Specialization",
            "/AcademicMaster/Internal",
            "/AcademicMaster/VisionMissions",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AcademicMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/AcademicMaster/Department/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DepartmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/Department/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DepartmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/DepartmentAssignment/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DepartmentAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/DepartmentAssignment/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DepartmentAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/Program/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/Program/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/ProgramAssignment/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/ProgramAssignment/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/ProgramSpecialization/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramSpecializationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/ProgramSpecialization/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramSpecializationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/VisionMission/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VisionMissionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/VisionMission/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VisionMissionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internals"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalAssesmentIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internals/assesment-creation"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalAssesmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internals/room-assign"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalRoomAssignment />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internals/room-assignment"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalRoomAssignmentIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internals/assesment-update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalAssesmentUpdate />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internal-attendance"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalAssesmentAttendance />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internal-marks/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalMarksForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internal-marks/:id/:type"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalMarksForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internals/marks"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalMarksIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internal-marks"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalMarksUserIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internal-timetable"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalsTimeTable />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internals-report"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalMarksIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internals-report/inst"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalMarksInstituteIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internals-report/dept"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalMarksDeptIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/std-internals"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentInternalReport />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internals-lock"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalFinalMarksIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internals-result-analysis"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalResultAnalysis />
              </Suspense>
            }
          />
          <Route
            exact
            path="/internals-final-report"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalFinalMarksfilter />
              </Suspense>
            }
          />
          {/* Course Pattern */}
          <Route
            exact
            path="/CoursePatternIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CoursePatternIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CoursePatternForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CoursePatternForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CoursePatternForm/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CoursePatternForm />
              </Suspense>
            }
          />

          {/*Course Master*/}

          {/*Course  */}
          <>
            <Route
              exact
              path="/CourseMaster"
              element={<Navigate replace to="/CourseMaster/Course" />}
            />
            {[
              "/CourseMaster/Course",
              "/CourseMaster/Category",
              "/CourseMaster/Type",
              "/CourseMaster/Pattern",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <CourseMaster />
                  </Suspense>
                }
              />
            ))}
            <Route
              exact
              path="/CourseForm"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseAssignment"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseAssignment />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseAssignment/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseAssignment />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseForm/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/CourseAssignmentEmployee"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseAssignmentEmployee />
                </Suspense>
              }
            />

            <Route
              exact
              path="/course-assignment-for-employee"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <EmployeeCourseAssignment />
                </Suspense>
              }
            />

            <Route
              exact
              path="/course-assignment-for-employee-update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <EmployeeCourseAssignment />
                </Suspense>
              }
            />

            <Route
              exact
              path="/course-assignment-for-employee-index"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <EmployeeCourseAssignmentIndex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/CourseTypeForm/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseTypeForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseTypeForm/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseTypeForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseCategoryForm/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseCategoryForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseCategoryForm/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseCategoryForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseMaster/Student/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseStudentAssignment />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseMaster/Student/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseStudentAssignment />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CoursePatternForm"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CoursePatternForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CoursePatternForm/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CoursePatternForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/CoursePatternIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CoursePatternIndex />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseassignmentIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseassignmentIndex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/Courseassignmentstudentindex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <Courseassignmentstudentindex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/CourseStudentAssignmentIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseStudentAssignmentIndex />
                </Suspense>
              }
            />
          </>

          {/*Course Subjective */}
          <>
            <Route
              exact
              path={"/CourseSubjectiveMaster"}
              element={
                <Navigate replace to="/CourseSubjectiveMaster/Objective" />
              }
            />
            {[
              "/CourseSubjectiveMaster/Objective",
              "/CourseSubjectiveMaster/Outcome",
              "/CourseSubjectiveMaster/Syllabus",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <CourseSubjectiveMaster />
                  </Suspense>
                }
              />
            ))}

            <Route
              exact
              path="/CourseSubjectiveMaster/CourseObjective/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseObjectiveForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseSubjectiveMaster/CourseObjective/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseObjectiveForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseSubjectiveMaster/CourseOutcome/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseOutcomeForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseSubjectiveMaster/CourseOutcome/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseOutcomeForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseSubjectiveMaster/Syllabus/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <SyllabusForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/SyllabusForm"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <SyllabusForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseSubjectiveMaster/Syllabus/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <SyllabusForm />
                </Suspense>
              }
            />
          </>

          {/* Course Assignment  */}
          <Route
            exact
            path="/CourseassignmentIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CourseassignmentIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CourseAssignment"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CourseAssignment />
              </Suspense>
            }
          />

          <Route
            exact
            path="/CourseassignmentEmployeeIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CourseAssignmentEmployeeIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/CourseassignmentEmployeeUpdate/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CourseAssignmentEmployee />
              </Suspense>
            }
          />

          {/* Admission Master  */}
          <Route
            exact
            path={"/AdmissionMaster"}
            element={<Navigate replace to="/AdmissionMaster/Course" />}
          />
          {[
            "/AdmissionMaster/Course",
            "/AdmissionMaster/Board",
            "/AdmissionMaster/Category",
            "/AdmissionMaster/Sub",
            "/AdmissionMaster/Currency",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AdmissionMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/AdmissionMaster/AdmissionCategory/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdmCategoryForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/AdmissionCategory/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdmCategoryForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/AdmissionSubCategory/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdmSubCategoryForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/AdmissionSubCategory/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdmSubCategoryForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Board/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BoardForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Board/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BoardForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Currencytype/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CurrencytypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Currencytype/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CurrencytypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Programtype/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramtypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Programtype/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramtypeForm />
              </Suspense>
            }
          />
          {/* Fee Template  */}
          <Route
            exact
            path="/FeetemplateMaster"
            element={<Navigate replace to="/FeetemplateMaster/Feetemplate" />}
          />
          {["/FeetemplateMaster/Feetemplate", "FeetemplateMaster/Route"].map(
            (path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <FeetemplateMaster />
                  </Suspense>
                }
              />
            )
          )}
          <Route
            exact
            path="/FeetemplateMaster/Feetemplate/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeeTemplate />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateSubamount/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateSubamount />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateMaster/EditFeetemplateSubAmount/:id/1"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateSubamount />
              </Suspense>
            }
          />

          <Route
            exact
            path="/Feetemplatemaster/Feetemplatesubamount/:id/:yearsemId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateLateral />
              </Suspense>
            }
          />

          <Route
            exact
            path="/Feetemplatemaster/Editsubamount/:id/:yearsemId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateLateral />
              </Suspense>
            }
          />

          <Route
            exact
            path="/FeetemplateMaster/EditFeetemplateSubAmount/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateSubamount />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateApprovalIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateApprovalIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/FeetemplateSubamountView/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateNew />
              </Suspense>
            }
          />

          {/* Account Master  */}
          <Route
            exact
            path={"/AccountMaster"}
            element={<Navigate replace to="/AccountMaster/Group" />}
          />
          {[
            "/AccountMaster/Group",
            "/AccountMaster/Ledger",
            "/AccountMaster/Tallyhead",
            "/AccountMaster/Voucherhead",
            "/AccountMaster/OpeningBalance",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AccountMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/AccountMaster/Tallyhead/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TallyHeadForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Tallyhead/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TallyHeadForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Voucher/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VoucherForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/VoucherAssignment/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VoucherAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/VoucherAssignment/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VoucherAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Group/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GroupForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Group/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GroupForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Ledger/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LedgerForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Ledger/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LedgerForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Voucher/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VoucherForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/OpeningBalanceUpdateForm/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OpeningBalanceUpdateForm />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/accounts-voucher"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AccountVoucherMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/draft-payment-voucher"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaymentVoucherForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/payment-voucher-pdf/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaymentVoucherPdf />
              </Suspense>
            }
          />

          <Route
            exact
            path="/fund-transfer-pdf/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FundTransferPdf />
              </Suspense>
            }
          />

          <Route
            exact
            path="/contra-voucher-pdf"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ContraVoucherPdf />
              </Suspense>
            }
          />

          <Route
            exact
            path="/contra-voucher-pdf-auto/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ContraVoucherPdfAuto />
              </Suspense>
            }
          />

          <Route
            exact
            path="/advance-payment-voucher"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdvancePaymentVoucherIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/po-payment-history"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PoPaymentList />
              </Suspense>
            }
          />
          <Route
            exact
            path="/journal-voucher"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JournalVoucherForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/journal-voucher-edit/:vcNo/:schoolId/:fcyearId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JournalVoucherForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/journal-verify"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JournalVerifierIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/draft-payment-voucher-verify"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VerifyPaymentVoucherIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/draft-payment-voucher-approve"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaymentVoucherApprove />
              </Suspense>
            }
          />
          <Route
            exact
            path="/payment-voucher-index"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaymentVoucherIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/salary-voucher"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryVoucherForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/consultant-voucher"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ConsultantVoucherForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/draft-journals"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DraftJournalVoucherIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/approve-jv/:vcNo/:schoolId/:fcyearId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JournalVerifyForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/journal-voucher/:type/:amount"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JournalVoucherForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/journal-grn"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JournalGrnIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/journals"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JournalVoucherIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/generate-journalvoucher-pdf/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JournalVoucherPdf />
              </Suspense>
            }
          />

          <Route
            exact
            path="/fund-transfer"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FundTransfer />
              </Suspense>
            }
          />

          <Route
            exact
            path="/contra-voucher"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ContraVoucher />
              </Suspense>
            }
          />

          {/*Bank Master */}
          <>
            <Route
              exact
              path={"/BankMaster"}
              element={<Navigate replace to="/BankMaster/Import" />}
            />
            {[
              "/BankMaster/Import",
              "/BankMaster/Group",
              "/BankMaster/Bank",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <BankMaster />
                  </Suspense>
                }
              />
            ))}
            <Route />
            <Route
              exact
              path="/BankMaster/Bank/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BankForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/BankMaster/Bank/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BankForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/BankIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BankIndex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/BankMaster/BankImport/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BankImport />
                </Suspense>
              }
            />
            <Route
              exact
              path="/BankClearedHistory"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BankClearedHistory />
                </Suspense>
              }
            />

            <Route
              exact
              path="/BankMaster/BankGroup"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BankGroup />
                </Suspense>
              }
            />

            <Route
              exact
              path="/BankMaster/BankGroup/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BankGroup />
                </Suspense>
              }
            />

            <Route
              exact
              path="/DollartoInrForm"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <DollartoInrForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/DollartoInrIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <DollartoInrIndex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/DollartoInr/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <DollartoInrForm />
                </Suspense>
              }
            />
          </>
          <Route
            exact
            path={"/DeductionMaster"}
            element={<Navigate replace to="/DeductionMaster/Tds" />}
          />
          {["/DeductionMaster/Tds", "/DeductionMaster/Advance"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <DeductionMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/DeductionMaster/TdsForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TdsForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/DeductionMaster/AdvanceDeductionForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdvanceDeductionForm />
              </Suspense>
            }
          />

          <Route
            exact
            path="/ViewFeetemplateSubAmount/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ViewFeetemplateSubAmount />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ViewFeetemplateSubAmount/:id/1"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ViewFeetemplateSubAmount />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateAttachmentView/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateAttachmentView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateMaster/Feetemplate/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeeTemplate />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateSubAmountHistory/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateSubAmountHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateApproval/:id/:yearsemId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateApproval />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplatePdf/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplatePdf />
              </Suspense>
            }
          />

          <Route
            exact
            path="/Feetemplate/Multiple/Pdf"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateMultiplePdf />
              </Suspense>
            }
          />

          <Route
            exact
            path="/AddonFee"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AddonFee />
              </Suspense>
            }
          />
          {/*Category Type Master */}
          <>
            <Route
              exact
              path={"/CategoryTypeMaster"}
              element={
                <Navigate replace to="/CategoryTypeMaster/CategoryTypes" />
              }
            />
            {[
              "/CategoryTypeMaster/CategoryTypes",
              "/CategoryTypeMaster/CategoryDetail",
              "/CategoryTypeMaster/CommencementTypes",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <CategoryTypeMaster />
                  </Suspense>
                }
              />
            ))}

            <Route
              exact
              path="/CategoryTypeMaster/CategoryTypes/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CategoryTypeForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CategoryTypeMaster/CategoryTypes/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CategoryTypeForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CategoryTypeMaster/CategoryDetail/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CategoryDetailsForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CategoryTypeMaster/CategoryDetail/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CategoryDetailsForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CategoryTypeMaster/CommencementType/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CommencementTypeForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CategoryTypeMaster/CommencementType/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CommencementTypeForm />
                </Suspense>
              }
            />
          </>
          {/* Job Portal  */}
          <Route
            exact
            path="/JobPortal"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JobPortalIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/jobportal/interview/new/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InterView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/jobportal/interview/update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InterView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/jobportal/result/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ResultForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/jobportal/salary-breakup/New/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryBreakupForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/jobportal/salary-breakup/Update/:id/:offerId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryBreakupForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/jobportal/salary-breakup/New/:id/:offerId/:type"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryBreakupForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/jobportal/job-offer/:id/:offerId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OfferForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/jobportal/recruitment/:id/:offerId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RecruitmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HodComments"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HodCommentsIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/OfferLetterPrint/:id/:offerId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OfferLetterPrint />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryBreakupPrint/:id/:offerId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryBreakupPrint />
              </Suspense>
            }
          />
          <Route
            exact
            path="/OfferAccepted/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OfferAccepted />
              </Suspense>
            }
          />
          {/* Designation Master  */}
          <Route
            exact
            path="/DesignationMaster"
            element={<Navigate replace to="/DesignationMaster/Designations" />}
          />
          {["DesignationMaster/Designations"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <DesignationMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/DesignationMaster/Designations/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DesignationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/DesignationMaster/Designations/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DesignationForm />
              </Suspense>
            }
          />
          {/* Salary Master  */}
          <Route
            exact
            path={"/SalaryMaster"}
            element={<Navigate replace to="/SalaryMaster/SalaryStructure" />}
          />
          {[
            "/SalaryMaster/SalaryStructure",
            "/SalaryMaster/SalaryHead",
            "/SalaryMaster/Assignment",
            "/SalaryMaster/SlabDefinition",
            "/SalaryMaster/SlabStructure",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <SalaryMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/SalaryMaster/SalaryStructure/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryStructureForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryMaster/SalaryStructure/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryStructureForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryMaster/SalaryStructureHead/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryStructureHeadForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryMaster/SalaryStructureHead/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryStructureHeadForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryMaster/SalaryStructureAssignment/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryStructureAssignment />
              </Suspense>
            }
          />
          <Route
            exact
            path="SlabStructureForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SlabStructureForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="SlabStructureUpdate/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SlabStructureForm />
              </Suspense>
            }
          />
          {/* Mentor Master  */}
          <Route
            exact
            path={"/ProctorStudentMaster"}
            element={<Navigate replace to="/ProctorStudentMaster/Proctor" />}
          />
          {[
            "/ProctorStudentMaster/Proctor",
            "/ProctorStudentMaster/History",
            "/ProctorStudentMaster/Meeting",
            "/ProctorStudentMaster/Report",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ProctorStudentMaster />
                </Suspense>
              }
            />
          ))}
          {/* Proctor Master Employee  */}
          <Route
            exact
            path="ProctorMaster"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorMasterIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ProctorEmployeeMaster-user"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorEmployeeMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ProctorEmployeeMaster-inst"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorEmployeeMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ProctorEmployeeMaster-dept"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorEmployeeMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/ProctorEmployeeMaster"}
            element={<Navigate replace to="/ProctorEmployeeMaster/Proctor" />}
          />
          {[
            "/ProctorEmployeeMaster/Proctor",
            "/ProctorEmployeeMaster/History",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ProctorEmployeeMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/ProctorStudent"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentProctorIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/MentorMaster"}
            element={<Navigate replace to="/MentorMaster/Mentor" />}
          />
          {[
            "/MentorMaster/Mentor",
            "/MentorMaster/History",
            "/MentorMaster/Meeting",
            "/MentorMaster/Report",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <MentorMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/MentorMaster/Mentor/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorheadForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/MentorMaster/Mentor/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorheadForm />
              </Suspense>
            }
          />

          <Route
            exact
            path="/MentorHeadIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorHeadIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/MentorAssignment-Inst"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentAssignmentFormInst />
              </Suspense>
            }
          />
          <Route
            exact
            path="/MentorAssignmentIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentAssignmentIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/MentorStudentHistory"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/MentorMeeting"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorMeeting />
              </Suspense>
            }
          />
          <Route
            exact
            path="/MentorStudentMeeting"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentMeeting />
              </Suspense>
            }
          />

          <Route
            exact
            path="/MentorStudentMeetingIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentMeetingIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/MentorMaster/Mentor-head"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MentorMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/MentorMaster/History-head"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MentorMaster />
              </Suspense>
            }
          />

          <Route
            exact
            path="/MentorAssignment"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentAssignmentForm />
              </Suspense>
            }
          />

          {/*Report Master */}
          <>
            <Route
              exact
              path="/ReportMaster"
              element={<Navigate replace to="/ReportMaster/Reporting" />}
            />
            {[
              "/ReportMaster/Reporting",
              "/ReportMaster/Eligible",
              "/ReportMaster/Promote",
              "/ReportMaster/History",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <ReportMaster />
                  </Suspense>
                }
              />
            ))}
            <Route
              exact
              path="/StudentReporting"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentReporting />
                </Suspense>
              }
            />
            <Route
              exact
              path="/ReportMaster/Report/:acYearId/:schoolId/:programId/:yearsemId/:currentYearSem/:speId"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ReportIndex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/StudentReporting/:acYearId/:schoolId/:programId/:acYearId/:yearsemId/:currentYearSem/:speId"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ReportIndexFirst />
                </Suspense>
              }
            />

            <Route
              exact
              path="/ReportMaster/Eligible"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentEligibleForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/ReportMaster/Eligible/:schoolId/:programId/:yearsemId/:currentYearSem"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentEligibleIndex />
                </Suspense>
              }
            />
            <Route
              exact
              path="/ReportMaster/Promote"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentPromoteForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/ReportMaster/Promote/:schoolId/:programId/:yearsemId/:currentYearSem/:status/:speId"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentPromoteIndex />
                </Suspense>
              }
            />
            <Route
              exact
              path="/ReportMaster/History"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentHistory />
                </Suspense>
              }
            />

            <Route
              exact
              path="/ReportMaster/History/:schoolId/:programId/:yearsemId/:currentYearSem/:speId"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentHistoryIndex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/StudentDepromote"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentDepromote />
                </Suspense>
              }
            />

            <Route
              exact
              path="/StudentDepromoteIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentDepromoteIndex />
                </Suspense>
              }
            />
          </>

          {/* Employee Master  */}
          <Route
            exact
            path="/EmployeeIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmployeeUpdateForm/:id/:offerId/:jobId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeUpdateForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ConsultantPaymentReport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ContractPaymentHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ConsultantPay"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ConsultantPaySheet />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmployeeDetailsView/:userId/:offerId/:USERID/:type"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeDetailsView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmployeeDetails/:userId/:offerId/:type"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeDetailsView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/emp-resignation"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeResignationIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/schedulertrigger"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpAttendanceTrigger />
              </Suspense>
            }
          />
          <Route
            exact
            path="/biotransImport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ImportBioTrans />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StudentDetailsViewAttendance/:studentId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDetailsViewAttendance />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Attendancesheet"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpAttendanceFilterForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Attendancesheet-inst"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpAttendanceFilterForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Attendancesheet-dept"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpAttendanceFilterForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmployeeDetails"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeDetailsMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Newjoineeapprover"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeSalaryApprovalIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmployeeDetailsHistory"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeDetailsHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmpDetails"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpDetailsMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/payReport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaySlip />
              </Suspense>
            }
          />
          <Route
            exact
            path="/master-payReport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaySlip />
              </Suspense>
            }
          />
          <Route
            exact
            path="/masterSalary"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MasterSalary />
              </Suspense>
            }
          />
          <Route
            exact
            path="/masterSalary"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MasterSalary />
              </Suspense>
            }
          />
          <Route
            exact
            path="/PayreportPdf"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PayreportPdf />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmployeeResignationIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeResignationIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/apply-resignation"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpResignationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmpResignationForm/:type"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpResignationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ExtraRemuneration"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ExtraRemuneration />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ExtraRemunerationIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ExtraRemunerationIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/EmployeeCalender"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeCalendar />
              </Suspense>
            }
          />

          <Route
            exact
            path="/EmployeeCalenderAdmin"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeCalenderAdmin />
              </Suspense>
            }
          />
          <Route
            exact
            path="/employee-userwiseindex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeUserwiseMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/employee-instwiseindex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeInstwiseMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/employee-test"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeProfile />
              </Suspense>
            }
          />
          <Route
            exact
            path="/nodue-approver"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <NoduesApproverIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/nodue-history"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <NoduesApproverHistoryIndex />
              </Suspense>
            }
          />

          {/* Catering Master  */}
          <Route
            exact
            path={"/CateringMaster"}
            element={
              <Navigate replace to="/CateringMaster/RefreshmentTypeIndex" />
            }
          />
          {[
            "/CateringMaster/RefreshmentTypeIndex",
            "/CateringMaster/MessAssignmentIndex",
            "/CateringMaster/InstituteMealIndex",
            "/CateringMaster/RefreshmentCalenderView",
            "/CateringMaster/RefreshmentRequestIndex",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AssignmentDetailsMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path={"/RefreshmentDetails"}
            element={
              <Navigate
                replace
                to="/RefreshmentDetails/RefreshmentApproverIndex"
              />
            }
          />
          {[
            "/RefreshmentDetails/RefreshmentApproverIndex",
            "/RefreshmentDetails/RefreshmentMailBox",
            "/RefreshmentDetails/RefreshmentRequestReport",
            "/RefreshmentDetails/ApprovedReport",
            "/RefreshmentDetails/Billing",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <RefreshmentDetailsMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/RefreshmentBillingIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RefreshmentBillingLockedIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/RefreshmentTypeIndex/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RefreshmentTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/RefreshmentDetails/RefreshmentTypeIndex/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CreateRefreshmentRequest />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/RefreshmentTypeIndex/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RefreshmentTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/MessAssign/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MessAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/MessAssign/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MessAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/MealAssign/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MealAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/MealAssign/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MealAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/RefreshmentRequestIndex/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RefreshmentRequestForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/RefreshmentRequest/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RefreshmentRequestForm />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/RefreshmentMaster"}
            element={
              <Navigate
                replace
                to="/RefreshmentMaster/RefreshmentRequestIndex"
              />
            }
          />
          {[
            "/RefreshmentMaster/RefreshmentRequestIndex",
            "/RefreshmentMaster/RefreshmentRequestReport",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <RefreshmentMaster />
                </Suspense>
              }
            />
          ))}
          {/* Po Master */}
          <Route
            exact
            path={"/Pomaster"}
            element={<Navigate replace to="/Pomaster/Active" />}
          />
          {["/Pomaster/Active", "/Pomaster/Inactive"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <PoMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/DirectPOCreation"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DirectPOCreation />
              </Suspense>
            }
          />
          <Route
            exact
            path="/DirectPoCreation/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DirectPOCreation />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Draftpo"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AssignPoApprover />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AssignPoApprover"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AssignPoApprover />
              </Suspense>
            }
          />
          <Route
            exact
            path="/BillApprover"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PoBillApprover />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Approvepo"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PoAssignedData />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CreateGrn/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CreateGrn />
              </Suspense>
            }
          />
          <Route
            exact
            path="/DirectPOPdf/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DirectPOPdf />
              </Suspense>
            }
          />
          <Route
            exact
            path="/DraftPoView/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DraftPoView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/POPdf/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PoPdf />
              </Suspense>
            }
          />
          <Route
            exact
            path="/DraftPoPdf/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DraftPoPdf />
              </Suspense>
            }
          />
          <Route
            exact
            path="/PoUpdate/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PoUpdate />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ApproverCreation"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ApproverCreation />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Approver/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ApproverCreation />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ApproverIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ApproverIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CreatedGRN"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CreatedGRN />
              </Suspense>
            }
          />
          <Route
            exact
            path="/GrnIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GrnIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/grnIndex-user"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GrnIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/GrnPdf/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GrnPdf />
              </Suspense>
            }
          />
          {/* InventoryMaster */}
          <>
            <Route
              exact
              path={"/InventoryMaster"}
              element={<Navigate replace to="/InventoryMaster/Stores" />}
            />
            {[
              "/InventoryMaster/Stores",
              "/InventoryMaster/Measures",
              "/InventoryMaster/Vendor",
              "InventoryMaster/InStr",
              "/InventoryMaster/Assignment",
              "/InventoryMaster/Library",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <InventoryMaster />
                  </Suspense>
                }
              />
            ))}

            <Route
              exact
              path="/InventoryMaster/Stores/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StoreForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/InventoryMaster/Stores/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StoreForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/InventoryMaster/Measures/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <MeasureForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/InventoryMaster/Measures/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <MeasureForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/InventoryMaster/Vendor/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <VendorForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/InventoryMaster/Vendor/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <VendorForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/VendorIndex/View/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <View />
                </Suspense>
              }
            />

            <Route
              exact
              path="/ItemCreation"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ItemCreation />
                </Suspense>
              }
            />

            <Route
              exact
              path="/ItemCreation/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ItemCreation />
                </Suspense>
              }
            />

            <Route
              exact
              path="/InventoryMaster/Assignment/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ItemAssignemnt />
                </Suspense>
              }
            />

            <Route
              exact
              path="/InventoryMaster/Assignment/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ItemAssignemnt />
                </Suspense>
              }
            />

            <Route
              exact
              path="/ItemAssignmentIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ItemAssignmentIndex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/StoreIndent"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StoreIndent />
                </Suspense>
              }
            />

            <Route
              exact
              path="/StoreIndentIndex"
              element={<StoreIndentIndex />}
            />
          </>
          {/*Event Master */}
          <>
            <Route
              exact
              path="/daily-planner"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TaskList />
                </Suspense>
              }
            />
            <Route
              exact
              path="/daily-planner/create"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <EventForm />
                </Suspense>
              }
            />
            <Route
              exact
              path={"/EventUserMaster"}
              element={<Navigate replace to="/EventUserMaster/Events/User" />}
            />
            {["/EventUserMaster/Events/User"].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <EventUserMaster />
                  </Suspense>
                }
              />
            ))}
            <Route
              exact
              path="/EventUserMaster/Events/User/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <EventUserCreationForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/EventUserMaster/Room/User"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <RoomUserCreationForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/EventUserMaster/Room/User/View"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <EventUserRoomView />
                </Suspense>
              }
            />
            <Route
              exact
              path="/EventUserMaster/Event/User/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <EventUserCreationForm />
                </Suspense>
              }
            />
            <Route
              exact
              path={"/EventMaster"}
              element={<Navigate replace to="/EventMaster/Events" />}
            />
            {["/EventMaster/Events"].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <EventMaster />
                  </Suspense>
                }
              />
            ))}
            <Route
              exact
              path="/EventMaster/Event/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <EventCreationForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/EventMaster/Room"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <RoomCreationForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/create-grn"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <GRNCreationForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/EventMaster/Room/View"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <EventRoomView />
                </Suspense>
              }
            />
            <Route
              exact
              path="/TimeTable/Room"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeTableRoom />
                </Suspense>
              }
            />
            <Route
              exact
              path="/TimeTable/View"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeTableRoomView />
                </Suspense>
              }
            />
            <Route
              exact
              path="/EventMaster/Event/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <EventCreationForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/EventMaster/Events-User"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <EventMaster />
                </Suspense>
              }
            />
            <Route
              exact
              path="/EventApproverIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <EventApproverIndex />
                </Suspense>
              }
            />
          </>
          {/* Service Request  */}
          <Route
            exact
            path={"/ServiceMaster"}
            element={<Navigate replace to="/ServiceMaster/ServiceTypes" />}
          />
          {[
            "/ServiceMaster/ServiceTypes",
            "/ServiceMaster/ServiceAssignment",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ServiceMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path={"/ServiceRender"}
            element={<Navigate replace to="/ServiceRender/AttendRequest" />}
          />
          {["/ServiceRender/AttendRequest", "/ServiceRender/AttendHistory"].map(
            (path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <AttendServiceMaster />
                  </Suspense>
                }
              />
            )
          )}
          {[
            "/ServiceRenderTransport/AttendRequest",
            "/ServiceRenderTransport/AttendHistory",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AttendServiceTransportMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/ServiceMaster/ServiceTypes/new"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceMaster/ServiceTypes/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceMaster/ServiceAssignment/new"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceAssignmentForm />
              </Suspense>
            }
          />
          {/* <Route
            exact
            path="/ServiceRequest"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceRequestIndex />
              </Suspense>
            }
          /> */}
          <Route
            exact
            path="/ServiceRequest/new"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CreateServiceReqForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRender/attend"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AttendServiceRequest />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRenderTransport/attend"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AttendServiceTransportRequest />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRenderTransport/attendHistory/ViewVehicleIndent"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AttendServiceTransportRequestHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRender/AttendRequest"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AttendServiceRendorIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/ServiceRequest"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceRequestDept />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRequestDeptWise"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceRequestDeptWise />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRequestEventWise"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceRequestEventWise />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRequestForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceRequestForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRequestTransport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceRequestTransport />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRequestTransportForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceRequestTransportForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceTransportView/:maintainenceId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceTransportView />
              </Suspense>
            }
          />

          <Route
            exact
            path="/ServiceRender/AttendHistory"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AttendServiceHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceMasterReport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AttendRequestMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceMasterCharts"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceRequestGraph />
              </Suspense>
            }
          />
          {/* Store Indent  */}
          <Route
            exact
            path="/StoreIndentApproverIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreIndentApproverIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StoreIndentHistory"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <IndentHistory />
              </Suspense>
            }
          />

          <Route
            exact
            path="/StoreIndentHistory-user"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreIndentHistoryUser />
              </Suspense>
            }
          />

          <Route
            exact
            path="/StoreIndentRequests"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreIndentRequests />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/StoreIndent/new"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreIndent />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/StoreIndentIndex"
            element={<StoreIndentIndex />}
          />

          <Route exact path="/Pojspdf" element={<Pojspdf />} />

          <Route
            exact
            path="/StockIssuePdf"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StockIssuePdf />
              </Suspense>
            }
          />

          <Route
            exact
            path="/PurchaseIndent"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PurchaseIndent />
              </Suspense>
            }
          />

          <Route
            exact
            path="/PurchaseIndentIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PurchaseIndentIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/PurchaseIndentApprovalIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PurchaseIndentApprovalIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/PurchaseIndentIndexUserwise"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PurchaseIndentIndexUserwise />
              </Suspense>
            }
          />

          <Route
            exact
            path="/PurchaseIndentHistory"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PurchaseIndentHistory />
              </Suspense>
            }
          />

          <Route
            exact
            path="/InventoryMaster/StoreIndent/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreIndent />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/feereceipt-daybook"}
            element={<Navigate replace to="/feereceipt-daybook-index" />}
          />
          {["/feereceipt-daybook-index", "/feereceipt-cancel-index"].map(
            (path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <FeeRecieptDayBookMaster />
                  </Suspense>
                }
              />
            )
          )}

          <Route
            exact
            path="/feereceipt-daybook-index-inst"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeereceiptReportInst />
              </Suspense>
            }
          />

          {/* Payment Master */}
          <>
            <Route
              exact
              path={"/PaymentMaster"}
              element={<Navigate replace to="/PaymentMaster/Payment" />}
            />
            {[
              "/PaymentMaster/Payment",
              "/PaymentMaster/Journal",
              "/PaymentMaster/Contra",
              "/PaymentMaster/Salary",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <PaymentMaster />
                  </Suspense>
                }
              />
            ))}

            {/* <Route
              exact
              path="/PaymentMaster/Journal"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <PaymentJournal />
                </Suspense>
              }
            /> */}

            {/* <Route
              exact
              path="/PaymentMaster/PaymentVoucher/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <DraftpaymentVoucher />
                </Suspense>
              }
            /> */}
            {/* <Route
              exact
              path="/ReportMaster/ContraIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ContraIndex />
                </Suspense>
              }
            /> */}
            {/* <Route
              exact
              path="/ReportMaster/CreateContra/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CreateContra />
                </Suspense>
              }
            /> */}
            {/* <Route
              exact
              path="/PaymentContraVoucherPdf/:id/:yearId"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <PaymentContraVoucherPdf />
                </Suspense>
              }
            /> */}
          </>

          {/*Student Payment Master*/}
          <>
            <Route
              exact
              path={"/StudentPaymentMaster"}
              element={<Navigate replace to="/StudentPaymentMaster/College" />}
            />
            {[
              "/StudentPaymentMaster/College",
              "/StudentPaymentMaster/Hostel",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <StudentPaymentMaster />
                  </Suspense>
                }
              />
            ))}

            <Route
              exact
              path="/student-razor-pay"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentRazorPayWindow />
                </Suspense>
              }
            />

            <Route
              exact
              path="/student-razor-pay-uniform"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentRazorPayWindowUniform />
                </Suspense>
              }
            />

            <Route
              exact
              path="/student-razorpay-transaction"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentRazorPayTransaction />
                </Suspense>
              }
            />
            <Route
              exact
              path="/student-profile"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentProfile />
                </Suspense>
              }
            />
          </>

          {/*Exam Fee Payment*/}
          <>
            <Route
              exact
              path={"/Feepayment"}
              element={<Navigate replace to="/Feepayment/Miscellanous" />}
            />
            {["/Feepayment/Exam", "/Feepayment/Miscellanous"].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <ExamFeePayment />
                  </Suspense>
                }
              />
            ))}

            <Route
              exact
              path="/Feepayment/Uniform"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <UniformFeePayment />
                </Suspense>
              }
            />

            <Route
              exact
              path="/student-razor-pay"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentRazorPayWindow />
                </Suspense>
              }
            />

            <Route
              exact
              path="/student-razor-pay-uniform"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentRazorPayWindowUniform />
                </Suspense>
              }
            />

            <Route
              exact
              path="/student-razorpay-transaction"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentRazorPayTransaction />
                </Suspense>
              }
            />
            <Route
              exact
              path="/student-profile"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentProfile />
                </Suspense>
              }
            />
          </>

          {/*Exam Fee Payment*/}
          <>
            <Route
              exact
              path={"/Feepaymenttransaction"}
              element={<Navigate replace to="/Feepayment/Receipt" />}
            />
            {["/Feepayment/Transaction", "/Feepayment/Receipt"].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <FeepaymentTransactions />
                  </Suspense>
                }
              />
            ))}
          </>

          {/* Leave Master  */}
          <Route
            exact
            path={"/LeaveMaster"}
            element={<Navigate replace to="/LeaveMaster/LeaveType" />}
          />
          {[
            "/LeaveMaster/LeaveType",
            "/LeaveMaster/LeavePattern",
            "/LeaveMaster/ViewReport",
            "/LeaveMaster/Copy",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <LeaveMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/LeaveMaster/LeaveTypes/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeaveMaster/LeaveTypes/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeavePatternMaster/LeavePatterns/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeavePatternForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeavePatternMaster/LeavePatterns/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeavePatternForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeaveApplyForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveApplyForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InitiateLeave"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InitialLeave />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeaveApplyIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveApplyIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeaveApproverIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveApproverIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeaveApprovedHistoryIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveApprovedHistoryIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeaveHistory"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveApplyAdminIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeaveDetails/:userId/:leaveId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DeatilsByLeaveType />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InitiateLeaveAdmin"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InitiateLeaveAdmin />
              </Suspense>
            }
          />

          <Route
            exact
            path="/leave-details-report"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveDetailsFilter />
              </Suspense>
            }
          />

          <Route
            exact
            path="/leave-details-report-id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveDetailsById />
              </Suspense>
            }
          />

          {/* Infrastructure Master  */}
          <Route
            exact
            path={"/InfrastructureMaster"}
            element={<Navigate replace to="/InfrastructureMaster/Facility" />}
          />
          {[
            "/InfrastructureMaster/Facility",
            "/InfrastructureMaster/Block",
            "/InfrastructureMaster/Floor",
            "/InfrastructureMaster/Rooms",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <InfrastructureMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/InfrastructureMaster/Facility/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FacilityForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InfrastructureMaster/Facility/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FacilityForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InfrastructureMaster/Block/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BlockForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InfrastructureMaster/Block/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BlockForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InfrastructureMaster/Rooms/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RoomForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InfrastructureMaster/Rooms/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RoomForm />
              </Suspense>
            }
          />
          {/* Hostel Bed View  */}
          <Route
            exact
            path={"/HostelBedViewMaster"}
            element={
              <Navigate replace to="/HostelBedViewMaster/HostelBedView" />
            }
          />
          {["/HostelBedViewMaster/HostelBedView"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <HostelBedViewMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/HostelBedViewMaster/HostelBedView/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelBedViewForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HostelBedViewMaster/HostelBedView/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelBedViewForm />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/AllHostelBedViewMaster"}
            element={
              <Navigate replace to="/AllHostelBedViewMaster/AllHostelBedView" />
            }
          />
          {["/AllHostelBedViewMaster/AllHostelBedView"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <HostelBedViewMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/AllHostelBedViewMaster/AllHostelBedView/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelBedForm />
              </Suspense>
            }
          />
          {/* Hostel Due  */}
          <Route
            exact
            path={"/HostelDueMaster"}
            element={<Navigate replace to="/HostelDueMaster/HostelDue" />}
          />
          {["/HostelDueMaster/HostelDue"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <HostelDueMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/HostelDueMaster/HostelDue/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelStudenDue />
              </Suspense>
            }
          />
          {/* Time Table Master */}
          <>
            <Route
              exact
              path={"/TimeTableMaster"}
              element={<Navigate replace to="/TimeTableMaster/Timetable" />}
            />
            {[
              "TimeTableMaster/Timetable",
              "/TimeTableMaster/Course",
              "/TimeTableMaster/Section",
              "/TimeTableMaster/Batchassignment",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <TimeTableMaster />
                  </Suspense>
                }
              />
            ))}

            <Route
              exact
              path="/TimeTableMaster/sectionassignmentform/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <SectionAssignmentForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/TimeTableMaster/SectionAssignmentUpdate/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <SectionAssignmentForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableMaster/Timetable/Section/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimetableForSectionForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/SectionMaster/Promote/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentPromote />
                </Suspense>
              }
            />

            <Route
              exact
              path={"/FacultyMaster/School"}
              element={
                <Navigate replace to="/FacultyMaster/School/Timetable" />
              }
            />
            {[
              "/FacultyMaster/School/Timetable",
              "/FacultyMaster/School/Section",
              "/FacultyMaster/School/Batch",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <FacultyMaster />
                  </Suspense>
                }
              />
            ))}

            <Route
              exact
              path={"/FacultyMaster/User"}
              element={<Navigate replace to="/FacultyMaster/User/Timetable" />}
            />
            {[
              "/FacultyMaster/User/Timetable",
              "/FacultyMaster/User/Section",
              "/FacultyMaster/User/Batch",
              "/FacultyMaster/User/Subject",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <FacultyMasterUser />
                  </Suspense>
                }
              />
            ))}
            <Route
              exact
              path="/FacultyMaster/User-Today"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultytimetableUserwiseIndex />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseAssignmentIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseAssignmentIndex />
                </Suspense>
              }
            />
            <Route
              exact
              path="/FacultySectionAssignmentSchool"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultySectionAssignmentForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/FacultySectionAssignmentSchool/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultySectionAssignmentForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/FacultyBatchAssignmentSchool"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyBatchAssignmentForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/FacultyBatchAssignmentSchool/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyBatchAssignmentForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/FacultySectionAssignmentUser"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultySectionAssignmentForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/FacultySectionAssignmentUser/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultySectionAssignmentForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/FacultyBatchAssignmentUser"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyBatchAssignmentForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/FacultyBatchAssignmentUser/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyBatchAssignmentForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/FacultySubjectAssignmentUser"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultySubjectAssignmentForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/FacultySubjectAssignmentUser/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultySubjectAssignmentForm />
                </Suspense>
              }
            />

            <Route
              exact
              path={"/FacultyMaster/Dept"}
              element={<Navigate replace to="/FacultyMaster/Dept/Timetable" />}
            />
            {[
              "/FacultyMaster/Dept/Timetable",
              "/FacultyMaster/Dept/Section",
              "/FacultyMaster/Dept/Batch",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <FacultyMasterDept />
                  </Suspense>
                }
              />
            ))}

            <Route
              exact
              path="/TimeTableMaster/Timetable/Batch/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimetableForBatchForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/Facultytimetable-section-school"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyTimetableSectionSchoolWise />
                </Suspense>
              }
            />

            <Route
              exact
              path="/Facultytimetable-batch-dept"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyTimetableBatchDeptWise />
                </Suspense>
              }
            />

            <Route
              exact
              path="/Facultytimetable-section-dept"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyTimetableSectionDeptWise />
                </Suspense>
              }
            />

            <Route
              exact
              path="/Facultytimetable-batch-school"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyTimetableBatchSchoolWise />
                </Suspense>
              }
            />

            <Route
              exact
              path="/Facultytimetable-school"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultytimetableSchoolIndex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/Facultytimetable-section-user"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyTimetableSectionUserwise />
                </Suspense>
              }
            />

            <Route
              exact
              path="/Facultytimetable-batch-user"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyTimetableBatchUserwise />
                </Suspense>
              }
            />

            <Route
              exact
              path="/Facultytimetable-user"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultytimetableUserwiseIndex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableMaster/timeslots/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeSlotsForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/TimeTableMaster/batchassignment/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BatchAssignmentForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/TimeTableMaster/batchassignment/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BatchAssignmentForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableMaster/CourseAssignment/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseAssignmentForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/TimeTableMaster/CourseAssignment/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseAssignmentForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableMaster/TimeTableView"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeTabeleView />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableViewDateWise/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:programType"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeTableViewDateWise />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableDateWisePDF/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:programType"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeTableDateWisePDF />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableViewForCourse/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:courseId/:programType"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeTableViewForCourse />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableViewWeekWise/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:programType"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeTableViewWeekWise />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableFacultyViewPDF/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:courseId/:programType"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeTableFacultyViewPDF />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableViewWeekWisePdf/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:programType"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeTableViewWeekWisePdf />
                </Suspense>
              }
            />
          </>

          {/*Finance Master*/}

          <Route
            exact
            path={"/FinanceMaster"}
            element={<Navigate replace to="/FinanceMaster/Dollar" />}
          />
          {["/FinanceMaster/Dollar"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FinanceMaster />
                </Suspense>
              }
            />
          ))}

          {/*Academic Section Master */}
          <>
            <Route
              exact
              path={"/CalendarAcademic"}
              element={
                <Navigate replace to="/CalendarAcademic/ClassCommencement" />
              }
            />
            {["/CalendarAcademic/ClassCommencement"].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <AcademicSectionMaster />
                  </Suspense>
                }
              />
            ))}
            <Route
              exact
              path="/CalendarAcademic/commencement/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ClassCommencementForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CalendarAcademic/commencement/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ClassCommencementForm />
                </Suspense>
              }
            />
          </>

          {/*Professional Report */}

          <Route exact path="/AddonReport" element={<PublicationReport />} />
          <Route
            exact
            path="/approve-incentive"
            element={<ApproveIncentive />}
          />
          <Route
            exact
            path="/approve-incentive-report"
            element={<ApproveIncentiveReport />}
          />
          <Route
            exact
            path="/addon-incentive-application"
            element={<IncentiveApplication />}
          />
          <Route
            exact
            path="/addonAll-incentive-application"
            element={<IncentiveApplicationAll />}
          />
          <Route exact path="/addon-report-all" element={<AddonReport />} />

          {/* Inventory Master  */}
          <Route
            exact
            path={"/InventoryMaster"}
            element={<Navigate replace to="/InventoryMaster/Stores" />}
          />
          {[
            "/InventoryMaster/Stores",
            "/InventoryMaster/Measures",
            "/InventoryMaster/Vendor",
            "/InventoryMaster/Item",
            "InventoryMaster/InStr",
            "/InventoryMaster/Assignment",
            "/InventoryMaster/Library",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <InventoryMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/InventoryMaster/Stores/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Stores/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Measures/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MeasureForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Measures/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MeasureForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Vendor/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VendorForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Item/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ItemCreation />
              </Suspense>
            }
          />

          <Route
            exact
            path="/InventoryMaster/Vendor/History"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VendorHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ItemIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ItemIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Item/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ItemCreation />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Assignment/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ItemAssignemnt />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Assignment/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ItemAssignemnt />
              </Suspense>
            }
          />
          <Route
            exact
            path="/VendorIndex/View/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <View />
              </Suspense>
            }
          />

          {/*Timetable Master */}

          {/* Holiday Calendar Master  */}
          <Route
            exact
            path={"/HolidayCalenderMaster"}
            element={
              <Navigate replace to="/HolidayCalenderMaster/HolidayCalenders" />
            }
          />
          {["/HolidayCalenderMaster/HolidayCalenders"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <HolidayCalenderMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/HolidayCalenderMaster/HolidayCalenders/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HolidayCalenderForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HolidayCalenderMaster/HolidayCalenders/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HolidayCalenderForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HolidayCalenderMaster/DeAssignDepartments/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DeAssignDepartment />
              </Suspense>
            }
          />
          {/* Section Master  */}
          <Route
            exact
            path={"/SectionMaster"}
            element={<Navigate replace to="/SectionMaster/Sections" />}
          />
          {[
            "/SectionMaster/Sections",
            "/SectionMaster/Batches",
            "/SectionMaster/CourseAssign",
            "/SectionMaster/IntervalTypes",
            "/SectionMaster/Internal",
            "/SectionMaster/Timetable/Batch",
            "/SectionMaster/Timeslot",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <SectionMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/SectionMaster/Section/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SectionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/Section/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SectionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/Batch/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BatchForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/Batch/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BatchForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/intervaltype/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TimeIntervalTypesForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/intervaltype/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TimeIntervalTypesForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/Internal/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalCreationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/Internal/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalCreationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/TimeSlots/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TimeSlotsForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/TimeSlots/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TimeSlotsForm />
              </Suspense>
            }
          />

          {/* Research Profile */}
          <Route
            exact
            path="/ResearchProfileIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ResearchProfileIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ResearchProfileForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ResearchProfileForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ResearchProfileAttachmentView"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ResearchProfileAttachmentView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ResearchProfileReport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ResearchProfileReport />
              </Suspense>
            }
          />
          {/* Transcript Master  */}
          <Route
            exact
            path={"/TranscriptMaster"}
            element={<Navigate replace to="/TranscriptMaster/Transcripts" />}
          />
          {[
            "/TranscriptMaster/Transcripts",
            "/TranscriptMaster/Assignments",
            "/TranscriptMaster/Universitys",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TranscriptMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/TranscriptMaster/Transcript/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TranscriptForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/TranscriptMaster/Transcript/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TranscriptForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/TranscriptMaster/TranscriptAssignment/Assign"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TranscriptAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/TranscriptMaster/University/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <UniversityForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/TranscriptMaster/University/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <UniversityForm />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/StudentTranscriptMaster"}
            element={
              <Navigate
                replace
                to="/StudentTranscriptMaster/StudentTranscript"
              />
            }
          />

          {["/StudentTranscriptMaster/StudentTranscript"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentTranscriptMaster />
                </Suspense>
              }
            />
          ))}

          <Route
            exact
            path="/StudentTranscriptMaster/DocumentCollection/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentTranscriptForm />
              </Suspense>
            }
          />

          {/*Voucher Master */}

          <Route
            exact
            path={"/VoucherMaster"}
            element={<Navigate replace to="/VoucherMaster/Journal" />}
          />
          {[
            "/VoucherMaster/Journal",
            "/VoucherMaster/Payment",
            "/VoucherMaster/Contra",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <VoucherMaster />
                </Suspense>
              }
            />
          ))}

          <Route
            exact
            path={"/AdvanceVoucherMaster"}
            element={<Navigate replace to="/AdvanceVoucherMaster/Advance" />}
          />
          {["/AdvanceVoucherMaster/Advance", "/AdvanceVoucherMaster/Paid"].map(
            (path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <AdvanceVoucherMaster />
                  </Suspense>
                }
              />
            )
          )}

          <Route
            exact
            path={"/JournalMaster"}
            element={<Navigate replace to="/JournalMaster/Grn" />}
          />
          {["/JournalMaster/Grn", "/JournalMaster/Demand"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <JournalMaster />
                </Suspense>
              }
            />
          ))}

          {/* Make Employee Permanent - EmployeeIndex */}
          <Route
            exact
            path="/EmployeePermanentAttachmentView"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeePermanentAttachmentView />
              </Suspense>
            }
          />

          {/* Student Master  */}
          <Route
            exact
            path="/spotAdmission"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SpotAdmissionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/student-master"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDetailsIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/student-master-user"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDetailsIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/student-master-inst"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDetailsIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/student-master-dept"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDetailsIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/student-master-intl"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDetailsIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/readmission"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ReadmissionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/course-change/:studentId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ChangeOfCourse />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StudentMaster/LessonplanForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LessonplanForm />
              </Suspense>
            }
          />

          <Route
            exact
            path="/StudentMaster/ReferencebookForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <Referencebookform />
              </Suspense>
            }
          />
          <Route
            exact
            path="/initiate-canceladmission/:studentId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CancelAdmissionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StudentMaster/ReferencebookForm/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <Referencebookform />
              </Suspense>
            }
          />
          <Route
            exact
            path="/approve-canceladmission"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ApproveCancelAdmissionIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StudentMaster/LessonplanIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LessonplanIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdminLessonplanIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdminLessonplanIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/approve-canceladmission/:studentId/:cancelId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ApproveCancelAdmission />
              </Suspense>
            }
          />
          <Route
            exact
            path="/canceladmission-history"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CancelAdmissionHistoryIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/canceladmission-view/:id/:cancelId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CancelAdmissionView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/student-profile/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDetailsView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/student-ledger"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentLedger />
              </Suspense>
            }
          />
          <Route
            exact
            path="/student-ledger/:auid"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentLedger />
              </Suspense>
            }
          />
          <Route
            exact
            path="/std-nodue"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentNodueForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/std-update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDetailsUpdate />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StudentMaster/ReferencebookIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ReferencebookIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/std-paid-board"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaidAtBoardTag />
              </Suspense>
            }
          />
          <Route
            exact
            path="/paid-at-board-index"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaidAtBoardIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/paid-at-board-std-list"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaidAtBoardStdList />
              </Suspense>
            }
          />
          <Route
            exact
            path="/paid-at-board-receipt"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaidAtBoardReceipt />
              </Suspense>
            }
          />

          <Route
            exact
            path="/received-amount"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ReceivedAmount />
              </Suspense>
            }
          />
          <Route
            exact
            path="/paid-at-board-report"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaidAtBoardReport />
              </Suspense>
            }
          />
          <Route
            exact
            path="/paid-at-board-school-wise"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaidAtBoardSchoolWise />
              </Suspense>
            }
          />
          <Route
            exact
            path="/paid-at-board-acyear-wise"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaidAtBoardAcYearWise />
              </Suspense>
            }
          />
          <Route
            exact
            path="/paid-at-board-std-wise"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaidAtBoardStdWise />
              </Suspense>
            }
          />
          <Route
            exact
            path="/fee-payment-window"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeePaymentWindow />
              </Suspense>
            }
          />
          <Route
            exact
            path="/fee-payment-window-index"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeePaymentWindowIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/fee-payment-window-index-user"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeePaymentWindowIndexUser />
              </Suspense>
            }
          />
          <Route
            exact
            path="/fee-payment-window-update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeePaymentWindow />
              </Suspense>
            }
          />

          <Route
            exact
            path="/stdmarks"
            element={<Navigate replace to="/stdmarks/exam" />}
          />
          {["/stdmarks/exam", "/stdmarks/report"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentMarksMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/stdmarks/exam"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentMarks />
              </Suspense>
            }
          />

          <Route
            exact
            path="/stdmarks/report"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentMarksIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/stdmarks"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentMarksMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="student-master/DocumentCollection/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DocumentCollectionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StudentTranscriptApplication/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentTranscriptApplication />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StudentDocumentCollectionPdf/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDocumentCollectionPdf />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ChangeOfCourseIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ChangeOfCourseIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ChangeOfCourseAttachment/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ChangeOfCourseAttachment />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ApproverChangeofcourse/:studentId/:oldStudentId/:oldSpecializationId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ApproveChangeofcourse />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeeTransfer/:auid"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeeTransfer />
              </Suspense>
            }
          />
          <Route
            exact
            path="/registration"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RegistrationDetails />
              </Suspense>
            }
          />
          <Route
            exact
            path="/student-attendance"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentAttendanceSummary />
              </Suspense>
            }
          />
          <Route
            exact
            path="/student-attendance/coursewise"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentCoursewiseAttendance />
              </Suspense>
            }
          />
          <Route
            exact
            path="/attendance-report"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DetailedAttendancefilter />
              </Suspense>
            }
          />

          <Route
            exact
            path="/student-overall-attendence"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentOverallAttendance />
              </Suspense>
            }
          />
          {/* ID Card */}
          <Route
            exact
            path="/IdCardPrint"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <IDCardPrint />
              </Suspense>
            }
          />

          <Route
            exact
            path="/StudentFeeReceipt/:receiptType"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentFeeReceipt />
              </Suspense>
            }
          />

          <Route
            exact
            path="/StudentReceipt/:receiptType"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentReceipt />
              </Suspense>
            }
          />

          <Route
            exact
            path="/StudentRefund"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentRefund />
              </Suspense>
            }
          />

          <Route
            exact
            path="/StudentRefundIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentRefundIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/StudentRefundIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentRefundIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/StudentRefundPdf"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentRefundPdf />
              </Suspense>
            }
          />

          <Route
            exact
            path="/FeeReceipt"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeeReceipt />
              </Suspense>
            }
          />

          <Route
            exact
            path="/NiniskillupForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <NiniskillupForm />
              </Suspense>
            }
          />

          <Route
            exact
            path="/NiniskillupPdf"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <NiniskillupPdf />
              </Suspense>
            }
          />

          <Route
            exact
            path="/NiniskillPdf"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <NiniskillPdf />
              </Suspense>
            }
          />

          <Route
            exact
            path="/UniformAndStationaryFeeReceipt"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <UniformAndStationaryFeeReceipt />
              </Suspense>
            }
          />

          <Route
            exact
            path="/UniformAndStationaryReceiptPdf"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <UniformAndStationaryReceiptPdf />
              </Suspense>
            }
          />

          <Route
            exact
            path="/UniformReceiptPdf"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <UniformReceiptPdf />
              </Suspense>
            }
          />

          <Route
            exact
            path="/ExamFeeReceipt"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ExamFeeReceipt />
              </Suspense>
            }
          />

          <Route
            exact
            path="/ExamReceiptPdf"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ExamReceiptPdf />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ExamReceiptPdfV1"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ExamReceiptPdfNew />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeeReceiptIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeeReceiptReportIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/daily-counter-summary"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DailyCounterSummaryIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/counter-summary"}
            element={<Navigate replace to="/counter-summary-user" />}
          />
          {["/counter-summary-user", "/counter-summary-school"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CounterSummaryIndex />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/petty-cash-payment"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PettyCashPayment />
              </Suspense>
            }
          />
          <Route
            exact
            path="/petty-cash-payment-form"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PettyCashPaymentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/dd-detail-report"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DDDetailReport />
              </Suspense>
            }
          />
          <Route
            exact
            path="/salary-mis"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryMisIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/maintenance-report"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceIndentReport />
              </Suspense>
            }
          />
          <Route
            exact
            path="/maintenancetransport-report"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceIndentTransportReport />
              </Suspense>
            }
          />
          <Route
            exact
            path="/salary-report"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryReport />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeeReceiptDetails"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeeReceiptDetails />
              </Suspense>
            }
          />
          <Route
            exact
            path="/stdFeeReceipt/:auid/:studentId/:feeReceipt/:financialYearId/:transactionType"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentFeeReceiptDetailsPDF />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeeReceiptDetailsPDF"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeeReceiptDetailsPDF />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeeReceiptDetailsPDFV1"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeeReceiptDetailsPDFNew />
              </Suspense>
            }
          />

          <Route
            exact
            path="/BulkFeeReceiptForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BulkFeeReceipt />
              </Suspense>
            }
          />
          <Route
            exact
            path="/BulkFeeReceipt/:receiptType"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BulkFeeReceipt />
              </Suspense>
            }
          />
          {/* <Route
            exact
            path="/BulkFeeReceiptView/:feeReceiptId/:transactionType/:financialYearId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BulkFeeReceiptView />
              </Suspense>
            }
          /> */}
          <Route
            exact
            path="/BulkFeeReceiptView"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BulkFeeReceiptView />
              </Suspense>
            }
          />
          {/* <Route
            exact
            path="/BulkFeeReceiptPdf"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BulkFeeReceiptPdf />
              </Suspense>
            }
          /> */}
          <Route
            exact
            path="/BulkFeeReceiptPdf"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BulkFeeReceiptPdf />
              </Suspense>
            }
          />
          <Route
            exact
            path="/BulkFeeReceiptPdfV1"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BulkFeeReceiptPdfNew />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HostelFeeReceipt"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelFeeReceipt />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HostelFeeReceiptBulk"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelFeeReceiptBulk />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HostelBulkFeeReceiptV1"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelBulkFeeReceiptV1 />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CancelFeeReceipt"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CancelFeeReceipt />
              </Suspense>
            }
          />

          <Route
            exact
            path="/CancelFeeReceiptIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CancelFeeReceiptIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/CancelHostelReceipt"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CancelHostelReceipt />
              </Suspense>
            }
          />

          <Route
            exact
            path="/HostelFeePdf"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelFeePdf />
              </Suspense>
            }
          />

          <Route
            exact
            path="/HostelFeePdfV1"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelFeePdfNew />
              </Suspense>
            }
          />

          <Route
            exact
            path="/HostelFeeBulkPdf"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelFeeBulkPdf />
              </Suspense>
            }
          />

          <Route
            exact
            path="/StudentMaster/StudentAttendance"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentAttendace />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StudentMaster/StudentAttendanceReport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentAttendaceReport />
              </Suspense>
            }
          />

          <Route
            exact
            path="/studentmaster/studentattendance-inst"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentAttendenceSchool />
              </Suspense>
            }
          />

          <Route
            exact
            path="/studentmaster/studentattendance-dept"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentAttendenceDept />
              </Suspense>
            }
          />

          <Route
            exact
            path="/StudentOnlineClass"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentOnlineClass />
              </Suspense>
            }
          />

          {/* <Route
            exact
            path="/StaffIdCardIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StaffIdCardIndex />
              </Suspense>
            }
          /> */}

          {/*Faculty Details */}

          <Route
            exact
            path="/FacultyDetails"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FacultyDetails />
              </Suspense>
            }
          />

          <Route
            exact
            path="/facultydetails/StudentDetailsByClass"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentDetailsByBatch />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FacultyDetails/AttendanceReport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FacultyDetailsAttendaceReport />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InternalTimeTable/AttendanceReport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternaltimeTableAttendaceReport />
              </Suspense>
            }
          />

          {/*Student Intake */}
          <Route
            exact
            path={"/StudentIntakeMaster"}
            element={
              <Navigate replace to="/StudentIntakeMaster/Studentintake" />
            }
          />
          {[
            "/StudentIntakeMaster/Studentintake",
            "StudentIntakeMaster/Summary",
            "StudentIntakeMaster/Grid",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentIntakeMaster />
                </Suspense>
              }
            />
          ))}
          <>
            <Route
              exact
              path="/StudentIntakeForm"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentIntakeForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/StudentIntakeSelection"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentIntakeSelection />
                </Suspense>
              }
            />

            <Route
              exact
              path="/Summary"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentIntakeSummary />
                </Suspense>
              }
            />
          </>
          {/* Student NoDue */}
          <Route
            exact
            path="/StudentNoDue"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentNoDue />
              </Suspense>
            }
          />
          <Route
            exact
            path="/studentnodue-inst"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentNoDue />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StudentNoDueForm/:student_id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentNoDueDetails />
              </Suspense>
            }
          />
          {/*FRRO Master*/}
          <Route
            exact
            path={"/FrroMaster"}
            element={<Navigate replace to="/FrroMaster/Frro" />}
          />
          {["/FrroMaster/Frro", "FrroMaster/Bonafide"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FrroMaster />
                </Suspense>
              }
            />
          ))}
          <>
            <Route
              exact
              path="/FrroMaster/Bonafide"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FrroBonafied />
                </Suspense>
              }
            />

            <Route
              exact
              path="/Summary"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentIntakeSummary />
                </Suspense>
              }
            />
          </>

          {/* HostelFeeTemplate Master  */}
          <Route
            exact
            path="/HostelFeeTemplateMaster"
            element={
              <Navigate replace to="/HostelFeeTemplateMaster/FeeTemplate" />
            }
          />
          {["/HostelFeeTemplateMaster/FeeTemplate"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <HostelFeeTemplateMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/HostelFeeTemplateMaster/FeeTemplate/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelFeeTemplateForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HostelFeeTemplateMaster/FeeTemplate/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelFeeTemplateForm />
              </Suspense>
            }
          />
          {/*Exit Form Master */}
          <>
            <Route
              exact
              path={"/ExitFormMaster"}
              element={<Navigate replace to="/ExitFormMaster/ExitQuestions" />}
            />
            {["/ExitFormMaster/ExitQuestions", "/ExitFormMaster/ExitForms"].map(
              (path) => (
                <Route
                  exact
                  key={path}
                  path={path}
                  element={
                    <Suspense fallback={<OverlayLoader />}>
                      <ExitFormMaster />
                    </Suspense>
                  }
                />
              )
            )}
            <Route />
            <Route
              exact
              path="/ExitFormMaster/exitquestion/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ExitQuestionsForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/ExitFormMaster/exitquestion/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ExitQuestionsForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/ExitFormMaster/ExitForm/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ExitForm />
                </Suspense>
              }
            />
          </>
          <Route
            exact
            path="/employee-feedback"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeFeedbackIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/employee-feedback/report/:empId/:acYearId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeFeedbackReport />
              </Suspense>
            }
          />
          {/*Student Feedback Master */}
          <Route
            exact
            path="/StudentFeedbackMaster/allow-student-feedback"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AllowStudentFeedback />
              </Suspense>
            }
          />
          <Route
            exact
            path="/submit-student-feedback"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SubmitFeedbackSelect />
              </Suspense>
            }
          />
          <Route
            exact
            path="/submit-student-feedback/:studentId/:empId/:subjectId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SubmitFeedback />
              </Suspense>
            }
          />
          <>
            <Route
              exact
              path={"/StudentFeedbackMaster"}
              element={
                <Navigate replace to="/StudentFeedbackMaster/questions" />
              }
            />
            {[
              "/StudentFeedbackMaster/questions",
              "/StudentFeedbackMaster/feedbackwindow",
              "/StudentFeedbackMaster/freezepercentage",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <StudentFeedbackMaster />
                  </Suspense>
                }
              />
            ))}
            <Route
              exact
              path="/StudentFeedbackMaster/feedbackwindow/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentFedbackWindow />
                </Suspense>
              }
            />
            <Route
              exact
              path="/StudentFeedbackMaster/feedbackwindow/update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentFeedbackWindowUpdate />
                </Suspense>
              }
            />
            <Route
              exact
              path="/StudentFeedbackMaster/freezePercentage/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentFeedbackFreezeCreate />
                </Suspense>
              }
            />
            <Route
              exact
              path="/StudentFeedbackMaster/freezePercentage/update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentFeddbackFreezeUpdate />
                </Suspense>
              }
            />
            <Route
              exact
              path="/StudentFeedbackMaster/Feedback/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentFeedbackForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/StudentFeedbackMaster/Feedback/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentFeedbackForm />
                </Suspense>
              }
            />
          </>
          {/* Allow Student Feedback */}
          <>
            <Route
              exact
              path={"/AllowStudentFeedbackMaster"}
              element={
                <Navigate replace to="/AllowStudentFeedbackMaster/students" />
              }
            />
            <Route
              exact
              path="/AllowStudentFeedbackMaster/students"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AllowStudentFeedbackMaster />
                </Suspense>
              }
            />
            <Route
              exact
              path="/AllowStudentFeedbackMaster/students/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AllowStudentFeedbackForm />
                </Suspense>
              }
            />
          </>

          {/* Student Feedback Report */}
          <>
            <Route
              exact
              path={"/StudentFeedbackReport"}
              element={
                <Navigate replace to="/StudentFeedbackReport/students" />
              }
            />
            <Route
              exact
              path="/StudentFeedbackReport/students"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentFeedbackReportMaster />
                </Suspense>
              }
            />
          </>
          {/* Faculty Feedback Report */}
          <>
            <Route
              exact
              path="/FacultyFeedbackMaster"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyFeedbackMaster />
                </Suspense>
              }
            />
            <Route
              exact
              path="/FacultyFeedbackMaster-inst"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyFeedbackMaster />
                </Suspense>
              }
            />
            <Route
              exact
              path="/FacultyFeedbackMaster-dept"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyFeedbackMaster />
                </Suspense>
              }
            />
            <Route
              exact
              path="/FacultyFeedbackMaster/FacultyFeedbackReport/:empId"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyFeedbackReport />
                </Suspense>
              }
            />
            <Route
              exact
              path="/FacultyFeedbackMaster-inst/FacultyFeedbackReport/:empId"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyFeedbackReport />
                </Suspense>
              }
            />
            <Route
              exact
              path="/FacultyFeedbackMaster-dept/FacultyFeedbackReport/:empId"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyFeedbackReport />
                </Suspense>
              }
            />
            <Route
              exact
              path="/FacultyFeedbackMaster/FacultyFeedbackReportBySection/:empId"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyFeedbackReportBySection />
                </Suspense>
              }
            />
            <Route
              exact
              path="/FacultyFeedbackMaster-inst/FacultyFeedbackReportBySection/:empId"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyFeedbackReportBySection />
                </Suspense>
              }
            />
            <Route
              exact
              path="/FacultyFeedbackMaster-dept/FacultyFeedbackReportBySection/:empId"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyFeedbackReportBySection />
                </Suspense>
              }
            />
            <Route
              exact
              path="/FacultyFeedbackMaster-course"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyFeedbackReportCourseForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/FacultyFeedbackMaster-course-inst"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyFeedbackReportCourseForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/FacultyFeedbackMaster-course-dept"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyFeedbackReportCourseForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/facultyFeedbackMasterCourseIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyFeedbackReportByCourse />
                </Suspense>
              }
            />

            <Route
              exact
              path="/facultyFeedbackMasterCourseIndex-inst"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyFeedbackReportByCourse />
                </Suspense>
              }
            />
            <Route
              exact
              path="/facultyFeedbackMasterCourseIndex-dept"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <FacultyFeedbackReportByCourse />
                </Suspense>
              }
            />
          </>
          <>
            <Route
              exact
              path="/std-uniform-transaction-master"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentUniformTransaction />
                </Suspense>
              }
            />
          </>

          <Route
            exact
            path={"/StudentIdCard"}
            element={<Navigate replace to="/StudentIdCard/Print" />}
          />
          {["/StudentIdCard/Print", "/StudentIdCard/History"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentIdCard />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path={"/HostelstudentIdCard"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelStudentIdCard />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/idcard-photo"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PhotoIdCard />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/StaffIdCard"}
            element={<Navigate replace to="/StaffIdCard/Print" />}
          />
          {["/StaffIdCard/Print", "/StaffIdCard/History"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StaffIdCard />
                </Suspense>
              }
            />
          ))}
          {["/StaffIdCard/Print/view"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ViewStaffIdCard />
                </Suspense>
              }
            />
          ))}
          {["/StudentIdCard/Print/view"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ViewStudentIdCard />
                </Suspense>
              }
            />
          ))}
          {["HostelstudentIdCard/View"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ViewHostelStudentIdCard />
                </Suspense>
              }
            />
          ))}

          {/* Restrict Window  */}
          <Route
            exact
            path={"/RestrictWindow"}
            element={<Navigate replace to="/RestrictWindow/salary" />}
          />
          {["/RestrictWindow/paysliplock", "/RestrictWindow/salary"].map(
            (path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <RestrictWindowMaster />
                  </Suspense>
                }
              />
            )
          )}

          <Route
            exact
            path="/restrictwindow/paysliplock/create"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaysliplockCreate />
              </Suspense>
            }
          />
          <Route
            exact
            path="/restrictwindow/paysliplock/edit/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaysliplockEdit />
              </Suspense>
            }
          />
          <Route
            exact
            path="/paysliplockIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaysliplockIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryLockForm/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryLockForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryLockForm/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryLockForm />
              </Suspense>
            }
          />

          {/* Salary Increment */}
          <>
            <Route
              exact
              path="/SalaryIncrementEmpList"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <SalaryIncrementInitIndex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/SalaryBudgetCreate"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <SalaryBudgetCreate />
                </Suspense>
              }
            />

            <Route
              exact
              path="/BudgetCreateCsv"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BudgetCreateCsv />
                </Suspense>
              }
            />

            <Route
              exact
              path="/IncrementIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <IncrementIndex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/IncrementFinalizedList"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <IncrementFinalizedList />
                </Suspense>
              }
            />
            <Route
              exact
              path="/IncrementApproveList"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <IncrementApproveList />
                </Suspense>
              }
            />

            <Route
              exact
              path="/BudgetCreatedIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BudgetIncrementIndex />
                </Suspense>
              }
            />
          </>
          {/* Vacation Leave */}
          <Route
            exact
            path="/VacationLeaveIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VacationLeaveIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/VacationLeaveForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VacationLeaveForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcerpAmountIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AcerpAmountIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcerpAmountForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AcerpAmountForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ThirdForceFeeForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ThirdForceFeeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ThirdForceFeeIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ThirdForceFeeIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HostelWaiverForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelWaiverForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HostelWaiverIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HostelWaiverIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/BonafideForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AcerpBonafideForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/BonafideIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AcerpBonafideIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/BonafideView"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ViewBonafide />
              </Suspense>
            }
          />
          <Route
            exact
            path="/permission-form"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PermissionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/permission-form-partfee"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PermissionFormPartFee />
              </Suspense>
            }
          />
          <Route
            exact
            path="/permission-index-partfee"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PermissionIndexPartFee />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/permission"}
            element={<Navigate replace to="/permission-index" />}
          />
          {["/permission-index", "/permission-fineconcession"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <PermissionIndex />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/budget-filter"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BudgetFilter />
              </Suspense>
            }
          />
          <Route
            exact
            path="/budget-form"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BudgetForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/budget-index"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BudgetIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/external-exam-mark-form"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ExternalExamMarkForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/external-exam-mark"
            element={<Navigate replace to="/external-exam-mark-index" />}
          />
          {["/external-exam-mark-index", "/external-exam-mark-report"].map(
            (path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <ExamIndex />
                  </Suspense>
                }
              />
            )
          )}
          <Route
            exact
            path="/external-exam-add-mark"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ExternalExamAddMark />
              </Suspense>
            }
          />
          <Route
            exact
            path="/fine-slab-index"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FineSlabIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/fine-slab-form"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FineSlabForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/direct-demand-index"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DirectDemandIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/direct-payment"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DirectPaymentIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/directpay-demand-form"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DirectPayDemandForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/direct-demand-user"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DirectPayDemandUserIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/salary-sheet-master"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalarySheetMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/laptop-issue"}
            element={<Navigate replace to="/laptop-issue-index" />}
          />
          {["/laptop-issue-index", "/laptop-issue-history"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <LaptopIssueIndex />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/student-whatsapp"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SendWhatsApp />
              </Suspense>
            }
          />
          <Route
            exact
            path="/employee-report"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeReport />
              </Suspense>
            }
          />
          <Route
            exact
            path="/employee-report-view"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeReportView />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/laptop-issue-form"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LaptopIssueForm />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/Accounts-ledger"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VendorDetailMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/Accounts-ledger-monthly-detail"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VendorMonthlyDetails />
              </Suspense>
            }
          />
           <Route
            exact
            path={"/Accounts-ledger-monthly-institute-transaction"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LedgerMonthlyInstTransaction />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/Accounts-ledger-day-transaction"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LedgerDayTransaction />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/Accounts-ledger-day-transaction-debit"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LedgerDebitDayTransaction />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/Accounts-ledger-day-credit-transaction"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LedgerDayCreditTransaction />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/vendor-day-transaction-debit"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VendorDayDebitTransaction />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/vendor-day-transaction-credit"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VendorDayCreditTransaction />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/ledger-inflow-day-transaction-credit"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InflowDayCreditTransaction />
              </Suspense>
            }
          />
           <Route
            exact
            path={"/ledger-expenses-day-transaction-credit"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ExpensesDayCreditTransaction />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/ledger-assets-day-transaction-credit"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AssetsAndExpenditureCreditDayTransaction />
              </Suspense>
            }
          />
           <Route
            exact
            path={"/ledger-assets-day-transaction-debit"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AssetsAndExpenditureDebitDayTransaction />
              </Suspense>
            }
          />
           <Route
            exact
            path={"/ledger-expenditure-day-transaction-credit"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AssetsAndExpenditureCreditDayTransaction />
              </Suspense>
            }
          />
           <Route
            exact
            path={"/ledger-expenditure-day-transaction-debit"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AssetsAndExpenditureDebitDayTransaction />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/bank-balance"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BankGroupBankBalanceMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/institute-bank-balance"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InstituteBankBalance />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/institute-brs-transaction"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BRSTransactionDetail />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/brs-cheque-issued-not-debit-detail"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BRSChqNotIssuedDebitedDetail />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/brs-cheque-issued-not-credit-detail"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BRSChqDepositedNotCreditedDetail />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/brs-direct-credit-to-bank-detail"}
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BRSDirectCreditedToBankDetail />
              </Suspense>
            }
          />

          <Route
            exact
            path="/lms"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LMS />
              </Suspense>
            }
          />
          {/* RazarPay Settlements */}
          <Route
            exact
            path={"/razorpay-settlement-master"}
            element={
              <Navigate
                replace
                to="/razorpay-settlement-master/all-settlement"
              />
            }
          />
          {[
            "/razorpay-settlement-master/all-settlement",
            "razorpay-settlement-master/pending-settlement",
          ].map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <RazorPaySettlementMaster />
                </Suspense>
              }
            />
          ))}

          <Route
            exact
            path="/razorpay-settlement-master/all-settlement/:settlementId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RazorPaySettlementDetail />
              </Suspense>
            }
          />
          <Route
            exact
            path="/razorpay-settlement-master/settlement-receipt/:settlementId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RazorPayReceiptDetail />
              </Suspense>
            }
          />
          <Route
            exact
            path="/razorpay-settlement-master/pending-settlement/:settlementId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RazorPayPendingSettlementDetail />
              </Suspense>
            }
          />
        </Route>

        <Route
          exact
          path="/Login"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <Login />
            </Suspense>
          }
        ></Route>

        <Route
          exact
          path="/ForgotPassword"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <ForgotPassword />
            </Suspense>
          }
        />

        <Route
          exact
          path="/ResetPassword"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <ResetPassword />
            </Suspense>
          }
        />

        {/* Candidate Registration Ends  */}
        <Route
          exact
          path="/ExternalPayment/:id"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <ExternalPaymentForm />
            </Suspense>
          }
        />
        <Route
          exact
          path="/ExternalPayment/:id/:orderId"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <ExternalPaymentForm />
            </Suspense>
          }
        />

        <Route
          exact
          path="/ExternalPayment/:id/:orderId/:type"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <ExternalPaymentForm />
            </Suspense>
          }
        />

        <Route
          exact
          path="/ExternalPaymentSuccessPrint/:id"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <ExternalPaymentSuccessPrint />
            </Suspense>
          }
        />

        <Route
          exact
          path="/ExternalPaymentSuccessPrint/:id/:type"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <ExternalPaymentSuccessPrint />
            </Suspense>
          }
        />
        <Route
          exact
          path="/registration-payment/:id"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <CandidateRegistrationPayment />
            </Suspense>
          }
        />
        <Route
          exact
          path="/offer-acceptance/:id"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <CandidateAcceptanceForm />
            </Suspense>
          }
        />
        <Route
          exact
          path="/candidate-razor-pay"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <CandidateRazorPay />
            </Suspense>
          }
        />
        <Route
          exact
          path="/health"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <Health />
            </Suspense>
          }
        />

        <Route
          exact
          path="/student-external-pay"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <StudentExternalPayment />
            </Suspense>
          }
        />

        <Route
          exact
          path="/payment-status"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <PaymentSuccessForm />
            </Suspense>
          }
        />

        <Route
          exact
          path="/student-college-payment"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <StudentWebView />
            </Suspense>
          }
        />
        <Route
          exact
          path="/uniform-fee-payment"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <StudentUniformWebView />
            </Suspense>
          }
        />
        <Route
          exact
          path="/student-bulk-payment"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <StudentBulkWebView />
            </Suspense>
          }
        />
        <Route
          exact
          path="/student-exam-payment"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <StudentExamWebView />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

export default RouteConfig;
