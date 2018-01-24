import {connect} from 'react-redux'
import PersonInformationForm from 'views/people/PersonInformationForm'
import NAME_SUFFIXES from 'enums/NameSuffixes'
import {Map} from 'immutable'
import {
  getPeopleSelector,
  getRolesSelector,
  getFilteredPersonRolesSelector,
  getFirstNameSelector,
  getLastNameSelector,
  getPersonAlertErrorMessageSelector,
  getSocialSecurityNumberSelector,
} from 'selectors/screening/peopleFormSelectors'
import {setField, touchField} from 'actions/peopleFormActions'
import legacySourceFormatter from 'utils/legacySourceFormatter'

const mapStateToProps = (state, {personId}) => {
  const nameSuffixOptions = Object.keys(NAME_SUFFIXES).map((value) => (
    {label: NAME_SUFFIXES[value], value}
  ))
  const person = getPeopleSelector(state).get(personId)
  const legacySourceDescription = legacySourceFormatter(person.getIn(['legacy_descriptor', 'value'], Map()).toJS())
  return {
    alertErrorMessage: getPersonAlertErrorMessageSelector(state, personId),
    personId,
    roles: getRolesSelector(state, personId).toJS(),
    legacySourceDescription,
    firstName: getFirstNameSelector(state, personId).toJS(),
    middleName: person.getIn(['middle_name', 'value']),
    lastName: getLastNameSelector(state, personId).toJS(),
    nameSuffix: person.getIn(['name_suffix', 'value']),
    ssn: getSocialSecurityNumberSelector(state, personId).toJS(),
    nameSuffixOptions,
    roleOptions: getFilteredPersonRolesSelector(state, personId).toJS(),
  }
}

const mergeProps = ({
  alertErrorMessage,
  personId,
  roles,
  legacySourceDescription,
  firstName,
  middleName,
  lastName,
  nameSuffix,
  ssn,
  nameSuffixOptions,
  roleOptions,
}, {dispatch}) => {
  const onBlur = (field) => dispatch(touchField(personId, [field]))
  const onChange = (field, value) => dispatch(setField(personId, [field], value))
  return {
    alertErrorMessage,
    personId,
    roles,
    legacySourceDescription,
    firstName,
    middleName,
    lastName,
    nameSuffix,
    ssn,
    nameSuffixOptions,
    roleOptions,
    onBlur,
    onChange,
  }
}
export default connect(mapStateToProps, null, mergeProps)(PersonInformationForm)
