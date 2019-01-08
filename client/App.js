import React, {Component} from "react";
import NavBar from "./components/NavBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffccbc",
      contrastText: "#000"
    },
    secondary: {
      main: "#e0f7fa",
      contrastText: "#000"
    },
    background: {
      default: "#ffccbc"
    }
  }
});
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
          <div className="App">
            <NavBar />
          </div>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

export default App;
