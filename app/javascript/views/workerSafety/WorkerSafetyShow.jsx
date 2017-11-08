import React from 'react'
import PropTypes from 'prop-types'
import ScreeningCardHeader from 'screenings/ScreeningCardHeader'
import ShowField from 'common/ShowField'

const WorkerSafetyShow = ({safetyAlerts, safetyInformation, toggleMode, showEdit}) => (
  <div>
    <ScreeningCardHeader
      onEdit={toggleMode}
      title='Worker Safety'
      showEdit={showEdit}
    />
    <div className='card-body'>
      <div className='row'>
        <ShowField gridClassName='col-md-12' label='Worker safety alerts'>
          {safetyAlerts &&
            <ul>{
              safetyAlerts.map((alert_label, index) =>
                (<li key={`SA-${index}`}>{`${alert_label}`}</li>)
              )
            }
            </ul>
          }
        </ShowField>
      </div>
      <div className='row'>
        <ShowField gridClassName='col-md-6' labelClassName='no-gap' label='Additional safety information'>
          {safetyInformation || ''}
        </ShowField>
      </div>
    </div>
  </div>
)

WorkerSafetyShow.propTypes = {
  safetyAlerts: PropTypes.array,
  safetyInformation: PropTypes.string,
  showEdit: PropTypes.bool,
  toggleMode: PropTypes.func,
}

export default WorkerSafetyShow
