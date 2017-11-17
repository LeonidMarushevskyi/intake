import React from 'react'
import * as IntakeConfig from 'common/config'

const UnauthorizedPage = () => (
  <div className='error-panel centered'>
    <h4>
      <i className='fa fa-warning c-red gap-right'/>
      Sorry, you are restricted from accessing this page.
    </h4>
    <div className='gap-top'>
      <a href={IntakeConfig.dashboardUrl()}>Return to your dashboard</a>
      <span>.</span>
    </div>
  </div>
)

export default UnauthorizedPage
