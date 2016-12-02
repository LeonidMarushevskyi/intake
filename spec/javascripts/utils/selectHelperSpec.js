import {selectOptions} from 'utils/selectHelper'

describe('selectOptions', () => {
  it('transforms a lookupObject to a selectOptions hash', () => {
    const lookupObject = {
      key_one: 'one',
      key_two: 'two',
      key_three: 'three',
    }
    expect(selectOptions(lookupObject)).toEqual([
      {label: 'one', value: 'key_one'},
      {label: 'two', value: 'key_two'},
      {label: 'three', value: 'key_three'},
    ])
  })
})
