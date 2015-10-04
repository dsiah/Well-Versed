/** In this file, we create a React component which incorporates components provided by material-ui */
const $ = require('jquery');
const request = require('request');
const React = require('react');
const RaisedButton = require('material-ui/lib/raised-button');
const Dialog = require('material-ui/lib/dialog');
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
      query: 'cached info goes here',
      imageUrl: 'http://www.gifbin.com/bin/500824yu29.gif',
      blurb: 'bruce flea'
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

        <Paper zDepth={1} className="query-subject">{this.state.query}</Paper>
        <img className="picture" src={this.state.imageUrl} />
        <Paper zDepth={1} className="bio">{this.state.blurb}</Paper>

      </div>
    );
  },

  _handleTouchTap() {
    //
  }

});

module.exports = Main;
