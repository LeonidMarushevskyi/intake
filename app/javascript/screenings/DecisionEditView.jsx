import * as IntakeConfig from 'common/config'
import InputField from 'common/InputField'
import PropTypes from 'prop-types'
import React from 'react'
import SCREENING_DECISION from 'enums/ScreeningDecision'
import SCREENING_DECISION_OPTIONS from 'enums/ScreeningDecisionOptions'
import SelectField from 'common/SelectField'

const DecisionEditView = ({errors, screening, onCancel, onSave, onChange, onBlur}) => {
  const decisionOptions = SCREENING_DECISION_OPTIONS[screening.get('screening_decision')] || false
  const decisionLabel = (() => (
    (Boolean(decisionOptions) && decisionOptions.label) || ''
  ))()
  const isRequired = decisionLabel === 'Response time'

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
          <div className='col-md-6'>
            <SelectField
              id='screening_decision'
              label= 'Screening Decision'
              errors={errors.get('screening_decision')}
              required
              value={screening.get('screening_decision')}
              onChange={(event) => onChangeDecision(event)}
              onBlur={() => onBlur('screening_decision')}
            >
              <option key='' />
              {Object.keys(SCREENING_DECISION).map((item) => <option key={item} value={item}>{SCREENING_DECISION[item]}</option>)}
            </SelectField>
            { decisionOptions && decisionOptions.type === 'select' &&
              <SelectField
                id='decisionDetail'
                label={decisionLabel}
                errors={errors.get('screening_decision_detail')}
                required={isRequired}
                value={screening.getIn(['screening_decision_detail'])}
                onChange={(event) => onChange(['screening_decision_detail'], event.target.value || null)}
                onBlur={() => onBlur('screening_decision_detail')}
              >
                <option key='' />
                {Object.keys(decisionOptions.values).map((value) => (
                  <option key={value} value={value}>{decisionOptions.values[value]}</option>)
                )}
              </SelectField>
            }
            { decisionOptions && decisionOptions.type === 'text' &&
              <InputField
                id='decisionDetail'
                label={decisionLabel}
                errors={errors.get('screening_decision_detail')}
                required={isRequired}
                value={screening.getIn(['screening_decision_detail']) || ''}
                onChange={(event) => onChange(['screening_decision_detail'], event.target.value || null)}
                onBlur={() => onBlur('screening_decision_detail')}
                maxLength='64'
              />
            }
            <div>
              <label htmlFor='additional_information'>Additional information</label>
              <textarea
                id='additional_information'
                onChange={(event) => onChange(['additional_information'], event.target.value || null)}
                value={screening.get('additional_information') || ''}
              />
            </div>
          </div>
          <div className='col-md-6'>
            <p className='double-gap-top'><strong>SDM Hotline Tool</strong></p>
            <div>Determine Decision and Response Time by using Structured Decision Making.</div>
            <a href={IntakeConfig.sdmPath()} target='_blank' id='complete_sdm'>Complete SDM</a>
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
  errors: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}

export default DecisionEditView
