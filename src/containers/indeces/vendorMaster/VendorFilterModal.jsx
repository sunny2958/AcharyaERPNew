import React, { useState } from "react";
import {
    Box,
    Button,
    Modal,
    TextField,
    MenuItem,
    Typography
} from "@mui/material";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4
};


const VendorFilterModal = ({ filters, setFilters, selectedField, setSelectedField }) => {

    const handleClose = () => {
        console.log("handleClose")
    };

    const handleApplyFilter = () => {
        console.log("Applied Filters:", filters);
    };

    return (
        <Box sx={{
            p: 2,
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            width: '100%',
            border: '1px solid #e0e0e0'
        }}>
            <TextField
                select
                label="Filter by"
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                fullWidth
                size="small"
                sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        backgroundColor: '#f9f9f9'
                    }
                }}
            >
                {["Ledger", "Voucher Type", "Bill No", "Narration", "Ledger Amount", "Date"].map((field) => (
                    <MenuItem key={field} value={field} sx={{ fontSize: '0.85rem' }}>{field}</MenuItem>
                ))}
            </TextField>
            <Box sx={{ mb: 2 }}>
                {selectedField === "Ledger" && (
                    <TextField
                        label="Ledger name"
                        fullWidth
                        size="small"
                        value={filters.ledger}
                        onChange={(e) => setFilters({ ...filters, ledger: e.target.value })}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '6px',
                                backgroundColor: '#f9f9f9'
                            }
                        }}
                    />
                )}

                {selectedField === "Ledger Amount" && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            select
                            label="Type"
                            value={filters.ledgerAmountType}
                            onChange={(e) => setFilters({ ...filters, ledgerAmountType: e.target.value })}
                            size="small"
                            sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '6px',
                                    backgroundColor: '#f9f9f9'
                                }
                            }}
                        >
                            {["Credit", "Debit"].map((type) => (
                                <MenuItem key={type} value={type} sx={{ fontSize: '0.85rem' }}>{type}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Condition"
                            value={filters.ledgerCondition}
                            onChange={(e) => setFilters({ ...filters, ledgerCondition: e.target.value })}
                            size="small"
                            sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '6px',
                                    backgroundColor: '#f9f9f9'
                                }
                            }}
                        >
                            {["greater than", "less than", "equal to"].map((c) => (
                                <MenuItem key={c} value={c} sx={{ fontSize: '0.85rem' }}>{c}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Amount"
                            type="number"
                            value={filters.ledgerAmount}
                            onChange={(e) => setFilters({ ...filters, ledgerAmount: e.target.value })}
                            size="small"
                            sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '6px',
                                    backgroundColor: '#f9f9f9'
                                }
                            }}
                        />
                    </Box>
                )}

                {selectedField === "Narration" && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            select
                            label="Condition"
                            value={filters.narrationCondition || ""}
                            onChange={(e) => setFilters({ ...filters, narrationCondition: e.target.value })}
                            size="small"
                            sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '6px',
                                    backgroundColor: '#f9f9f9'
                                }
                            }}
                        >
                            {["contains", "excludes", "equals", "ends with"].map((c) => (
                                <MenuItem key={c} value={c} sx={{ fontSize: '0.85rem' }}>{c}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Text"
                            value={filters.narration}
                            onChange={(e) => setFilters({ ...filters, narration: e.target.value })}
                            size="small"
                            sx={{
                                flex: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '6px',
                                    backgroundColor: '#f9f9f9'
                                }
                            }}
                        />
                    </Box>
                )}

                {selectedField === "Date" && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            select
                            label="Range"
                            value={filters.dateType}
                            onChange={(e) => setFilters({ ...filters, dateType: e.target.value })}
                            size="small"
                            sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '6px',
                                    backgroundColor: '#f9f9f9'
                                }
                            }}
                        >
                            {["Date", "Month", "Year"].map((t) => (
                                <MenuItem key={t} value={t} sx={{ fontSize: '0.85rem' }}>{t}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label={filters.dateType === "Month" ? "MM-YYYY" :
                                filters.dateType === "Year" ? "YYYY" : "DD-MM-YYYY"}
                            value={filters.date}
                            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                            size="small"
                            sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '6px',
                                    backgroundColor: '#f9f9f9'
                                }
                            }}
                        />
                    </Box>
                )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                    variant="outlined"
                    size="small"
                    sx={{
                        borderRadius: '4px',
                        textTransform: 'none',
                        fontSize: '0.85rem',
                        px: 2,
                        py: 0.5
                    }}
                >
                    Clear
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    sx={{
                        borderRadius: '4px',
                        textTransform: 'none',
                        fontSize: '0.85rem',
                        px: 2,
                        py: 0.5,
                        boxShadow: 'none'
                    }}
                >
                    Apply
                </Button>
            </Box>
        </Box>
    )
}

export default VendorFilterModal