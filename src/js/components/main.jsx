/** In this file, we create a React component which incorporates components provided by material-ui */
const $ = require('jquery');
const request = require('request');
const React = require('react');
const RaisedButton = require('material-ui/lib/raised-button');
const List = require('material-ui/lib/lists/list');
const ListItem = require('material-ui/lib/lists/list-item');
const Divider = require('material-ui/lib/lists/list-divider');
const ThemeManager = require('material-ui/lib/styles/theme-manager');
const LightRawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme');
const Colors = require('material-ui/lib/styles/colors');
const Paper = require('material-ui/lib/paper');

const Main = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getInitialState () {
    return {
      muiTheme: ThemeManager.getMuiTheme(LightRawTheme),
    };
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  componentWillMount() {
    let newMuiTheme = ThemeManager.modifyRawThemePalette(this.state.muiTheme, {
      accent1Color: Colors.deepOrange500
    });

    this.setState({muiTheme: newMuiTheme});
    this.setState({
      query: 'Cached Info Goes Here',
      imageUrl: 'http://www.gifbin.com/bin/500824yu29.gif',
      blurb: 'Bruce Flea was a Hong Kong American martial artist,' + 
      ' Hong Kong action film actor, martial arts instructor, ' +
      'philosopher, filmmaker, and the founder of Jeet Kune Do. ' + 
      'Lee was the son of Cantonese opera star Lee Hoi-Chuen.'
    });
  },

  render() {

    let containerStyle = {
      textAlign: 'center',
    };

    let standardActions = [
      { text: 'Okay' }
    ];

    return (
      <div style={containerStyle}>
        <h1>Well Versed</h1>

        <img className="picture" src={this.state.imageUrl} />

        <Paper zDepth={1} className="bio">
          <h3>{this.state.query}</h3>
          <p>{this.state.blurb}</p>
        </Paper>

        <List zDepth={1} className="news-list" subheader="Related News"> 
          <Divider />
          <ListItem primaryText="News Item 1"></ListItem>
          <Divider />
          <ListItem primaryText="News Item 2"></ListItem>
          <Divider />
          <ListItem primaryText="News Item 3"></ListItem>
        </List>

      </div>
    );
  },

  _handleTouchTap() {
    //
  }

});

module.exports = Main;
