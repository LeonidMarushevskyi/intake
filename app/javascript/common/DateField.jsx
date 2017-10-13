import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import FormField from 'common/FormField'
import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'

momentLocalizer(moment)

const DateField = ({
  errors,
  gridClassName,
  hasCalendar,
  hasTime,
  id,
  label,
  labelClassName,
  max,
  min,
  onBlur,
  onChange,
  required,
  value,
}) => {
  const parseDate = (date) => (
    moment(date, ['YYYY-MM-DD', 'MM/DD/YYYY h:mm A', moment.ISO_8601])
  )

  let dateValue
  if (_.isEmpty(value)) {
    dateValue = null
  } else {
    dateValue = parseDate(value).toDate()
  }

  const format = (hasTime === true) ? 'MM/DD/YYYY h:mm A' : 'MM/DD/YYYY'
  const placeholder = (hasTime === true) ? 'MM/DD/YYYY HH:MM AM/PM' : 'MM/DD/YYYY'

  const proxyOnChange = (date, _) => {
    if (date === null) {
      onChange(null)
    } else {
      const dateOrDatetime = (hasTime === true) ? parseDate(date).toISOString() : parseDate(date).format('YYYY-MM-DD')
      onChange(dateOrDatetime)
    }
  }

  const proxyOnBlur = (event) => {
    if (onBlur) {
      const rawDate = event.target.value
      if (_.isEmpty(rawDate)) {
        onBlur(null)
      } else {
        onBlur(parseDate(rawDate).toISOString())
      }
    }
  }

  return (
    <FormField htmlFor={`${id}_input`} label={label} gridClassName={gridClassName} labelClassName={labelClassName}
      required={required} errors={errors}
    >
      <DateTimePicker
        aria-required={required}
        calendar={hasCalendar}
        defaultValue={dateValue}
        format={format}
        id={id}
        onBlur={proxyOnBlur}
        onChange={proxyOnChange}
        placeholder={placeholder}
        required={required}
        time={hasTime}
        max={max}
        min={min}
      />
    </FormField>
  )
}

DateField.defaultProps = {
  hasTime: true,
  hasCalendar: true,
}

DateField.propTypes = {
  errors: PropTypes.array,
  gridClassName: PropTypes.string,
  hasCalendar: PropTypes.bool,
  hasTime: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  max: PropTypes.instanceOf(Date),
  min: PropTypes.instanceOf(Date),
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
}
export default DateField
