import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {withStyles} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Logout from "./Logout";
import Routes from "../routes";
import history from "../history";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: "100vh",
    backgroundColor: "#ffccbc",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  },
  appFrame: {
    height: "100vh",
    zIndex: 1,
    position: "relative",
    display: "flex",
    width: "100%",
    justifyContent: "center"
  },
  appBar: {
    position: "absolute",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  title: {
    flexGrow: 1
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "appBarShift-left": {
    marginLeft: drawerWidth
  },
  "appBarShift-right": {
    marginRight: drawerWidth
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflow: "auto",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  },
  "content-left": {
    marginLeft: -drawerWidth
  },
  "content-right": {
    marginRight: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "contentShift-left": {
    marginLeft: 0
  },
  "contentShift-right": {
    marginRight: 0
  }
});

class PersistentDrawer extends React.Component {
  constructor(props) {
    super();
    this.state = {
      open: false,
      anchor: "left",
      pageSelected: "",
      redirect: false,
      bg: history.location.pathname.includes("channel/")
        ? "url('/backgroundImage2.jpg')"
        : "url('/backgroundImage.jpg')"
    };
  }

  handleDrawerOpen = () => {
    this.setState({open: true});
  };

  handleDrawerClose = () => {
    this.setState({open: false});
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value
    });
  };

  changeBackground = () => {
    history.listen((location, action) => {
      this.setState({
        bg: location.pathname.includes("channel/")
          ? "url('/backgroundImage2.jpg')"
          : "url('/backgroundImage.jpg')"
      });
    });
  };

  render() {
    const {classes, theme} = this.props;
    const {anchor, open} = this.state;

    this.changeBackground();
    const drawer = (
      <Drawer
        style={{height: "100%"}}
        variant="persistent"
        anchor={anchor}
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button onClick={() => history.push("/allchannels")}>
            <ListItemText primary="Channels" />
          </ListItem>
          <ListItem button onClick={() => history.push("/createchannel")}>
            <ListItemText primary="Create Channel" />
          </ListItem>
          <ListItem button onClick={() => history.push("/bookmarks")}>
            <ListItemText primary="Bookmarks" />
          </ListItem>
        </List>
      </Drawer>
    );

    let before = null;
    let after = null;

    if (anchor === "left") {
      before = drawer;
    } else {
      after = drawer;
    }

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
              [classes[`appBarShift-${anchor}`]]: open
            })}
          >
            <Toolbar disableGutters={!open}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>

              <Typography variant="title" className={classes.title}>
                Artemis
              </Typography>
              <Logout />
            </Toolbar>
          </AppBar>
          {before}
          <main
            className={classNames(
              classes.content,
              classes[`content-${anchor}`],
              {
                [classes.contentShift]: open,
                [classes[`contentShift-${anchor}`]]: open
              }
            )}
            style={{
              backgroundImage: `
            linear-gradient(to bottom, rgba(89, 155, 163, 0.65) 0%, rgba(89, 155, 163, 0.65) 30%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%), ${
              this.state.bg
            }`
            }}
          >
            <div className={classes.drawerHeader} />
            <Routes style={styles.drawerPaper} />
          </main>
          {after}
        </div>
      </div>
    );
  }
}

PersistentDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, {withTheme: true})(PersistentDrawer);
