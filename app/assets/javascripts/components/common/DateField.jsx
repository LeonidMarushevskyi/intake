import ClassNames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
import _ from 'lodash'

momentLocalizer(moment)

const DateField = ({gridClassName, labelClassName, id, label, onChange, value, required, hasTime}) => {
  let dateValue
  if (_.isEmpty(value)) {
    dateValue = value
  } else {
    dateValue = moment(value, ['YYYY-MM-DD', 'MM/DD/YYYY h:mm A', moment.ISO_8601]).toDate()
  }

  const format = (hasTime === true) ? 'MM/DD/YYYY h:mm A' : 'MM/DD/YYYY'

  const proxyOnChange = (date, _) => {
    if (date === null) {
      onChange(null)
    } else {
      const dateOrDatetime = (hasTime === true) ? moment(date).toISOString() : moment(date).format('YYYY-MM-DD')
      onChange(dateOrDatetime)
    }
  }
  return (
    <div className={gridClassName}>
      <label className={ClassNames(labelClassName, {required: required})} htmlFor={`${id}_input`}>{label}</label>
      <DateTimePicker
        aria-required={required}
        calendar={true}
        defaultValue={dateValue}
        format={format}
        id={id}
        onChange={proxyOnChange}
        placeholder={format}
        required={required}
        time={hasTime}
      />
    </div>
  )
}

DateField.defaultProps = {
  hasTime: true,
}

DateField.propTypes = {
  gridClassName: PropTypes.string,
  hasTime: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
}
export default DateField
