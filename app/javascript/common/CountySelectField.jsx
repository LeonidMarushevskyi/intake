import React from 'react'
import SelectField from 'common/SelectField'
import PropTypes from 'prop-types'

class CountySelectField extends React.Component {
  render() {
    const {
      countyCodes,
      gridClassName,
      id,
      onChange,
      value,
    } = this.props

    return (
      <SelectField
        gridClassName={gridClassName}
        id={id}
        label='County'
        onChange={onChange}
        value={value}
      >
        <option key='' />
        {countyCodes.map((county) => <option key={county.code} value={county.code}>{county.value}</option>)}
      </SelectField>
    )
  }
}

CountySelectField.propTypes = {
  countyCodes: PropTypes.array.isRequired,
  gridClassName: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

CountySelectField.defaultProps = {
  value: '',
}

export default CountySelectField
