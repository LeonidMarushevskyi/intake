import React from 'react'
import * as IntakeConfig from 'common/config'

const ForbiddenPage = () => (
  <div className='error-panel centered'>
    <h4>
      <i className='fa fa-warning c-red gap-right'/>
      This page is restricted.
    </h4>
    <div className='gap-top'>
      <span>You don&apos;t have the appropriate permissions to view this page.</span>
      <br/>
      <a href={`/${IntakeConfig.basePath()}`}>Return to your dashboard</a>
      <span>.</span>
    </div>
  </div>
)

export default ForbiddenPage
