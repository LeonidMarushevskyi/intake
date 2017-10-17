import CheckboxField from 'common/CheckboxField'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import SelectField from 'common/SelectField'
import {HISPANIC_LATINO_ORIGIN, ETHNICITY_DETAILS} from 'enums/Ethnicity'

export class EthnicityEditView extends React.Component {
  constructor() {
    super(...arguments)
  }

  changeEthnicity(selectedEthnicity, checked) {
    if (checked) {
      this.props.onChange(Immutable.fromJS({hispanic_latino_origin: selectedEthnicity}))
    } else {
      this.props.onChange(Immutable.fromJS({hispanic_latino_origin: null, ethnicity_detail: null}))
    }
  }

  changeEthnicityDetail(selectedEthnicityDetail) {
    if (selectedEthnicityDetail) {
      this.props.onChange(Immutable.fromJS({
        hispanic_latino_origin: 'Yes',
        ethnicity_detail: [selectedEthnicityDetail],
      }))
    } else {
      this.props.onChange(Immutable.fromJS({
        hispanic_latino_origin: 'Yes',
      }))
    }
  }

  renderEthnicityAndDetails(ethnicityOptions) {
    const {id, ethnicity} = this.props
    const ethnicity_details = ethnicity.get('ethnicity_detail')
    const ethnicity_detail = ethnicity_details ? ethnicity_details[0] : undefined
    return (
      <div className='col-md-6'>
        <ul className='unstyled-list'>
          {
            ethnicityOptions.map((option) => {
              const hispanicLatinoOrigin = ethnicity.get('hispanic_latino_origin')
              const disabled = hispanicLatinoOrigin && hispanicLatinoOrigin !== option
              const selected = hispanicLatinoOrigin === option
              return (
                <li key={option}>
                  <div className='half-gap-bottom'>
                    <CheckboxField
                      id={`${id}-ethnicity-${option.replace(/ /gi, '_')}`}
                      value={option}
                      label={option}
                      checked={selected}
                      disabled={Boolean(disabled)}
                      onChange={(event) => this.changeEthnicity(option, event.target.checked)}
                    />
                    {option === 'Yes' && hispanicLatinoOrigin === 'Yes' &&
                    <SelectField
                      id={`${id}-ethnicity-detail`}
                      label={''}
                      value={ethnicity_detail}
                      onChange={(event) => this.changeEthnicityDetail(event.target.value)}
                    >
                      <option key='' value='' />
                      {ETHNICITY_DETAILS.map((detail) => <option key={detail} value={detail}>{detail}</option>)}
                    </SelectField>
                    }
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }

  render() {
    const startIndex = 0
    const halfIndex = 2
    return (
      <div className='gap-top' id='ethnicity'>
        <fieldset className='fieldset-inputs'>
          <label>Hispanic/Latino Origin</label>
          <div className='row'>
            {this.renderEthnicityAndDetails(HISPANIC_LATINO_ORIGIN.slice(startIndex, halfIndex))}
            {this.renderEthnicityAndDetails(HISPANIC_LATINO_ORIGIN.slice(halfIndex))}
          </div>
        </fieldset>
      </div>
    )
  }
}

EthnicityEditView.propTypes = {
  ethnicity: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default EthnicityEditView
