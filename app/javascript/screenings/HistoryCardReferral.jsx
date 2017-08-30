import PropTypes from 'prop-types'
import React from 'react'
import nameFormatter from 'utils/nameFormatter'
import {accessDescription} from 'utils/accessIndicator'
import {dateRangeFormatter} from 'utils/dateFormatter'

const HistoryCardReferral = ({referral, index}) => {
  let status = referral.get('end_date') ? 'Closed' : 'Open'
  const responseTime = referral.get('response_time')
  if (responseTime) {
    status += ` - ${responseTime}`
  }

  const incidentCounty = referral.get('county_name')
  const reporter = referral.get('reporter')
  const assignee = referral.get('assigned_social_worker')
  const allegations = referral.get('allegations')
  const legacyDescriptor = referral.get('legacy_descriptor')
  const referralId = legacyDescriptor ? legacyDescriptor.get('legacy_ui_id') : ''
  const accessLimitation = referral.get('access_limitation')
  const limitedAccessCode = accessLimitation ? accessLimitation.get('limited_access_code') : 'N'
  const accessNotification = accessDescription(limitedAccessCode)

  return (
    <tr key={`referral-${index}`} id={`referral-${referral.get('id')}`}>
      <td>{dateRangeFormatter(referral.toJS())}</td>
      <td>
        <div className='row'>Referral</div>
        <div className='row'>{referralId}</div>
        <div className='row'>{`(${status})`}</div>
        {accessNotification && <div className='row information-flag'>{accessNotification}</div>}
      </td>
      <td>{incidentCounty}</td>
      <td>
        <div className='row'>
          <div className='table-responsive'>
            <table className='table'>
              <colgroup>
                <col className='col-md-3' />
                <col className='col-md-3'/>
                <col className='col-md-6'/>
              </colgroup>
              <thead>
                <tr>
                  <th scope='col'>Victim</th>
                  <th scope='col'>Perpetrator</th>
                  <th scope='col'>Allegation(s) &amp; Disposition</th>
                </tr>
              </thead>
              <tbody>
                { allegations && allegations.map((allegation, index) => {
                  const disposition = allegation.get('disposition_description') || 'Pending decision'
                  return (
                    <tr key={`allegation-${index}`}>
                      <td>{allegation ? nameFormatter(allegation, {name_type: 'victim', name_default: ''}) : ''}</td>
                      <td>{allegation ? nameFormatter(allegation, {name_type: 'perpetrator', name_default: ''}) : ''}</td>
                      <td>{`${allegation.get('allegation_description')} (${disposition})`}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className='row'>
          <span className='col-md-6 reporter'>
            {`Reporter: ${reporter ? nameFormatter(reporter, {name_default: ''}) : ''}`}
          </span>
          <span className='col-md-6 assignee'>
            {`Worker: ${assignee ? nameFormatter(assignee, {name_default: ''}) : ''}`}
          </span>
        </div>
      </td>
    </tr>
  )
}

HistoryCardReferral.propTypes = {
  index: PropTypes.number.isRequired,
  referral: PropTypes.object.isRequired,
}

export default HistoryCardReferral

