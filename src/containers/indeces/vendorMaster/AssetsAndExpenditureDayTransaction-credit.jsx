import { useState, useEffect, lazy } from "react";
import { Tabs, Tab, Breadcrumbs, Box, Typography } from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";
import moment from "moment";

const JournalVoucher = lazy(() => import("./vendorDayTransaction-credit"));

const FeeReceipt = lazy(() => import("./AssetsAndExpenditureFeeReceipt")
);

const breadcrumbStyles = makeStyles((theme) => ({
    breadcrumbsContainer: {
        position: "relative",
        marginBottom: 10,
        width: "fit-content",
        zIndex: theme.zIndex.drawer - 1,
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: "none",
        cursor: "pointer",
        "&:hover": { textDecoration: "underline" },
    },
}));

const tabsData = [
    { label: "Journal", value: "journal", component: JournalVoucher },
    { label: "Fee Receipt", value: "feeReceipt", component: FeeReceipt },
];

const AssetsAndExpenditureCreditDayTransaction = () => {
    const [breadCrumbs, setBreadCrumbs] = useState([])
    const setCrumbs = useBreadcrumbs();
    const navigate = useNavigate();
    const { pathname, state: queryValues } = useLocation();

    const initialTab =
        tabsData.find((tab) => pathname.includes(tab.value))?.value || "journal";
    const [tab, setTab] = useState(initialTab);

    useEffect(() => {
        setTab(
            tabsData.find((tab) => pathname.includes(tab.value))?.value || "journal"
        );
        if (queryValues?.isBRSTrue) {
            setBreadCrumbs([
                { name: "Bank Balance", link: "/bank-balance" },
                { name: "BRS", link: "/institute-bank-balance", state: { bankGroupId: queryValues?.bankGroupId } },
                { name: "Monthly Transaction", link: "/Accounts-ledger-monthly-detail", state: queryValues },
                { name: 'Daily Summary', link: "/Accounts-ledger-day-transaction", state: queryValues },
                { name: `${queryValues?.voucherHeadName || ""} FY ${queryValues?.fcYear} as on ${moment().format('DD-MMMM-YYYY')}` },
            ]);
        } else {
            setBreadCrumbs([
                { name: "Ledger", link: "/Accounts-ledger", state: queryValues },
                { name: "Monthly Transaction", link: "/Accounts-ledger-monthly-detail", state: queryValues },
                { name: 'Daily Summary', link: "/Accounts-ledger-day-transaction", state: queryValues },
                { name: `${queryValues?.voucherHeadName || ""} FY ${queryValues?.fcYear} as on ${moment().format('DD-MMMM-YYYY')}` },
            ])
        }
        setCrumbs([]);
    }, [pathname || tab]);

    const handleChange = (event, newValue) => {
        setTab(newValue);
        navigate(`/ledger-assets-day-transaction-credit`, { state: queryValues });
    };

    return (
        <Box>
            <CustomBreadCrumbs crumbs={breadCrumbs} />
            <Tabs value={tab} onChange={handleChange}>
                {tabsData.map((tabItem) => (
                    <Tab
                        key={tabItem.value}
                        value={tabItem.value}
                        label={tabItem.label}
                    />
                ))}
            </Tabs>
            {tabsData.map((tabItem) => (
                <div key={tabItem.value}>
                    {tab === tabItem.value && <tabItem.component />}
                </div>
            ))}
        </Box>
    );
}

export default AssetsAndExpenditureCreditDayTransaction;

const CustomBreadCrumbs = ({ crumbs = [] }) => {
    const navigate = useNavigate()
    const classes = breadcrumbStyles()
    if (crumbs.length <= 0) return null

    return (
        <Box className={classes.breadcrumbsContainer}>
            <Breadcrumbs
                style={{ fontSize: "1.15rem" }}
                separator={<NavigateNextIcon fontSize="small" />}
            >
                {crumbs?.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1;
                    return (
                        <span key={index}>
                            {!isLast ? (
                                <Typography
                                    onClick={() => navigate(crumb.link, { state: crumb.state })}
                                    className={classes.link}
                                    fontSize="inherit"
                                >
                                    {crumb.name}
                                </Typography>
                            ) : (
                                <Typography color="text.primary" fontSize="inherit">
                                    {crumb.name}
                                </Typography>
                            )}
                        </span>
                    );
                })}
            </Breadcrumbs>
        </Box>
    )
}

