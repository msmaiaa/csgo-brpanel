import { createStyles, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(
  createStyles({
    cardContainer: {
      backgroundColor: "white",
      borderRadius: "10px",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 0 35px 0 rgba(154, 161, 171, 0.15)",
    },
    cardInside: {
      margin: 25,
      width: "100%",
    },
  })
);

export default useStyles;
