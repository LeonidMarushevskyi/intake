import _ from 'lodash'
import moment from 'moment'

export function dateFormatter(date) {
  if (_.isEmpty(date)) {
    return ''
  } else {
    return moment(date).format('MM/DD/YYYY')
  }
}

export function dateRangeFormatter(dateableObject) {
  const formattedDates = []

  const startedAt = dateableObject.get('start_date')
  if (startedAt) {
    formattedDates.push(dateFormatter(startedAt))
  }

  const endedAt = dateableObject.get('end_date')
  if (endedAt) {
    formattedDates.push(dateFormatter(endedAt))
  }

  if (startedAt || endedAt) {
    return formattedDates.join(' - ')
  } else {
    return 'No Date'
  }
}
