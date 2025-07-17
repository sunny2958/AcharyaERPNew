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
import axios from "../../../../services/Api.js";
import GridIndex from "../../../../components/GridIndex.jsx";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs.js";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { IOSSwitch } from "../../chartsDashboard/IOSSwitch.js";

const ChartOptions = [
    { value: "column", label: "Column" },
    { value: "bar", label: "Bar" },
    { value: "line", label: "Line" },
    { value: "pie", label: "Pie" },
];

export default function FinanceReport() {
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
            { name: "Finance" },
        ]);
        getFinanceReportData();
    }, []);

    const getFinanceReportData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`api/admissionCategoryReport/getBankReport`);
            updateTableAndChart(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const updateTableAndChart = (data) => {
        const sortedData = [...data].sort((a, b) => a.month_number - b.month_number);
        const months = sortedData.map(item => item.month_name);
        const monthAmounts = Object.fromEntries(
            sortedData.map(item => [item.month_name, parseFloat(item.totalAmount.replace(" cr.", "")) || 0])
        );

        const amountRow = { id: 1, type: "Amount" };
        months.forEach(month => {
            amountRow[month] = monthAmounts[month];
        });
        amountRow.Total = months.reduce((sum, month) => sum + amountRow[month], 0);

        setTableRows([amountRow]);

        setTableColumns([
            { field: "type", headerName: "Type", flex: 1, headerClassName: "header-bg" },
            ...months.map(month => ({
                field: month,
                headerName: month,
                type: "number",
                flex: 1,
                headerClassName: "header-bg",
                align: "center"
            })),
            { field: "Total", headerName: "Total", type: "number", flex: 1, headerClassName: "header-bg", cellClassName: "last-column", align: "center" }
        ]);

        setChartData({
            categories: months,
            data: months.map(month => monthAmounts[month])
        });
    };

    const getChartColors = (length) => {
        const baseColors = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b", "#858796"];
        const colors = [];
        for (let i = 0; i < length; i++) {
            colors.push(baseColors[i % baseColors.length]);
        }
        return colors;
    };

    const buildHighChartOptions = () => {
        const pointColors = getChartColors(chartData.data?.length || 0);
        const defaultColor = "#4e73df";
        const markerBorderColor = "#e74a3b";

        return {
            chart: {
                type: selectedChart,
                backgroundColor: "#f9f9f9",
                style: { fontFamily: "'Roboto', sans-serif" }
            },
            title: {
                text: "Monthly Revenue",
                style: { color: "#333" }
            },
            xAxis: selectedChart !== "pie" ? {
                categories: chartData.categories || [],
                labels: { style: { color: "#333" } },
                crosshair: true
            } : undefined,
            yAxis: selectedChart !== "pie" ? {
                min: 0,
                title: { text: "Amount (cr.)", style: { color: "#333" } },
                labels: { style: { color: "#333" } }
            } : undefined,
            // tooltip: {
            //     shared: true,
            //     useHTML: true,
            //     backgroundColor: "#f8f9fa",
            //     borderColor: "#dee2e6",
            //     style: { color: "#333" },
            //     headerFormat: "<b>{point.key}</b><table>",
            //     pointFormat: "<tr><td style='color:{series.color}'>{series.name}: </td>" +
            //                  "<td style='text-align:right'><b>{point.y}</b></td></tr>",
            //     footerFormat: "</table>"
            // },
            tooltip: {
                shared: true,
                backgroundColor: "rgba(255,255,255,0.96)",
                borderWidth: 1,
                borderColor: "#e2e8f0",
                borderRadius: "6px",
                shadow: true,
                style: {
                    color: "#2d3748",
                    fontSize: "13px",
                    padding: "12px",
                    fontWeight: "500"
                },
                headerFormat: '<span style="font-size: 14px; font-weight: 600; color: #2d3748; margin-bottom: 8px; display: block">{point.key}</span>',
                pointFormat: '<div style="display: flex; align-items: center; margin: 4px 0;"><span style="background-color:{point.color}; width: 12px; height: 12px; border-radius: 2px; display: inline-block; margin-right: 8px;"></span><span style="font-weight: 500;">{series.name}:</span> <span style="font-weight: 700; margin-left: auto;">{point.y}</span></div>',
                useHTML: true
            },
            legend: {
                itemStyle: { color: "#333" }
            },
            plotOptions: {
                column: { dataLabels: { enabled: true, style: { color: "#333" } } },
                bar: { dataLabels: { enabled: true, style: { color: "#333" } } },
                line: {
                    dataLabels: { enabled: true, style: { color: "#333" } },
                    marker: {
                        radius: 4,
                        lineColor: markerBorderColor,
                        lineWidth: 2,
                        fillColor: "#fff"
                    }
                },
                pie: {
                    allowPointSelect: true,
                    cursor: "pointer",
                    dataLabels: {
                        enabled: true,
                        format: "<b>{point.name}</b>: {point.y}",
                        style: { color: "#333" }
                    }
                }
            },
            credits: { enabled: false },
            colors: selectedChart === "pie" ? pointColors : [defaultColor],
            series: selectedChart === "pie"
                ? [{
                    name: "Amount",
                    // colorByPoint: true,
                    data: chartData.categories?.map((month, i) => ({
                        name: month,
                        y: chartData.data[i],
                        color: pointColors[i]
                    }))
                }]
                : [{
                    name: "Amount (cr.)",
                    data: chartData.data,
                    color: defaultColor,
                    ...(selectedChart === "line" && {
                        marker: {
                            lineColor: markerBorderColor,
                            lineWidth: 2,
                            fillColor: "#fff"
                        }
                    })
                }]
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
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        pt={1}
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#376a7d',
                                color: '#fff',
                                fontWeight: 'bold',
                            },
                            '& .last-row': {
                                fontWeight: 'bold',
                                backgroundColor: '#376a7d !important',
                                color: '#fff'
                            },
                            '& .last-row:hover': {
                                backgroundColor: '#376a7d !important',
                                color: '#fff'
                            },
                            '& .last-column': {
                                fontWeight: 'bold'
                            },
                            '& .header-bg': {
                                fontWeight: 'bold',
                                backgroundColor: '#376a7d',
                                color: '#fff'
                            }
                        }}
                    >
                        <GridIndex
                            rows={tableRows}
                            columns={tableColumns}
                            loading={loading}
                            getRowId={(row) => row.id}
                            isRowSelectable={() => false}
                        />
                    </Grid>
                ) : (
                    <Box p={3}>
                        {chartData?.data && <HighchartsReact highcharts={Highcharts} options={buildHighChartOptions()} />}
                    </Box>
                )}
            </Grid>
        </Grid>
    );
}

