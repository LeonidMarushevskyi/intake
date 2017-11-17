import React from 'react'
import PropTypes from 'prop-types'
import SelectField from 'common/SelectField'
import InputField from 'common/InputField'
import FormField from 'common/FormField'

const ScreeningDecisionForm = ({
  accessRestriction,
  accessRestrictionOptions,
  additionalInformation,
  decision,
  decisionOptions,
  decisionDetail,
  decisionDetailOptions,
  onBlur,
  onCancel,
  onChange,
  onSave,
  restrictionRationale,
  sdmPath,
}) => (
  <div className='card edit double-gap-top' id='decision-card'>
    <div className='card-header'>
      <span>Decision</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-6'>
          <SelectField
            id='screening_decision'
            label='Screening decision'
            required
            value={decision.value}
            errors={decision.errors}
            onBlur={() => onBlur('screening_decision')}
            onChange={({target: {value}}) => onChange('screening_decision', value)}
          >
            <option key='' />
            {decisionOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </SelectField>
          {decision.value && decisionDetailOptions.length === 0 &&
            <InputField
              id='decision_detail'
              maxLength='64'
              label={decisionDetail.label}
              errors={decisionDetail.errors}
              required={decisionDetail.required}
              value={decisionDetail.value}
              onChange={({target: {value}}) => onChange('screening_decision_detail', value)}
              onBlur={() => onBlur('screening_decision_detail')}
            />
          }
          {decision.value && decisionDetailOptions.length > 0 &&
            <SelectField
              id='decision_detail'
              label={decisionDetail.label}
              errors={decisionDetail.errors}
              required={decisionDetail.required}
              value={decisionDetail.value}
              onChange={({target: {value}}) => onChange('screening_decision_detail', value)}
              onBlur={() => onBlur('screening_decision_detail')}
            >
              <option key='' />
              {decisionDetailOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectField>
          }
          <div>
            <label htmlFor='additional_information'>Additional information</label>
            <textarea
              id='additional_information'
              onChange={({target: {value}}) => onChange('additional_information', value)}
              value={additionalInformation.value}
            />
          </div>
          <SelectField
            id='access_restrictions'
            label= 'Access Restrictions'
            value={accessRestriction.value}
            onChange={({target: {value}}) => onChange('access_restrictions', value)}
            onBlur={() => onBlur('access_restrictions')}
          >
            {accessRestrictionOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </SelectField>
          {accessRestriction.value &&
            <div>
              <FormField
                htmlFor='restrictions_rationale'
                label='Restrictions Rationale'
                errors={restrictionRationale.errors}
                required
              >
                <textarea
                  id='restrictions_rationale'
                  onChange={({target: {value}}) => onChange('restrictions_rationale', value)}
                  value={restrictionRationale.value}
                  onBlur={() => onBlur('restrictions_rationale')}
                  maxLength='255'
                />
              </FormField>
            </div>
          }
        </div>
        <div className='col-md-6'>
          <p className='double-gap-top'><strong>SDM Hotline Tool</strong></p>
          <div>Determine Decision and Response Time by using Structured Decision Making.</div>
          <a href={sdmPath} target='_blank' id='complete_sdm'>Complete SDM</a>
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

ScreeningDecisionForm.propTypes = {
  accessRestriction: PropTypes.shape({
    value: PropTypes.string,
  }),
  accessRestrictionOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  additionalInformation: PropTypes.shape({
    value: PropTypes.string,
  }),
  decision: PropTypes.shape({
    value: PropTypes.string,
    errors: PropTypes.arrayOf(PropTypes.string),
  }),
  decisionDetail: PropTypes.shape({
    errors: PropTypes.arrayOf(PropTypes.string),
    label: PropTypes.string,
    required: PropTypes.bool,
    value: PropTypes.string,
  }),
  decisionDetailOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  decisionOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  onBlur: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  restrictionRationale: PropTypes.shape({
    value: PropTypes.string,
  }),
  sdmPath: PropTypes.string,
}

export default ScreeningDecisionForm
