import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import GridIndex from "../../../../components/GridIndex.jsx";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs.js";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { IOSSwitch } from "../../chartsDashboard/IOSSwitch.js";
import axiosNoToken from "../../../../services/ApiWithoutToken.js";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";

const ChartOptions = [
    { value: "column", label: "Column" },
    { value: "bar", label: "Bar" },
    { value: "line", label: "Line" },
    { value: "pie", label: "Pie" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function BankGroupReport() {
    const [tableColumns, setTableColumns] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [chartData, setChartData] = useState({});
    const [selectedChart, setSelectedChart] = useState("line");
    const [isTableView, setIsTableView] = useState(true);
    const [loading, setLoading] = useState(false);
    const setCrumbs = useBreadcrumbs();

    useEffect(() => {
        setCrumbs([
            { name: "MIS-Dashboard", link: "/mis-dashboard" },
            { name: "Bank Balance" },
        ]);
        fetchBankBalanceData();
    }, []);

    const fetchBankBalanceData = async () => {
        setLoading(true);
        try {
            const response = await axiosNoToken.get(`/api/admissionCategoryReport/getBankReportGroupwise`);
            const data = response?.data?.data || [];
            updateTableAndChart(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const updateTableAndChart = (data) => {
        const grouped = {};
        const bankGroups = new Set();

        data.forEach(item => {
            const group = item.bank_group_name;
            const month = item.month_name;
            const balance = item.bank_balance || 0;

            if (!grouped[group]) {
                grouped[group] = { bankGroup: group };
                MONTHS.forEach(m => grouped[group][m] = 0); // Default to 0
            }

            grouped[group][month] = balance;
            bankGroups.add(group);
        });

        const rows = Object.values(grouped);
        const totalRow = { bankGroup: "Total" };
        MONTHS.forEach(month => {
            const total = rows.reduce((sum, row) => sum + (row[month] || 0), 0);
            totalRow[month] = total;
        });
        rows.push(totalRow);

        const columns = [
            {
                field: "bankGroup",
                headerName: "Bank Group Name",
                flex: 1,
                headerClassName: "header-bg",
                align: "center"
            },
            ...MONTHS.map(month => ({
                field: month,
                headerName: month,
                flex: 1,
                type: "number",
                align: "center",
                headerAlign: "center",
                headerClassName: "header-bg"
            }))
        ];

        setTableColumns(columns);
        setTableRows(rows);

        const series = [...bankGroups].map(group => ({
            name: group,
            data: MONTHS.map(month => grouped[group][month] || 0)
        }));

        setChartData({
            categories: MONTHS,
            series
        });
    };

    const buildHighChartOptions = () => {
        if (!chartData || !chartData.categories || !chartData.series) return {};

        const isPie = selectedChart === "pie";

        if (isPie) {
            const pieData = chartData.series.map(group => ({
                name: group.name,
                y: group.data.reduce((a, b) => a + b, 0)
            }));

            return {
                chart: { type: "pie" },
                title: { text: "Total Balance by Bank Group" },
                series: [{
                    name: "Total",
                    data: pieData
                }],
                credits: { enabled: false }
            };
        }

        return {
            chart: {
                type: selectedChart
            },
            title: {
                text: "Monthly Bank Group Balance"
            },
            xAxis: {
                categories: chartData.categories,
                title: { text: "Months" }
            },
            yAxis: {
                title: { text: "Balance (₹)" }
            },
            tooltip: {
                shared: true
            },
            series: chartData.series,
            credits: { enabled: false }
        };
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                    <Grid item xs={12} sm="auto">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body1">Chart view</Typography>
                            <FormControlLabel
                                control={
                                    <IOSSwitch
                                        ischecked={isTableView}
                                        handlechange={() => setIsTableView(!isTableView)}
                                    />
                                }
                                label="Table view"
                                labelPlacement="end"
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Chart Type</InputLabel>
                            <Select
                                size="small"
                                value={selectedChart}
                                label="Chart Type"
                                onChange={(e) => setSelectedChart(e.target.value)}
                            >
                                {ChartOptions.map((obj, index) => (
                                    <MenuItem key={index} value={obj.value}>{obj.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                {isTableView ? (
                    <Box component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {tableColumns.map((col, idx) => (
                                            <TableCell
                                                key={idx}
                                                align="center"
                                                sx={{
                                                    backgroundColor: "#376a7d",
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                    border: "1px solid #ccc"
                                                }}
                                            >
                                                {col.headerName}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableRows.map((row, rowIdx) => {
                                        const isTotalRow = row.bankGroup === "Total";
                                        return (
                                            <TableRow
                                                key={rowIdx}
                                                sx={{
                                                    backgroundColor: isTotalRow ? "#376a7d" : "#fff",
                                                    color: isTotalRow ? "#fff" : "#000",
                                                    fontWeight: isTotalRow ? "bold" : "normal"
                                                }}
                                            >
                                                {tableColumns.map((col, colIdx) => (
                                                    <TableCell
                                                        key={colIdx}
                                                        align="center"
                                                        sx={{
                                                            border: "1px solid #ccc",
                                                            color: isTotalRow ? "#fff" : "#000",
                                                            fontWeight: isTotalRow ? "bold" : "normal"
                                                        }}
                                                    >
                                                        {row[col.field] !== null && row[col.field] !== undefined
                                                            ? row[col.field]
                                                            : "-"}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ) : (
                    <Box p={3}>
                        {chartData?.categories?.length > 0 && <HighchartsReact highcharts={Highcharts} options={buildHighChartOptions()} />}
                    </Box>
                )}
            </Grid>
        </Grid>
    );
}
