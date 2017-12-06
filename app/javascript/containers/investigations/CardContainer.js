import {connect} from 'react-redux'
import CardView from 'views/CardView'

const mapStateToProps = (state, {title, id, edit, show}) => ({
  mode: 'show',
  id,
  title,
  edit,
  show,
})

export default connect(mapStateToProps)(CardView)
