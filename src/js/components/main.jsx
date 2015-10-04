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
const Card = require('material-ui/lib/card/card');
const CardHeader = require('material-ui/lib/card/card-header');
const CardMedia = require('material-ui/lib/card/card-media');
const CardTitle = require('material-ui/lib/card/card-title');
const CardText = require('material-ui/lib/card/card-text');
const CardActions = require('material-ui/lib/card/card-actions');
const FlatButton = require('material-ui/lib/flat-button');
const Avatar = require('material-ui/lib/avatar');

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

    let roundStyle = {
      float: 'left'
    }

    let rectStyle = {
      float: 'right',
      width: '100px'
    }

    return (
      <div style={containerStyle}>
        <Card initiallyExpanded={true}>
          <CardHeader
            title="Demo Url Based Avatar"
            subtitle="Subtitle"
            avatar="http://lorempixel.com/100/100/nature/"
            showExpandableButton={true}/>
          <CardMedia 
          overlay={<CardTitle title="Title" subtitle="Subtitle"/>}
          expandable={true}>
            <img src="http://lorempixel.com/600/337/nature/"/>
          </CardMedia>
          <CardText expandable={true}>
            Fill in.
          </CardText>
        </Card>
        <br/>
        <Card>
          <CardTitle subtitle="Title"/>
          <CardText>
            Fill in.
          </CardText>
          <CardText>
            Fill in.
          </CardText>
          <CardText>
            Fill in.
          </CardText>
        </Card>
      </div>
    );
  },

  _handleTouchTap() {
    //
  }

});

module.exports = Main;
