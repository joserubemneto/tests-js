import Dinero from 'dinero.js'

const Money = Dinero

Money.defaultCurrency = 'BRL'
Money.defaultPrecision = 2

const calculatePercentageDiscount = (amount, { condition, quantity }) => {
  if (condition && quantity > condition.minimum) {
    return amount.percentage(condition.percentage)
  }

  return Money({ amount: 0 })
}

const calculateQuantityDiscount = (amount, { condition, quantity }) => {
  debugger
  if (condition?.quantity && quantity > condition.quantity) {
    return amount.percentage(50)
  }

  return Money({ amount: 0 })
}

export const calculateDiscount = (amount, quantity, condition) => {
  const list = Array.isArray(condition) ? condition : [condition]

  const [higherDiscount] = list
    .map(cond => {
      if (cond.percentage) {
        return calculatePercentageDiscount(amount, {
          condition: cond,
          quantity,
        }).getAmount()
      }

      if (cond.quantity) {
        return calculateQuantityDiscount(amount, {
          condition: cond,
          quantity,
        }).getAmount()
      }
    })
    .sort((a, b) => b - a)

  return Money({ amount: higherDiscount })
}
