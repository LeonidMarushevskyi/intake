import {connect} from 'react-redux'
import PersonForm from 'views/people/PersonForm'
import {ROLE_TYPE} from 'enums/RoleType'
import {getPeopleSelector, getPeopleRoleOptionsSelector} from 'selectors/peopleFormSelectors'

const mapStateToProps = (state, {personId}) => {
  const roleOptions = ROLE_TYPE.map((value) => ({label: value, value}))
  const person = getPeopleSelector(state).get(personId)
  return {
    personId,
    roles: person.getIn(['roles', 'value']).toJS(),
    roleOptions,
  }
}
export default connect(mapStateToProps)(PersonForm)
