import _ from 'lodash'
import moment from 'moment'

export function dateFormatter(date) {
  if (_.isEmpty(date)) {
    return ''
  } else {
    return moment(date).format('MM/DD/YYYY')
  }
}

export function dateRangeFormatter({start_date, end_date}) {
  return [
    dateFormatter(start_date),
    dateFormatter(end_date),
  ].filter((dateString) => Boolean(dateString))
   .join(' - ') || 'No Date'
}
