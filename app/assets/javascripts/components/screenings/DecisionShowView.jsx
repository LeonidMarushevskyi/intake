import React from 'react'
import RESPONSE_TIME from 'ResponseTime'
import SCREENING_DECISION from 'ScreeningDecision'
import ShowField from 'components/common/ShowField'
import EditLink from 'components/common/EditLink'

const DecisionShowView = ({screening, onEdit}) => (
  <div className='card show double-gap-top' id='decision-card'>
    <div className='card-header'>
      <span>Decision</span>
      <EditLink ariaLabel='Edit decision card' onClick={onEdit} />
    </div>
    <div className='card-body'>
      <div className='row'>
        <ShowField gridClassName='col-md-6' label='Response Time'>
          {RESPONSE_TIME[screening.get('response_time')]}
        </ShowField>
      </div>
      <div className='row'>
        <ShowField gridClassName='col-md-6' label='Screening Decision'>
          {SCREENING_DECISION[screening.get('screening_decision')]}
        </ShowField>
      </div>
      <div className='row'>
        <ShowField gridClassName='col-md-6' label='Decision Rationale'>
          {screening.get('decision_rationale')}
        </ShowField>
      </div>
    </div>
  </div>
)

DecisionShowView.propTypes = {
  onEdit: React.PropTypes.func.isRequired,
  screening: React.PropTypes.object.isRequired,
}
export default DecisionShowView
