import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {TextField, Typography} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import {
  setSinglePodcast,
  setPodcastList,
  fetchCategoryPodcastsEpisodeData
} from '../reducers/podcast';
import {connect} from 'react-redux';

let suggestions = [];

/*
fetches a list of podcast genres from backend and converts to array containing
objects with genre label and id properties
saves the array in global suggestions variable
*/
async function fetchAPIGenres() {
  let res = await axios.get('/api/genre/apilist');
  let APIgenresList = res.data.genres;
  suggestions = APIgenresList.map(genre => ({
    label: genre.name,
    id: genre.id
  }));
}

const styles = theme => ({
  root: {
    height: 250,
    flexGrow: 1
  },
  container: {
    position: 'relative'
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  divider: {
    height: theme.spacing.unit * 2
  },
  input: {
    marginTop: '1rem'
  }
});

/*
customizes rendering of input
not clear what's happening with inputProps, ref, inputRef etc.
*/
function renderInputComponent(inputProps) {
  const {classes, inputRef = () => {}, ref, ...other} = inputProps;

  return (
    <div>
      <Typography variant="display1">Create a channel</Typography>
      <Typography variant="subheading">
        Start typing below to select from our list of genres.
      </Typography>
      <TextField
        fullWidth
        InputProps={{
          inputRef: node => {
            ref(node);
            inputRef(node);
          },
          classes: {
            input: classes.input
          }
        }}
        {...other}
      />
    </div>
  );
}

/*
renders suggested genres
according to library match calculates the characters to highlight in text based
on query param and parse breaks the given text into parts based on matches
*/
function renderSuggestion(suggestion, {query, isHighlighted}) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{fontWeight: 500}}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{fontWeight: 300}}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
}

/*
takes input value and returns five genres where input matches beginning of
genre label
deburr removes accents and other diacritical marks from strings
*/
function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

class IntegrationAutosuggest extends React.Component {
  state = {
    single: '',
    suggestions: [],
    id: 0,
    reDirect: false
  };

  /*
  sets state with five genre suggestions
  */
  handleSuggestionsFetchRequested = ({value}) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  /*
  clears suggestion state
  */
  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  /*
  returns a function that sets the single property on state to newValue
  */
  handleChange = name => (event, {newValue}) => {
    this.setState({
      [name]: newValue
    });
  };

  componentDidMount() {
    fetchAPIGenres();
  }

  /*
  creates new channel from search input in database and redirects to the
  created channel
  */
  createAndRenderChannel = () => async event => {
    event.preventDefault();
    try {
      let searchInput = this.state.single;
      //matchingId seems to refer to the genre that matches the search input
      let matchingId = suggestions.filter(sugg => sugg.label === searchInput);
      let genreId = matchingId[0].id;

      /*
      this makes a call to the backend which retrieves a list of the best
      podcasts in the given genre from the ListenNotes API
      */
      let res = await axios.get(`/api/podcast?id=${genreId}`);

      /*
      channelList is an object that contains a list of podcasts in its
      channels property
      */
      let channelList = res.data;

      if (channelList.channels === undefined) {
        throw new Error('channelList is undefined');
      }

      /*
      The best podcasts in category list does not contain episode data for those
      podcasts so fetchCategoryPodcastsEpisodeData gets the episodes for those
      podcasts and sets them to the Redux state
      */
      this.props.fetchCategoryPodcastsEpisodeData(channelList.channels);

      /*
      creates new channel
      */
      const createdChannel = await axios.post('/api/channel', {
        name: searchInput
      });

      this.setState({
        id: createdChannel.data.id,
        reDirect: true
      });
    } catch (error) {
      console.error(error);
    }
  };

//renders form with autosuggest
  render() {
    const {classes} = this.props;

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion
    };

    if (this.state.reDirect) {
      return <Redirect to={`/channel/${this.state.id}`} />;
    }

    return (
      <div className={classes.root}>
        <form onSubmit={this.createAndRenderChannel()}>
          <Autosuggest
            {...autosuggestProps}
            inputProps={{
              classes,
              placeholder: 'Search',
              value: this.state.single,
              onChange: this.handleChange('single')
            }}
            theme={{
              container: classes.container,
              suggestionsContainerOpen: classes.suggestionsContainerOpen,
              suggestionsList: classes.suggestionsList,
              suggestion: classes.suggestion
            }}
            renderSuggestionsContainer={options => (
              <Paper {...options.containerProps} square>
                {options.children}
              </Paper>
            )}
          />
          <div className={classes.divider} />
          <Button type="submit" color="secondary">
            Create Channel
          </Button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCategoryPodcastsEpisodeData: podcasts =>
      dispatch(fetchCategoryPodcastsEpisodeData(podcasts))
  };
};

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(IntegrationAutosuggest)
);
