import Dinero from 'dinero.js'
import { calculateDiscount } from './discountUtils'

const Money = Dinero

Money.defaultCurrency = 'BRL'
Money.defaultPrecision = 2

export default class Cart {
  items = []

  add(item) {
    const itemToFind = item.product
    if (this.items.find(i => i.product === itemToFind)) {
      this.items = this.items.filter(i => i.product !== itemToFind)
    }

    this.items.push(item)
  }

  remove(product) {
    this.items = this.items.filter(i => i.product !== product)
  }

  getTotal() {
    return this.items.reduce((acc, { quantity, product, condition }) => {
      const amount = Money({ amount: quantity * product.price })

      let discount = Money({ amount: 0 })

      if (condition) {
        discount = calculateDiscount(amount, quantity, condition)
      }

      return acc.add(amount).subtract(discount)
    }, Money({ amount: 0 }))
  }

  summary() {
    const total = this.getTotal().getAmount()
    const formatted = this.getTotal().toFormat('$0,0.00')
    const items = this.items

    return {
      total,
      formatted,
      items,
    }
  }

  checkout() {
    const { total, items } = this.summary()

    this.items = []

    return {
      total,
      items,
    }
  }
}
