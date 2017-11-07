import React from 'react'
import PropTypes from 'prop-types'
import ShowField from 'common/ShowField'

const ScreeningInformationShow = ({name, assignee, started_at, ended_at, communication_method, errors}) => (
  <div className='card-body'>
    <div className='row'>
      <ShowField gridClassName='col-md-4' label='Title/Name of Screening'>
        {name}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='Assigned Social Worker' errors={errors.assignee} required>
        {assignee}
      </ShowField>
    </div>
    <div className='row'>
      <ShowField gridClassName='col-md-4' label='Screening Start Date/Time' errors={errors.started_at} required>
        {started_at}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='Screening End Date/Time' errors={errors.ended_at}>
        {ended_at}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='Communication Method' errors={errors.communication_method} required>
        {communication_method}
      </ShowField>
    </div>
  </div>
)

ScreeningInformationShow.propTypes = {
  assignee: PropTypes.string,
  communication_method: PropTypes.string,
  ended_at: PropTypes.string,
  errors: PropTypes.object,
  name: PropTypes.string,
  started_at: PropTypes.string,
}

export default ScreeningInformationShow
