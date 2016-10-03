import ScreeningDecision from 'ScreeningDecision'
import React from 'react'

export default class ScreeningDecisionFilter extends React.Component {
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
        <legend>Decision</legend>
        <ul className='unstyled-list'>
          {
            Object.keys(ScreeningDecision).map((item) => (
              <li key={item}>
                <input
                  id={`screening-decision-${item}`}
                  type='checkbox'
                  checked={(selected || []).includes(item)}
                  onChange={(event) => this.onChange(event, selected, item)}
                />
                <label htmlFor={`screening-decision-${item}`}>{ScreeningDecision[item]}</label>
              </li>
              ))
          }
        </ul>
      </fieldset>
    )
  }
}

ScreeningDecisionFilter.propTypes = {
  onChange: React.PropTypes.func,
  selected: React.PropTypes.array,
}
