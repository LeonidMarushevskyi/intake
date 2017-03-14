import nameFormatter from 'utils/nameFormatter'
import Immutable from 'immutable'

describe('nameFormatter', () => {
  it('renders a full name', () => {
    expect(nameFormatter(Immutable.fromJS({
      first_name: 'Foo',
      last_name: 'Bar',
    }))).toEqual('Foo Bar')
  })

  it('Renders with a blank first name', () => {
    expect(nameFormatter(Immutable.fromJS({
      first_name: null,
      last_name: 'Bar',
    }))).toEqual('(Unknown first name) Bar')
  })

  it('renders with a blank last name', () => {
    expect(nameFormatter(Immutable.fromJS({
      first_name: 'Foo',
      last_name: null,
    }))).toEqual('Foo (Unknown last name)')
  })

  it('renders with a blank first name and blank last name', () => {
    expect(nameFormatter(Immutable.fromJS({
      first_name: null,
      last_name: null,
    }))).toEqual('Unknown person')
  })
})
