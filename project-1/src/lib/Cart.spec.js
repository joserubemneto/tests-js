import Cart from './Cart'

describe('Cart', () => {
  let cart

  let product = {
    title: 'Adidas running shoes - men',
    price: 35388,
  }

  let product2 = {
    title: 'Adidas running shoes - women',
    price: 41878,
  }

  beforeEach(() => {
    cart = new Cart()
  })

  describe('getTotal()', () => {
    it('should return 0 when getTotal() is executed in a newly create instance ', () => {
      expect(cart.getTotal().getAmount()).toEqual(0)
    })

    it('multiply quantity and price and receive the total amount', () => {
      const item = {
        product,
        quantity: 2,
      }

      cart.add(item)

      expect(cart.getTotal().getAmount()).toEqual(70776)
    })

    it('should ensure no more than one product exists at a time', () => {
      cart.add({
        product,
        quantity: 2,
      })

      cart.add({
        product,
        quantity: 1,
      })

      expect(cart.getTotal().getAmount()).toEqual(35388)
    })

    it('update total when a product get included and then removed', () => {
      cart.add({
        product,
        quantity: 2,
      })

      cart.add({
        product: product2,
        quantity: 1,
      })

      cart.remove(product)

      expect(cart.getTotal().getAmount()).toEqual(41878)
    })
  })

  describe('checkout()', () => {
    it('should return an object with the total an the list of items', () => {
      cart.add({
        product,
        quantity: 2,
      })

      cart.add({
        product: product2,
        quantity: 3,
      })

      expect(cart.checkout()).toStrictEqual({
        items: [
          {
            product: { price: 35388, title: 'Adidas running shoes - men' },
            quantity: 2,
          },
          {
            product: { price: 41878, title: 'Adidas running shoes - women' },
            quantity: 3,
          },
        ],
        total: 196410,
      })
    })

    it('should reset the cart when checkout() is called', () => {
      cart.add({
        product: product2,
        quantity: 3,
      })

      cart.checkout()

      expect(cart.getTotal().getAmount()).toEqual(0)
    })

    it('should return an object with the total and the list of items', () => {
      cart.add({
        product: product2,
        quantity: 3,
      })

      expect(cart.summary()).toStrictEqual({
        items: [
          {
            product: { price: 41878, title: 'Adidas running shoes - women' },
            quantity: 3,
          },
        ],
        total: 125634,
        formatted: 'R$1,256.34',
      })
      expect(cart.getTotal().getAmount()).toBeGreaterThan(0)
    })

    it('should include formatted amount in the summary', () => {
      cart.add({
        product: product2,
        quantity: 3,
      })

      expect(cart.summary().formatted).toEqual('R$1,256.34')
    })
  })

  describe('special conditions', () => {
    it('should apply percentage discount above minimum is passed', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      }

      cart.add({
        product,
        condition,
        quantity: 3,
      })

      expect(cart.getTotal().getAmount()).toEqual(74315)
    })

    it('should not apply percentage discount when quantity is below or equals minimun', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      }

      cart.add({
        product,
        condition,
        quantity: 2,
      })

      expect(cart.getTotal().getAmount()).toEqual(70776)
    })

    it('should apply quantity discount for even quantities', () => {
      const condition = {
        quantity: 2,
      }

      cart.add({
        product,
        condition,
        quantity: 4,
      })

      expect(cart.getTotal().getAmount()).toEqual(70776)
    })

    it('should not apply quantity discount for even quantities', () => {
      const condition = {
        quantity: 2,
      }

      cart.add({
        product,
        condition,
        quantity: 1,
      })

      expect(cart.getTotal().getAmount()).toEqual(35388)
    })

    it('should receive two or more conditions and apply the best discount', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      }

      const condition2 = {
        quantity: 2,
      }

      cart.add({
        product,
        condition: [condition, condition2],
        quantity: 4,
      })

      expect(cart.getTotal().getAmount()).toEqual(70776)
    })

    it('should receive two or more conditions and apply the best discount', () => {
      const condition = {
        percentage: 80,
        minimum: 2,
      }

      const condition2 = {
        quantity: 2,
      }

      cart.add({
        product,
        condition: [condition, condition2],
        quantity: 5,
      })

      expect(cart.getTotal().getAmount()).toEqual(35388)
    })
  })
})
