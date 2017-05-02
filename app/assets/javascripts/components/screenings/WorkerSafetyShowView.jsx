import EditLink from 'components/common/EditLink'
import PropTypes from 'prop-types'
import React from 'react'
import ShowField from 'components/common/ShowField'

const WorkerSafetyShowView = ({safetyAlerts, safetyInformation, onEdit}) => (
  <div className='card show double-gap-top' id='worker-safety-card'>
    <div className='card-header'>
      <span>Worker Safety</span>
      <EditLink ariaLabel='Edit worker safety' onClick={onEdit} />
    </div>
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

WorkerSafetyShowView.propTypes = {
  onEdit: PropTypes.func.isRequired,
  safetyAlerts: PropTypes.object,
  safetyInformation: PropTypes.string,
}
export default WorkerSafetyShowView
