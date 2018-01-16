import {Map, List, fromJS} from 'immutable'
import {findByCode, buildSelector} from 'selectors'

export const mapLanguages = (state, result) => buildSelector(
  (state) => state.get('languages'),
  () => (result.get('languages') || List()),
  (statusCodes, languages) => (
    languages
      .sort((item) => item.get('primary'))
      .map((language) => (
        findByCode(statusCodes.toJS(), language.get('id')).value)
      )

  )
)(state)

export const mapIsSensitive = (result) => (result.get('sensitivity_indicator', '').toUpperCase() === 'S')
export const mapIsSealed = (result) => (result.get('sensitivity_indicator', '').toUpperCase() === 'R')

export const mapRaces = (state, result) => buildSelector(
  (state) => state.get('ethnicityTypes'),
  (state) => state.get('raceTypes'),
  (state) => state.get('unableToDetermineCodes'),
  () => (result.getIn(['race_ethnicity', 'race_codes']) || List()),
  () => result.get('unable_to_determine_code'),
  (ethnicityTypes, raceTypes, unableToDetermineCodes, races, unableToDetermineCode) => {
    if (unableToDetermineCode) {
      return List([findByCode(unableToDetermineCodes.toJS(), unableToDetermineCode).value])
    } else {
      return races
        .map((race) => (Map({
          race: findByCode(raceTypes.toJS(), race.get('id')).value,
          race_detail: findByCode(ethnicityTypes.toJS(), race.get('id')).value,
        })))
    }
  }
)(state)

export const mapEthnicities = (state, result) => buildSelector(
  (state) => state.get('hispanicOriginCodes'),
  () => (result.getIn(['race_ethnicity', 'hispanic_codes']) || List()),
  () => (result.getIn(['race_ethnicity', 'hispanic_origin_code'])),
  (hispanicOriginCodes, ethnicities, hispanicLatinoOriginCode) => fromJS({
    hispanic_latino_origin: findByCode(hispanicOriginCodes.toJS(), hispanicLatinoOriginCode).value,
    ethnicity_detail: ethnicities.map((ethnicity) => ethnicity.get('description')).toJS(),
  })
)(state)

export const mapAddress = (state, result) => buildSelector(
  (state) => state.get('addressTypes'),
  () => (result.get('addresses') || List()).isEmpty(),
  () => result.getIn(['addresses', 0, 'city']),
  () => result.getIn(['addresses', 0, 'state_code']),
  () => result.getIn(['addresses', 0, 'zip']),
  () => result.getIn(['addresses', 0, 'type', 'id']),
  () => result.getIn(['addresses', 0, 'street_number']),
  () => result.getIn(['addresses', 0, 'street_name']),
  (addressTypes, addressesEmpty, city, stateCode, zip, typeId, streetNumber, streetName) => {
    if (addressesEmpty) { return null } else {
      const type = findByCode(addressTypes.toJS(), typeId).value
      return Map({
        city: city,
        state: stateCode,
        zip: zip,
        type: type ? type : '',
        streetAddress: `${streetNumber} ${streetName}`,
      })
    }
  }
)(state)
