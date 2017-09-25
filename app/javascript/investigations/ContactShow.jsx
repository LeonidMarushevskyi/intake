import React from 'react'
import PropTypes from 'prop-types'
import ShowField from 'common/ShowField'
import {dateTimeFormatter} from 'utils/dateFormatter'

const ContactShow = ({investigationId, startedAt, status, purpose, note, communicationMethod, location}) => (
  <div className='card show double-gap-top'>
    <div className='card-header'>
      <span>{`Contact - Investigation ${investigationId}`}</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-6'>
          <div className='row'>
            <ShowField gridClassName='col-md-12' label='Date & Time'>
              {`(${dateTimeFormatter(startedAt)})`}
            </ShowField>
          </div>
          <div className='row'>
            <ShowField gridClassName='col-md-12' label='Status'>
              {status}
            </ShowField>
          </div>
          <div className='row'>
            <ShowField gridClassName='col-md-12' label='Purpose'>
              {purpose}
            </ShowField>
          </div>
          <div className='row'>
            <ShowField gridClassName='col-md-12' label='Communication Method'>
              {communicationMethod}
            </ShowField>
          </div>
          <div className='row'>
            <ShowField gridClassName='col-md-12' label='Location'>
              {location}
            </ShowField>
          </div>
        </div>
        <div className='col-md-6'>
          <div className='row'>
            <ShowField gridClassName='col-md-12' label='Contact Notes (Optional)'>
              {note}
            </ShowField>
          </div>
        </div>
      </div>
    </div>
  </div>
)

ContactShow.propTypes = {
  communicationMethod: PropTypes.string,
  investigationId: PropTypes.string,
  location: PropTypes.string,
  note: PropTypes.string,
  purpose: PropTypes.string,
  startedAt: PropTypes.string,
  status: PropTypes.string,
}

export default ContactShow
