import * as IntakeConfig from 'common/config'
import InputField from 'common/InputField'
import PropTypes from 'prop-types'
import React from 'react'
import SCREENING_DECISION from 'enums/ScreeningDecision'
import ACCESS_RESTRICTIONS from 'enums/AccessRestrictions'
import SCREENING_DECISION_OPTIONS from 'enums/ScreeningDecisionOptions'
import SelectField from 'common/SelectField'
import ScreeningCardHeader from 'screenings/ScreeningCardHeader'

const DecisionEditView = ({errors, screening, onCancel, onSave, onChange, onBlur}) => {
  const decisionOptions = SCREENING_DECISION_OPTIONS[screening.get('screening_decision')] || false
  const decisionLabel = (() => (
    (Boolean(decisionOptions) && decisionOptions.label) || ''
  ))()
  const isRequired = decisionLabel === 'Response time'
  const isRestricted = Boolean(screening.get('access_restrictions'))

  const onChangeDecision = (event) => {
    onChange(['screening_decision'], event.target.value || null, () => {
      onChange(['screening_decision_detail'], '')
    })
  }

  return (
    <div className={'card edit double-gap-top'} id='decision-card'>
      <ScreeningCardHeader
        onEdit={() => {}}
        title='Decision'
        showEdit={false}
      />
      <div className='card-body'>
        <div className='row'>
          <div className='col-md-6'>
            <SelectField
              id='screening_decision'
              label= 'Screening Decision'
              errors={errors.screening_decision}
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
                errors={errors.screening_decision_detail}
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
                  errors={errors.screening_decision_detail}
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
            <SelectField
              id='access_restrictions'
              label= 'Access Restrictions'
              value={screening.get('access_restrictions')}
              onChange={(event) => onChange(['access_restrictions'], event.target.value || null)}
              onBlur={() => onBlur('access_restrictions')}
            >
              {Object.keys(ACCESS_RESTRICTIONS).map((item) => <option key={item} value={item}>{ACCESS_RESTRICTIONS[item]}</option>)}
            </SelectField>
            { isRestricted &&
                  <div>
                    <label className='required' htmlFor='restrictions_rationale'>Restrictions Rationale</label>
                    <textarea
                      id='restrictions_rationale'
                      onChange={(event) => onChange(['restrictions_rationale'], event.target.value || null)}
                      value={screening.get('restrictions_rationale') || ''}
                      onBlur={() => onBlur('restrictions_rationale')}
                      maxLength='255'
                    />
                  </div>
            }
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
