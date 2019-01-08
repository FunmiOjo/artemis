import Button from "@material-ui/core/Button";
import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {logout} from "../reducers/user";
import {connect} from "react-redux";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: theme.palette.primary.dark
  }
});

const Logout = props => {
  const {handleClick, isLoggedIn, classes} = props;

  return isLoggedIn ? (
    <Button
      color={classes.button.color}
      className={classes.button}
      onClick={handleClick}
    >
      Logout
    </Button>
  ) : (
    ""
  );
};

const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.user.id
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    }
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Logout)
);
