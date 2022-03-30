import { queryString, parse } from './queryString'

describe('Object to query string', () => {
  it('should create a valid query string when an object is provided', () => {
    const obj = {
      name: 'Rubem',
      profession: 'developer',
    }

    expect(queryString(obj)).toBe('name=Rubem&profession=developer')
  })

  it('should create a valid query string when an array is passed as value', () => {
    const obj = {
      name: 'Rubem',
      profession: 'developer',
      skills: ['JS', 'TDD'],
    }

    expect(queryString(obj)).toBe(
      'name=Rubem&profession=developer&skills=JS,TDD',
    )
  })

  it('should throw an error when an object is passed as value', () => {
    const obj = {
      name: 'Rubem',
      profession: 'developer',
      skills: { first: 'JS', second: 'TDD' },
    }

    expect(() => {
      queryString(obj)
    }).toThrowError()
  })
})

describe('Query string to object', () => {
  it('shoud convert a query string to object', () => {
    const qs = 'name=Rubem&profession=developer'

    expect(parse(qs)).toEqual({
      name: 'Rubem',
      profession: 'developer',
    })
  })

  it('shoud convert a query string of a single key-value to object', () => {
    const qs = 'name=Rubem'

    expect(parse(qs)).toEqual({
      name: 'Rubem',
    })
  })

  it('should convert a query string to an object taking care of comma separeted values', () => {
    const qs = 'name=Rubem&skills=JS,TDD'

    expect(parse(qs)).toEqual({
      name: 'Rubem',
      skills: ['JS', 'TDD'],
    })
  })
})
