import useStyles from "./styles";

const Card = (props: any) => {
  const classes = useStyles();
  return (
    <div className={classes.cardContainer} {...props}>
      {props.children}
    </div>
  );
};

export default Card;
