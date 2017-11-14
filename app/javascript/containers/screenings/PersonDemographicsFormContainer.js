import {connect} from 'react-redux'
import {
  getIsApproximateAgeDisabledSelector,
  getPersonDemographicsSelector,
  getApproximateAgeUnitOptionsSelector,
  getLanguageOptionsSelector,
  getGenderOptionsSelector,
} from 'selectors/screening/peopleFormSelectors'
import {setField} from 'actions/peopleFormActions'
import {MAX_LANGUAGES} from 'common/LanguageInfo'
import PersonDemographicsForm from 'views/people/PersonDemographicsForm'

const mapStateToProps = (state, {personId}) => (
  {
    approximateAgeUnitOptions: getApproximateAgeUnitOptionsSelector().toJS(),
    approximateAgeIsDisabled: getIsApproximateAgeDisabledSelector(state, personId),
    genderOptions: getGenderOptionsSelector().toJS(),
    languageOptions: getLanguageOptionsSelector().toJS(),
    ...getPersonDemographicsSelector(state, personId).toJS(),
  }
)

const mergeProps = (stateProps, {dispatch}, {personId}) => {
  const onChange = (field, value) => {
    switch (field) {
      case 'languages':
      {
        const trimmedLanguages = value.slice(0, MAX_LANGUAGES).map((languages) => languages.value) || []
        dispatch(setField(personId, ['languages'], trimmedLanguages))
        break
      }
      case 'date_of_birth':
      {
        dispatch(setField(personId, [field], value))
        dispatch(setField(personId, ['approximate_age'], null))
        dispatch(setField(personId, ['approximate_age_units'], null))
        break
      }
      default:
      {
        dispatch(setField(personId, [field], value))
      }
    }
  }
  return {onChange, personId, ...stateProps}
}
export default connect(mapStateToProps, null, mergeProps)(PersonDemographicsForm)
