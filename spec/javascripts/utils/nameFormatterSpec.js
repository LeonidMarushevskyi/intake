import nameFormatter from 'utils/nameFormatter'
import Immutable from 'immutable'

describe('nameFormatter', () => {
  it('renders a full name', () => {
    expect(nameFormatter(Immutable.fromJS({
      first_name: 'Foo',
      last_name: 'Bar',
    }))).toEqual('Foo Bar')
  })

  it('renders a full name for related people', () => {
    expect(nameFormatter(Immutable.fromJS({
      related_person_first_name: 'Foo',
      related_person_last_name: 'Bar',
    }))).toEqual('Foo Bar')
  })

  it('renders with a blank first name', () => {
    expect(nameFormatter(Immutable.fromJS({
      first_name: null,
      last_name: 'Bar',
    }))).toEqual('(Unknown first name) Bar')
  })

  it('renders with a blank related person first name', () => {
    expect(nameFormatter(Immutable.fromJS({
      related_person_first_name: null,
      related_person_last_name: 'Bar',
    }))).toEqual('(Unknown first name) Bar')
  })

  it('renders with a blank last name', () => {
    expect(nameFormatter(Immutable.fromJS({
      first_name: 'Foo',
      last_name: null,
    }))).toEqual('Foo (Unknown last name)')
  })

  it('renders with a blank related person last name', () => {
    expect(nameFormatter(Immutable.fromJS({
      related_person_first_name: 'Foo',
      related_person_last_name: null,
    }))).toEqual('Foo (Unknown last name)')
  })

  it('renders with a blank first name and blank last name', () => {
    expect(nameFormatter(Immutable.fromJS({
      first_name: null,
      last_name: null,
    }))).toEqual('Unknown person')
  })

  describe('with middle name', () => {
    it('renders nothing for blank middle name', () => {
      expect(nameFormatter(Immutable.fromJS({
        first_name: 'Bill',
        middle_name: null,
        last_name: 'Preston',
      }))).toEqual('Bill Preston')
    })

    it('renders middle name', () => {
      expect(nameFormatter(Immutable.fromJS({
        first_name: 'Bill',
        middle_name: 'S.',
        last_name: 'Preston',
      }))).toEqual('Bill S. Preston')
    })
  })

  describe('with suffix', () => {
    it('renders nothing for blank suffix', () => {
      expect(nameFormatter(Immutable.fromJS({
        first_name: 'Bill',
        middle_name: 'S.',
        last_name: 'Preston',
        name_suffix: null,
      }))).toEqual('Bill S. Preston')
    })

    it('renders suffix with comma', () => {
      expect(nameFormatter(Immutable.fromJS({
        first_name: 'Bill',
        middle_name: 'S.',
        last_name: 'Preston',
        name_suffix: 'esq',
      }))).toEqual('Bill S. Preston, Esq')
    })

    it('renders suffix without comma for II, III, and IV', () => {
      Immutable.List(['ii', 'iii', 'iv']).map((suffix) => {
        expect(nameFormatter(Immutable.fromJS({
          first_name: 'Bill',
          middle_name: 'S.',
          last_name: 'Preston',
          name_suffix: suffix,
        }))).toEqual(`Bill S. Preston ${suffix.toUpperCase()}`)
      })
    })
  })
})

