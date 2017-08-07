import PropTypes from 'prop-types'
import React from 'react'

export default class CheckboxListFilter extends React.Component {
  constructor() {
    super(...arguments)
    this.onChange = this.onChange.bind(this)
  }

  onChange(event, checkedItems, item) {
    let newCheckedItems
    if (event.target.checked) {
      newCheckedItems = checkedItems.concat(item)
    } else {
      newCheckedItems = checkedItems.filter((ele) => ele !== item)
    }
    this.props.onChange(newCheckedItems)
  }

  render() {
    var {
      collection,
      name,
      selected,
    } = this.props

    return (
      <fieldset className='fieldset-inputs sans'>
        <legend>{this.props.legend}</legend>
        <ul className='unstyled-list'>
          {
            Object.keys(collection).map((item) => (
              <li key={item}>
                <input
                  id={`${name}-${item}`}
                  type='checkbox'
                  checked={(selected || []).includes(item)}
                  onChange={(event) => this.onChange(event, selected, item)}
                />
                <label htmlFor={`${name}-${item}`}>{collection[item]}</label>
              </li>
              ))
          }
        </ul>
      </fieldset>
    )
  }
}

CheckboxListFilter.defaultProps = {
  legend: '',
  name: 'checkbox-filter',
}

CheckboxListFilter.propTypes = {
  collection: PropTypes.object,
  legend: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  selected: PropTypes.array,
}
