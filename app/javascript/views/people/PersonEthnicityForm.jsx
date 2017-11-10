import React from 'react'
import PropTypes from 'prop-types'
import CheckboxField from 'common/CheckboxField'
import SelectField from 'common/SelectField'

const PersonEthnicityForm = ({
  disableFields,
  ethnicityDetail,
  ethnicityDetailOptions,
  latinoOrigin,
  onChange,
  personId,
}) => (
  <div className='gap-top' id='ethnicity'>
    <fieldset className='fieldset-inputs'>
      <label>Hispanic/Latino Origin</label>
      <div className='row'>
        <div className='col-md-6'>
          <ul className='unstyled-list'>
            <li>
              <div className='half-gap-bottom'>
                <CheckboxField
                  id={`${personId}-ethnicity-yes`}
                  label='Yes'
                  value='Yes'
                  checked={latinoOrigin === 'Yes'}
                  disabled={disableFields && latinoOrigin !== 'Yes'}
                  onChange={({target: {checked}}) => {
                    if (checked) {
                      onChange('hispanic_latino_origin', 'Yes')
                    } else {
                      onChange('hispanic_latino_origin', null)
                      onChange('ethnicity_detail', [])
                    }
                  }}
                />
                {latinoOrigin === 'Yes' &&
                  <SelectField
                    id={`${personId}-ethnicity-detail`}
                    label={''}
                    value={ethnicityDetail || ''}
                    onChange={({target: {value}}) => onChange('ethnicity_detail', [value])}
                  >
                    <option key='' value='' />
                    {ethnicityDetailOptions.map(({value, label}) => <option key={value} value={value}>{label}</option>)}
                  </SelectField>
                }
              </div>
            </li>
            <li>
              <CheckboxField
                id={`${personId}-ethnicity-no`}
                label='No'
                value='No'
                checked={latinoOrigin === 'No'}
                disabled={disableFields && latinoOrigin !== 'No'}
                onChange={({target: {checked}}) => {
                  if (checked) {
                    onChange('hispanic_latino_origin', 'No')
                  } else {
                    onChange('hispanic_latino_origin', null)
                  }
                }}
              />
            </li>
          </ul>
        </div>
        <div className='col-md-6'>
          <ul className='unstyled-list'>
            <li>
              <CheckboxField
                id={`${personId}-ethnicity-unknown`}
                label='Unknown'
                value='Unknown'
                checked={latinoOrigin === 'Unknown'}
                disabled={disableFields && latinoOrigin !== 'Unknown'}
                onChange={({target: {checked}}) => {
                  if (checked) {
                    onChange('hispanic_latino_origin', 'Unknown')
                  } else {
                    onChange('hispanic_latino_origin', null)
                  }
                }}
              />
            </li>
            <li>
              <CheckboxField
                id={`${personId}-ethnicity-abandoned`}
                label='Abandoned'
                value='Abandoned'
                checked={latinoOrigin === 'Abandoned'}
                disabled={disableFields && latinoOrigin !== 'Abandoned'}
                onChange={({target: {checked}}) => {
                  if (checked) {
                    onChange('hispanic_latino_origin', 'Abandoned')
                  } else {
                    onChange('hispanic_latino_origin', null)
                  }
                }}
              />
            </li>
            <li>
              <CheckboxField
                id={`${personId}-ethnicity-declined-to-answer`}
                label='Declined to answer'
                value='Declined to answer'
                checked={latinoOrigin === 'Declined to answer'}
                disabled={disableFields && latinoOrigin !== 'Declined to answer'}
                onChange={({target: {checked}}) => {
                  if (checked) {
                    onChange('hispanic_latino_origin', 'Declined to answer')
                  } else {
                    onChange('hispanic_latino_origin', null)
                  }
                }}
              />
            </li>
          </ul>
        </div>
      </div>
    </fieldset>
  </div>
)

PersonEthnicityForm.propTypes = {
  disableFields: PropTypes.bool,
  ethnicityDetail: PropTypes.string,
  ethnicityDetailOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  latinoOrigin: PropTypes.string,
  onChange: PropTypes.func,
  personId: PropTypes.string,
}

export default PersonEthnicityForm
