/** In this file, we create a React component which incorporates components provided by material-ui */
const $ = require('jquery');
const request = require('request');
const React = require('react');
const RaisedButton = require('material-ui/lib/raised-button');
const Dialog = require('material-ui/lib/dialog');
const ThemeManager = require('material-ui/lib/styles/theme-manager');
const LightRawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme');
const Colors = require('material-ui/lib/styles/colors');

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
        <h2>example project</h2>

        <RaisedButton label="Super Secret Password" primary={true} 
        onTouchTap={this._handleTouchTap} />

      </div>
    );
  },

  _handleTouchTap() {

    // This is the logic we need to fire at the startup
    // Most likely will be embedded in the Component Will Mount function
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      console.log(tabs[0].title);
      let val = tabs[0].title;
      
      $.post('http://104.209.136.192:8080/summarize', { str: val }, function(data) {
        console.log(data);
      })
    });
  }

});

module.exports = Main;
