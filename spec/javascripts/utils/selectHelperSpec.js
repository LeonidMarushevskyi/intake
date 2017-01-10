import selectOptions from 'utils/selectHelper'

describe('selectOptions', () => {
  it('transforms a options array to a selectOptions hash', () => {
    const options = ['one', 'two', 'three']
    expect(selectOptions(options)).toEqual([
      {label: 'one', value: 'one'},
      {label: 'two', value: 'two'},
      {label: 'three', value: 'three'},
    ])
  })
})
