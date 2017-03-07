import React from 'react'
import SCREENING_DECISION from 'ScreeningDecision'
import RESPONSE_TIME from 'ResponseTime'
import SelectField from 'components/common/SelectField'

const DecisionEditView = ({screening, onCancel, onSave, onChange}) => (
  <div className='card edit double-gap-top' id='decision-card'>
    <div className='card-header'>
      <span>Decision</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <SelectField
          gridClassName='col-md-6'
          id='response_time'
          label='Response Time'
          value={screening.get('response_time') || ''}
          onChange={(event) => onChange(['response_time'], event.target.value || null)}
        >
          <option key='' />
          {Object.keys(RESPONSE_TIME).map((item) => <option key={item} value={item}>{RESPONSE_TIME[item]}</option>)}
        </SelectField>
      </div>
      <div className='row'>
        <SelectField
          gridClassName='col-md-6'
          id='screening_decision'
          label= 'Screening Decision'
          value={screening.get('screening_decision') || ''}
          onChange={(event) => onChange(['screening_decision'], event.target.value || null)}
        >
          <option key='' />
          {Object.keys(SCREENING_DECISION).map((item) => <option key={item} value={item}>{SCREENING_DECISION[item]}</option>)}
        </SelectField>
      </div>
      <div className='row'>
        <div className='col-md-12'>
          <label htmlFor='decision_rationale'>Decision Rationale</label>
          <textarea
            id='decision_rationale'
            onChange={(event) => onChange(['decision_rationale'], event.target.value || null)}
            value={screening.get('decision_rationale') || ''}
          />
        </div>
      </div>
      <div className='row'>
        <div className='centered'>
          <button className='btn btn-primary' onClick={onSave}>Save</button>
          <button className='btn btn-default' onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
)
DecisionEditView.propTypes = {
  onCancel: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  screening: React.PropTypes.object.isRequired,
}

export default DecisionEditView
