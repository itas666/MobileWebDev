var shopApp = new Vue({
    el: '#shop',
    data: {
/* Array for our products */
        product: [
            {name: 'Math', price: 50, availability: 5, image: 'https://miro.medium.com/max/828/1*L76A5gL6176UbMgn7q4Ybg.jpeg', description: 'Math is a subject'}
        ],
/* Array for our cart where referenced items will be held */
        cart: {product: [], quantity: [], totalPrice: 0},
        total: 0,
        sorts: ['name', 'price', 'availability'],
        selectedSort: 'name',
        selectedOrder: 'ascending',
        checkoutStage: false,
        shopStage: true
    },
    methods: {
/* Adds a single product to the cart, if it exists, it increases the quantity by one and does not push the item */
        addToCart: function (index) {
            if (this.cart.product.indexOf(this.product[index]) == -1) {
                this.cart.product.push(this.product[index]);
                this.cart.quantity.push(1);
            } else {
                this.cart.quantity[this.cart.product.indexOf(this.product[index])] += 1;
            }
            this.product[index].availability -= 1;
            this.cart.totalPrice += this.product[index].price;
        },
/* Removes a single item from the cart and adds the availability back to the product list,
if it is the last product to be removed, also remove the entry from the carts products */
        removeFromCart: function (index) {
            var cartIndex = this.cart.product.indexOf(this.product[index]);
            this.cart.quantity[cartIndex] -= 1;
            this.product[index].availability += 1;
            this.cart.totalPrice -= this.product[index].price;
            if (this.cart.quantity[cartIndex] == 0) {
                this.cart.product.splice(cartIndex, 1);
                this.cart.quantity.splice(cartIndex, 1);
            }
        },
/* Clears up the cart completely by removing one by one the taken products
run through all cart and remove items while there is quantity */
        clearCart: function () {
            for (var i = 0; i < this.cart.product.length; i++) {
                while(this.cart.quantity[i] > 0) {
/* find the index of the product in the cart and remove it
the removeFromCart takes the index of the product, not the index of the cart */
                    this.removeFromCart(this.product.indexOf(this.cart.product[i]));
                }
            }
        },
/* Clears the cart, prompts a message thanking for the purchase but does not return the availability to the items */
        checkout: function () {
            this.checkoutStage = true;
            this.shopStage = false;
        },
        
        goBack: function () {
            this.checkoutStage = false;
            this.shopStage = true;
        },
/* Adds up the price in the cart */
        getCartTotal: function () {
            var total = 0;
            for (var i = 0; i < this.cart.length; i++) {
                total += this.cart[i].price;
            }
            return total;
        },
/* Takes the number of taken classes and returns the total price */
        getCartCount: function () {
            var count = 0;
            for (var i = 0; i < this.cart.length; i++) {
                count += this.cart[i].taken;
            }
            return count;
        },
        canAddToCart: function (index) {
            return this.product[index].availability > 0;
        },
        completeCheckout: function () {
            this.cart = {product: [], quantity: [], totalPrice: 0};
            alert('Thank you for your purchase!');
            this.goBack();
        }
    },
    computed: {
/* Sorts the products depending on the selected sort
Idea from: https://stackoverflow.com/questions/42883835/sort-an-array-in-vue-js */
        sortedProducts: function () {
            return this.product.sort((a, b) => {
                if (this.selectedOrder === 'ascending') {
                    return a[this.selectedSort] > b[this.selectedSort] ? 1 : -1;
                } else {
                    return a[this.selectedSort] < b[this.selectedSort] ? 1 : -1;
                }
            });
        }
    }
});