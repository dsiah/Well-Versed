(function () {
  let React = require('react/addons');
  let injectTapEventPlugin = require('react-tap-event-plugin');
  let Main = require('./components/main.jsx'); 

  var WebFontConfig = {
    google: { families: [ 'Roboto:400,300,500:latin' ] }
  };

  //Needed for React Developer Tools
  window.React = React;

  injectTapEventPlugin();

  // Render the main app react component into the document body.
  // For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
  React.render(<Main />, document.body);

})();
