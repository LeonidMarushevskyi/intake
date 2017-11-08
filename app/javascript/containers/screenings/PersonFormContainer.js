import {connect} from 'react-redux'
import PersonForm from 'views/people/PersonForm'
import {ROLE_TYPE} from 'enums/RoleType'
import {Map} from 'immutable'
import {getPeopleSelector} from 'selectors/peopleFormSelectors'
import legacySourceFormatter from 'utils/legacySourceFormatter'

const mapStateToProps = (state, {personId}) => {
  const roleOptions = ROLE_TYPE.map((value) => ({label: value, value}))
  const person = getPeopleSelector(state).get(personId)
  const roles = person.getIn(['roles', 'value']).toJS()
  const legacySourceDescription = legacySourceFormatter(person.getIn(['legacy_descriptor', 'value'], Map()).toJS())
  return {
    personId,
    roles,
    legacySourceDescription,
    firstName: person.getIn(['first_name', 'value']),
    middleName: person.getIn(['middle_name', 'value']),
    lastName: person.getIn(['last_name', 'value']),
    roleOptions,
  }
}
export default connect(mapStateToProps)(PersonForm)
