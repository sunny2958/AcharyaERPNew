import React from "react";
import {
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Card,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Hotel";
import { makeStyles } from "@mui/styles";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
    textAlign: "center",
  },
  blockContainer: {
    marginBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  floorBox: {
    border: "2px solid #ccc",
    borderRadius: 5,
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    padding: theme.spacing(1.5),
  },
  roomCard: {
    borderRadius: 8,
    border: "2px solid #ccc",
    padding: theme.spacing(0.5),
    textAlign: "center",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    willChange: "transform",
  },
}));

const getStatusColor = (status) => {
  switch (status) {
    case "Vacant":
      return "#32CD32";
    case "Occupied":
      return "#F08080";
    case "Assigned":
      return "#87CEEB";
    case "Blocked":
      return "#FFD700"; // brighter than FFDE21
    default:
      return "#32CD32";
  }
};

const AllBedDetails = ({ bedDetails, selectedValues, getBedDetials }) => {
  const classes = useStyles();

  return (
    <Grid container direction="column">
      <Grid item className={classes.blockContainer}>
        {(() => {
          const sortedFloors = Object.entries(bedDetails).sort(
            ([aFloor], [bFloor]) => aFloor.localeCompare(bFloor)
          );

          const lastFloor = sortedFloors.pop();
          if (lastFloor) sortedFloors.unshift(lastFloor);

          return sortedFloors.map(([floorName, rooms]) => (
            <Box key={floorName} className={classes.floorBox}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  borderBottom: "2px solid #1976d2",
                  paddingBottom: 4,
                  mb: 1,
                }}
              >
                {floorName}
              </Typography>

              <Grid container spacing={1}>
                {Object.entries(rooms)
                  .sort(([aRoom], [bRoom]) => aRoom.localeCompare(bRoom))
                  .map(([roomName, beds]) => (
                    <Grid item key={roomName}>
                      <Card
                        className={classes.roomCard}
                        style={{
                          width: 80,
                          height: !selectedValues?.occupancyType
                            ? 110
                            : selectedValues?.occupancyType <= 2
                              ? 80
                              : selectedValues?.occupancyType <= 4
                                ? 90
                                : 110,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                          e.currentTarget.style.boxShadow =
                            "0px 4px 12px rgba(0, 0, 0, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          color="black"
                          sx={{ fontWeight: "bold", fontSize: 12 }}
                        >
                          {roomName}
                        </Typography>

                        <Grid
                          container
                          justifyContent={
                            selectedValues?.occupancyType === 1 ? "center" : ""
                          }
                        >
                          {beds
                            .sort((a, b) => a.bedName.localeCompare(b.bedName))
                            .slice(0, 6)
                            .map((bed) => (
                              <Grid item key={bed.hostelBedId}>
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Tooltip
                                    arrow
                                    title={
                                      <React.Fragment>
                                        <Typography
                                          variant="body2"
                                          sx={{ fontWeight: "bold" }}
                                        >
                                          {bed.bedName}
                                        </Typography>
                                        {["Blocked", "Occupied","Assigned"].includes(
                                          bed.bedStatus
                                        ) && (
                                          <>
                                            <Typography variant="body2">
                                              Name: {bed.studentName}
                                            </Typography>
                                            <Typography variant="body2">
                                              AUID: {bed.auid}
                                            </Typography>
                                            {bed.BlockedDate && (
                                              <Typography variant="body2">
                                                Blocked Date:{" "}
                                                {moment(
                                                  new Date(bed.BlockedDate)
                                                ).format("DD/MM/YYYY")}
                                              </Typography>
                                            )}
                                          </>
                                        )}
                                      </React.Fragment>
                                    }
                                  >
                                    <IconButton size="small">
                                      <BedIcon
                                        style={{
                                          color: getStatusColor(bed.bedStatus),
                                          fontSize: 18,
                                          marginLeft:
                                            selectedValues?.occupancyType !== 1
                                              ? 6
                                              : 0,
                                        }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Grid>
                            ))}
                        </Grid>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          ));
        })()}
      </Grid>
    </Grid>
  );
};

export default AllBedDetails;
