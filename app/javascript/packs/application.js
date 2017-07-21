/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

console.log('Hello World from base intake webpacker application.js')

import PropTypes from 'prop-types'
import React from 'react'

export default class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
}


import HomePage from 'HomePage'
