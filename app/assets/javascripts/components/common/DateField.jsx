import ClassNames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
import _ from 'lodash'

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
                    onChange,
                    required,
                    value,
                  }) => {
  let dateValue
  if (_.isEmpty(value)) {
    dateValue = value
  } else {
    dateValue = moment(value, ['YYYY-MM-DD', 'MM/DD/YYYY h:mm A', moment.ISO_8601]).toDate()
  }

  const format = (hasTime === true) ? 'MM/DD/YYYY h:mm A' : 'MM/DD/YYYY'
  const placeholder = (hasTime === true) ? 'MM/DD/YYYY HH:MM AM/PM' : 'MM/DD/YYYY'

  const proxyOnChange = (date, _) => {
    if (date === null) {
      onChange(null)
    } else {
      const dateOrDatetime = (hasTime === true) ? moment(date).toISOString() : moment(date).format('YYYY-MM-DD')
      onChange(dateOrDatetime)
    }
  }
  return (
    <div className={ClassNames(gridClassName, {'input-error': (errors && !errors.isEmpty())})}>
      <label
        className={ClassNames(labelClassName, {required: required}, {'input-error-label': (errors && !errors.isEmpty())})}
        htmlFor={`${id}_input`}
      >
        {label}
      </label>
      <DateTimePicker
        aria-required={required}
        calendar={hasCalendar}
        defaultValue={dateValue}
        format={format}
        id={id}
        onChange={proxyOnChange}
        placeholder={placeholder}
        required={required}
        time={hasTime}
        max={max}
        min={min}
      />
      <div>
        {errors && !errors.isEmpty() &&
          errors.map((error, index) =>
            <span key={index} className='input-error-message' role='alert' aria-describedby={id}>{error}</span>
            )
        }
      </div>
    </div>
  )
}

DateField.defaultProps = {
  hasTime: true,
  hasCalendar: true,
}

DateField.propTypes = {
  errors: PropTypes.object,
  gridClassName: PropTypes.string,
  hasCalendar: PropTypes.bool,
  hasTime: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  max: PropTypes.instanceOf(Date),
  min: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
}
export default DateField
