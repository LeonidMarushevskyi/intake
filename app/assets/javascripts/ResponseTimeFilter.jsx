import ResponseTime from 'ResponseTime'
import React from 'react'

export default class ResponseTimeFilter extends React.Component {
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
    var {selected} = this.props

    return (
      <fieldset className='fieldset-inputs sans'>
        <legend>Response Time</legend>
        <ul className='unstyled-list'>
          {
            Object.keys(ResponseTime).map((item) => (
              <li key={item}>
                <input
                  id={`response-time-${item}`}
                  type='checkbox'
                  checked={(selected || []).includes(item)}
                  onChange={(event) => this.onChange(event, selected, item)}
                />
                <label htmlFor={`response-time-${item}`}>{ResponseTime[item]}</label>
              </li>
              ))
          }
        </ul>
      </fieldset>
    )
  }
}

ResponseTimeFilter.propTypes = {
  onChange: React.PropTypes.func,
  selected: React.PropTypes.array,
}
