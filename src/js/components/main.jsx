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

    var thus = this;

    chrome.storage.sync.get('well-versed', function(data) {

      var firstkey = Object.keys(data['well-versed'])[0];
      var title  = data['well-versed'][firstkey].origTitle;
      var news_cont = data['well-versed'][firstkey].news;
      
      thus.setState({news: news_cont, muiTheme: newMuiTheme, title: title})
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

    if (this.state['news']) {
      debugger;
      return (
      <div style={containerStyle}>
        <Card initiallyExpanded={true}>
          <CardHeader
            title="Well-Versed"
            subtitle="Get informed in seconds"
            avatar="logo.png"
            showExpandableButton={true}/>
          <CardMedia 
          expandable={true}>
            <img src="http://lorempixel.com/600/337/nature/"/>
          </CardMedia>
          <CardText expandable={true}>
            <b> {this.state['title']} </b>
            
          </CardText>
        </Card>
        
        <List zDepth={1} className="news-list" subheader="Related News"> 
          <Divider />
          <ListItem primaryText={this.state['news'][0].Title} id={0} 
          onClick={this.transport.bind(this, this.state['news'][0]['Url'])}>
          </ListItem>
          <Divider />
          <ListItem primaryText={this.state['news'][1].Title} id={1} 
          onClick={this.transport.bind(this, this.state['news'][1]['Url'])}>
          </ListItem>
          <Divider />
          <ListItem primaryText={this.state['news'][2].Title} id={2} 
          onClick={this.transport.bind(this, this.state['news'][2]['Url'])}>
          </ListItem>
        </List>
      </div>)
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
        
        <button onClick={this.populate}>Try</button>
      </div>
    );
  },

  transport(link) {
    window.href = link;
    chrome.tabs.create({ url: link });
    console.log(link);
  }

});

module.exports = Main;
