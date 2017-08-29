import PropTypes from 'prop-types'
import React from 'react'
import ShowField from 'common/ShowField'

const NarrativeShowView = ({errors, screening}) => (
  <div className='card-body'>
    <div className='row'>
      <ShowField gridClassName='col-md-12' label='Report Narrative' errors={errors.get('report_narrative')} required>
        {screening.get('report_narrative')}
      </ShowField>
    </div>
  </div>
)

NarrativeShowView.propTypes = {
  errors: PropTypes.object.isRequired,
  screening: PropTypes.object.isRequired,
}
export default NarrativeShowView
