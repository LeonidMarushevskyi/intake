import InputField from 'components/common/InputField'
import PropTypes from 'prop-types'
import React from 'react'
import SCREENING_DECISION from 'ScreeningDecision'
import SCREENING_DECISION_OPTIONS from 'ScreeningDecisionOptions'
import SelectField from 'components/common/SelectField'

const DecisionEditView = ({screening, onCancel, onSave, onChange}) => {
  const decisionLabel = (() => {
    const decisionOptions = SCREENING_DECISION_OPTIONS[screening.get('screening_decision')]
    return (Boolean(decisionOptions) && decisionOptions.label) || ''
  })()

  const decisionOptions = SCREENING_DECISION_OPTIONS[screening.get('screening_decision')] || false

  const onChangeDecision = (event) => {
    onChange(['screening_decision'], event.target.value || null, () => {
      onChange(['screening_decision_detail'], '')
    })
  }

  return (
    <div className='card edit double-gap-top' id='decision-card'>
      <div className='card-header'>
        <span>Decision</span>
      </div>
      <div className='card-body'>
        <div className='row'>
          <SelectField
            gridClassName='col-md-6'
            id='screening_decision'
            label= 'Screening Decision'
            value={screening.get('screening_decision')}
            onChange={(event) => onChangeDecision(event)}
          >
            <option key='' />
            {Object.keys(SCREENING_DECISION).map((item) => <option key={item} value={item}>{SCREENING_DECISION[item]}</option>)}
          </SelectField>
          { decisionOptions && decisionOptions.type === 'select' &&
            <SelectField
              gridClassName='col-md-6'
              id='decisionDetail'
              label={decisionLabel}
              value={screening.getIn(['screening_decision_detail'])}
              onChange={(event) => onChange(['screening_decision_detail'], event.target.value || null)}
            >
              <option key='' />
              {Object.keys(decisionOptions.values).map((value) => (
                <option key={value} value={value}>{decisionOptions.values[value]}</option>)
              )}
            </SelectField>
            }
            { decisionOptions && decisionOptions.type === 'text' &&
              <InputField
                gridClassName='col-md-6'
                id='decisionDetail'
                label={decisionLabel}
                value={screening.getIn(['screening_decision_detail']) || ''}
                onChange={(event) => onChange(['screening_decision_detail'], event.target.value || null)}
                maxLength='64'
              />
              }
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <label htmlFor='additional_information'>Additional information</label>
            <textarea
              id='additional_information'
              onChange={(event) => onChange(['additional_information'], event.target.value || null)}
              value={screening.get('additional_information') || ''}
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
}

DecisionEditView.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}

export default DecisionEditView
