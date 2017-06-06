import _ from 'lodash'
import moment from 'moment'

const dateFormatter = (date) => {
  if (_.isEmpty(date)) {
    return ''
  } else {
    return moment(date).format('MM/DD/YYYY')
  }
}

export default dateFormatter
