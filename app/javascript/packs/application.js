/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb
import 'babel-polyfill'
import 'jquery'
import 'common/jquery-helpers'

import 'bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import configureStore from 'store/configureStore'
import routes from 'common/routes'
import {Provider} from 'react-redux'

import Autocompleter from 'common/Autocompleter'

// CSS needed
import 'bootstrap/dist/css/bootstrap'
import '../../assets/stylesheets/helpers'
import '../../assets/stylesheets/accessibility'
import '../../assets/stylesheets/datepicker'
import '../../assets/stylesheets/alert'
import '../../assets/stylesheets/button'
import '../../assets/stylesheets/card'
import '../../assets/stylesheets/form'
import '../../assets/stylesheets/list'
import '../../assets/stylesheets/navigation'
import '../../assets/stylesheets/table'
import '../../assets/stylesheets/typography'
import 'react-select/dist/react-select.css'
import 'react-widgets/dist/css/react-widgets'
import '../../assets/stylesheets/multi-select'
import '../../assets/stylesheets/ie'
import 'font-awesome/css/font-awesome'
import '../../assets/stylesheets/google-api'

const store = configureStore()
if (document.getElementById('app')) {
  ReactDOM.render(
    <Provider store={store}>
      {routes}
    </Provider>,
    document.getElementById('app')
  )
}

if (document.getElementById('app-release-one')) {
  ReactDOM.render(
    <div>
      <label className='no-gap' htmlFor='people'>People</label>
      <Autocompleter id='people' />
    </div>,
    document.getElementById('app-release-one')
  )
}
