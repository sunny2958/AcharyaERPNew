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

export default function AdmissionReportDaily() {
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
            { name: "Academic Overview" },
        ]);
        fetchAdmissionData();
    }, []);

    const fetchAdmissionData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/admissionCategoryReport/getDatewiseAdmissionReport`);
            updateTableAndChart(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const updateTableAndChart = (data) => {
        const years = [
            data.prevYear[0].prevAcademicYear,
            data.currentYear[0].currentAcademicYear
        ];

        let institutesSet = new Set();
        data.prevYear.slice(1).forEach(item => institutesSet.add(item.school_name_short));
        data.currentYear.slice(1).forEach(item => institutesSet.add(item.school_name_short));
        const institutes = Array.from(institutesSet);

        let yearData = {};
        data.prevYear.slice(1).forEach(item => {
            if (!yearData[years[0]]) yearData[years[0]] = {};
            yearData[years[0]][item.school_name_short] = item.admitted;
        });
        data.currentYear.slice(1).forEach(item => {
            if (!yearData[years[1]]) yearData[years[1]] = {};
            yearData[years[1]][item.school_name_short] = item.admitted;
        });

        const rows = [];
        let totals = { id: "Total", year: "Total" };
        institutes.forEach(inst => totals[inst] = 0);

        let i = 0;
        for (const year of years) {
            let row = { id: i++, year };
            institutes.forEach(inst => {
                row[inst] = yearData[year]?.[inst] || 0;
                totals[inst] += row[inst];
            });
            row.Total = institutes.reduce((acc, inst) => acc + (row[inst] || 0), 0);
            rows.push(row);
        }
        totals.Total = institutes.reduce((acc, inst) => acc + totals[inst], 0);
        rows.push(totals);

        setTableColumns([
            { field: "year", headerName: "Year", flex: 1, headerClassName: "header-bg" },
            ...institutes.map(inst => ({
                field: inst,
                headerName: inst,
                type: "number",
                flex: 1,
                headerClassName: "header-bg",
                align: 'center'
            })),
            { field: "Total", headerName: "Total", type: "number", flex: 1, headerClassName: "header-bg", cellClassName: "last-column", align: 'center' }
        ]);
        setTableRows(rows);

        const colors = ["#4e79a7", "#e15759"];
        const datasets = years.map((year, idx) => ({
            name: year,
            data: institutes.map(inst => yearData[year]?.[inst] || 0),
            color: colors[idx % colors.length]
        }));

        setChartData({
            categories: institutes,
            series: datasets
        });
    };

    const buildHighChartOptions = () => {
        const isPie = selectedChart === "pie";
        return {
            chart: {
                type: selectedChart,
                backgroundColor: "#f9f9f9",
                style: { fontFamily: "'Roboto', sans-serif" }
            },
            title: {
                text: "Admission Comparison Statistics",
                style: { color: "#333" }
            },
            xAxis: !isPie ? {
                categories: chartData.categories || [],
                labels: { style: { color: "#333" } },
                crosshair: true
            } : undefined,
            yAxis: !isPie ? {
                min: 0,
                title: { text: "Admissions Count", style: { color: "#333" } },
                labels: { style: { color: "#333" } }
            } : undefined,
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
                itemStyle: { color: '#333' }
            },
            plotOptions: {
                line: {
                    dataLabels: { enabled: true, style: { color: "#000", textOutline: "1px contrast" } },
                    marker: { radius: 5, lineColor: "#fff", lineWidth: 1 }
                },
                column: {
                    dataLabels: { enabled: true, style: { color: "#000", textOutline: "1px contrast" } }
                },
                bar: {
                    dataLabels: { enabled: true, style: { color: "#000", textOutline: "1px contrast" } }
                },
                pie: {
                    allowPointSelect: true,
                    cursor: "pointer",
                    dataLabels: {
                        enabled: true,
                        format: "<b>{point.name}</b>: {point.y}",
                        color: "#000"
                    }
                }
            },
            credits: { enabled: false },
            series: isPie
                ? [
                    {
                        name: "Total Admissions",
                        // colorByPoint: true,
                        data: chartData.series?.map((seriesItem, i) => ({
                            name: seriesItem.name,
                            y: seriesItem.data.reduce((sum, val) => sum + val, 0),
                            color: seriesItem.color
                        }))
                    }
                ]
                : (chartData.series || [])
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
                            getRowId={row => row.id}
                            isRowSelectable={(params) => params?.row?.year !== "Total"}
                            getRowClassName={(params) => params?.row?.year === "Total" ? "last-row" : ""}
                        />
                    </Grid>
                ) : (
                    <Box p={3}>
                        {chartData.series && <HighchartsReact highcharts={Highcharts} options={buildHighChartOptions()} />}
                    </Box>
                )}
            </Grid>
        </Grid>
    );
}
