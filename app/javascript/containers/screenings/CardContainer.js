import {connect} from 'react-redux'
import CardView from 'views/CardView'
import {setCardMode, EDIT_MODE} from 'actions/screeningPageActions'
import {
  getCardModeValueSelector,
  getCardIsEditableSelector,
} from 'selectors/screening/screeningPageSelectors'

const mapStateToProps = (state, {title, id, edit, show}) => ({
  editable: getCardIsEditableSelector(state, id),
  mode: getCardModeValueSelector(state, id),
  id,
  title,
  edit,
  show,
})

const mergeProps = ({editable, ...cardProps}, {dispatch}, {id}) => {
  const onEdit = () => dispatch(setCardMode(id, EDIT_MODE))
  return {
    onEdit: (editable ? onEdit : undefined),
    ...cardProps,
  }
}

export default connect(mapStateToProps, null, mergeProps)(CardView)

