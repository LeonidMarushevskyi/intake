import nameFormatter from 'utils/nameFormatter'

describe('nameFormatter', () => {
  it('renders a full name', () => {
    expect(nameFormatter({
      first_name: 'Foo',
      last_name: 'Bar',
    })).toEqual('Foo Bar')
  })

  it('renders with a blank first name', () => {
    expect(nameFormatter({
      first_name: null,
      last_name: 'Bar',
    })).toEqual('(Unknown first name) Bar')
  })

  it('renders with a blank last name', () => {
    expect(nameFormatter({
      first_name: 'Foo',
      last_name: null,
    })).toEqual('Foo (Unknown last name)')
  })

  it('renders with a blank first name and blank last name', () => {
    expect(nameFormatter({
      first_name: null,
      last_name: null,
    })).toEqual('Unknown Person')
  })

  it('Uses the nameDefault, when present, if there are no first and last names', () => {
    expect(nameFormatter({
      first_name: null,
      last_name: null,
      name_default: 'Unknown Clown',
    })).toEqual('Unknown Clown')
  })

  it('Accepts an empty string as a nameDefault', () => {
    expect(nameFormatter({
      first_name: null,
      last_name: null,
      name_default: '',
    })).toEqual('')
  })

  describe('with middle name', () => {
    it('renders nothing for blank middle name', () => {
      expect(nameFormatter({
        first_name: 'Bill',
        middle_name: null,
        last_name: 'Preston',
      })).toEqual('Bill Preston')
    })

    it('renders middle name', () => {
      expect(nameFormatter({
        first_name: 'Bill',
        middle_name: 'S.',
        last_name: 'Preston',
      })).toEqual('Bill S. Preston')
    })
  })

  describe('with suffix', () => {
    it('renders nothing for blank suffix', () => {
      expect(nameFormatter({
        first_name: 'Bill',
        middle_name: 'S.',
        last_name: 'Preston',
        name_suffix: null,
      })).toEqual('Bill S. Preston')
    })

    it('renders suffix with comma', () => {
      expect(nameFormatter({
        first_name: 'Bill',
        middle_name: 'S.',
        last_name: 'Preston',
        name_suffix: 'esq',
      })).toEqual('Bill S. Preston, Esq')
    })

    it('renders suffix without comma for II, III, and IV', () => {
      ['ii', 'iii', 'iv'].map((suffix) => {
        expect(nameFormatter({
          first_name: 'Bill',
          middle_name: 'S.',
          last_name: 'Preston',
          name_suffix: suffix,
        })).toEqual(`Bill S. Preston ${suffix.toUpperCase()}`)
      })
    })
  })

  describe('edge cases', () => {
    it('renders with a only middle name', () => {
      expect(nameFormatter({
        first_name: null,
        last_name: null,
        middle_name: 'S.',
        name_suffix: null,
      })).toEqual('Unknown S.')
    })

    it('renders with a only a suffix', () => {
      expect(nameFormatter({
        first_name: null,
        last_name: null,
        middle_name: null,
        name_suffix: 'esq',
      })).toEqual('Unknown Person')
    })

    it('renders with a only middle name and a suffix', () => {
      expect(nameFormatter({
        first_name: null,
        last_name: null,
        middle_name: 'S.',
        name_suffix: 'esq',
      })).toEqual('Unknown S., Esq')
    })

    it('renders with a only first name and middle name', () => {
      expect(nameFormatter({
        first_name: 'Bill',
        last_name: null,
        middle_name: 'S.',
        name_suffix: null,
      })).toEqual('Bill S. (Unknown last name)')
    })

    it('renders with a only last name and middle name', () => {
      expect(nameFormatter({
        first_name: null,
        last_name: 'Preston',
        middle_name: 'S.',
        name_suffix: null,
      })).toEqual('(Unknown first name) S. Preston')
    })

    it('renders with a only first name and suffix', () => {
      expect(nameFormatter({
        first_name: 'Bill',
        last_name: null,
        middle_name: null,
        name_suffix: 'esq',
      })).toEqual('Bill (Unknown last name), Esq')
    })

    it('renders with a only last name and suffix', () => {
      expect(nameFormatter({
        first_name: null,
        last_name: 'Preston',
        middle_name: null,
        name_suffix: 'esq',
      })).toEqual('(Unknown first name) Preston, Esq')
    })

    it('renders with a only first name, middle name, and suffix', () => {
      expect(nameFormatter({
        first_name: 'Bill',
        last_name: null,
        middle_name: 'S.',
        name_suffix: 'esq',
      })).toEqual('Bill S. (Unknown last name), Esq')
    })

    it('renders with a only last name, middle name, and suffix', () => {
      expect(nameFormatter({
        first_name: null,
        last_name: 'Preston',
        middle_name: 'S.',
        name_suffix: 'esq',
      })).toEqual('(Unknown first name) S. Preston, Esq')
    })
  })
})
