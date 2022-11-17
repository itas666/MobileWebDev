/*
Display lessons
A. There should be at least 10 lessons and each lesson has 5 spaces (1%). DONE
B. Each lesson should have at least (2%): Subject, Location, Price, Space (how many spaces are left),
    a Font Awesome icon, and an Image. 1/2
C. The list of lessons must be stored as an array of JSON objects, one object for each lesson,
    in a separate JavaScript file, such as lessons.js (1%). DONE
D. v-for has to be used for the display of the lesson list (1%). DONE

Sort
A. The user can choose to sort the lessons by one of the following attributes: subject,
    location, price, or availability (4%). DONE
B. There must be an option to sort in ascending or descending order, regardless of
    the attribute selected (1%). DONE

Add to cart
A. Each lesson must have an ’Add to Cart’ button (1%). DONE
B. The button is only enabled when space is larger than 0 (1%). DONE
C. Clicking the button once will add one space to the shopping cart, reducing
    the remaining space by one (2%). DONE
D. Once there is no more space, i.e. space = 0, the ’Add to cart’ button should
    be disabled but still visible, i.e. clicking it will not further reduce
    ‘space’ or add lessons to the cart (1%). DONE

Shopping cart
A. The shopping cart button should only be enabled after at least one lesson is
    added to cart (1%). Done
B. Clicking the shopping cart button should show the cart, and clicking the
    button again goes back to the lesson page (1%). DONE
C. The shopping cart should show all the lessons added (1%). DONE
D. The user should be able to remove lessons from the shopping cart; the removed
    lesson is added back to the lesson list (2%). DONE

Checkout
A. The checkout is part of the shopping cart page (1%). DONE
B. A user must provide ‘Name’ and ‘Phone number’ before can check out (1%). DONE
C. The ’Name’ must be letters only and the ’Phone’ must be numbers only; the check
    must be done using JavaScript (suggestion: regular expressions) (1%). DONE
D. The ’checkout’ button is only enabled after valid ’name’ and ’phone’ are provided (1%). DONE
E. Clicking the ’checkout’ button should display a message confirming the
    order has been submitted (1%). DONE

Search
[Intro] This is the challenge component of this coursework, and it is not expected that everyone can complete it. The solution is not covered in the Lecture or Lab, so you need to research it.
[Feature Description]. The goal is to add a full-text search feature, so the user can search for a lesson without specifying which attribute to search on. For example, searching for ‘a’ should return all the lessons with ‘a’ in its title or location (‘price’ and ‘availability’ only have numbers so do not apply here).

Related Solutions are marked as follows.

[Base Points]
Writing your own search function (4%): you will receive maximum 4 marks if you write your own search function, which again does not have to use Vue.js. DONE

[Further Point]
C. Search as you type (1%): in either case, you will get an additional 1 mark if the search supports ‘search as you type’, i.e. the search starts when the user types the first letter (displaying all the lessons containing that letter) and the result list is filtered as more search letters are entered (similar to Google search). DONE
Maximum score5
*/


var shopApp = new Vue({
    el: '#shop',
    data: {
/* Array for our products */
        product: products,
/* Array for our cart where referenced products will be held */
        cart: {product: [], quantity: [], totalPrice: 0},
        total: 0,
        sorts: ['name', 'price', 'availability', 'location'],
        selectedSort: 'name',
        selectedOrder: 'ascending',
        checkoutStage: false,
        shopStage: true,
        checkoutName: '',
        checkoutPhone: '',
        search: ''
    },
    methods: {
/* Adds a single product to the cart, if it exists, it increases the quantity by one and does not push the item */
        addToCart: function (index) {
            if(this.canAddToCart(index)){
                if (this.cart.product.indexOf(this.product[index]) == -1) {
                    this.cart.product.push(this.product[index]);
                    this.cart.quantity.push(1);
                } else {
                    this.cart.quantity[this.cart.product.indexOf(this.product[index])] += 1;
                }
                this.product[index].availability -= 1;
                this.cart.totalPrice += this.product[index].price;
            }
            this.$forceUpdate();
        },
/* Removes a single item from the cart and adds the availability back to the product list,
if it is the last product to be removed, also remove the entry from the carts products */
        removeFromCart: function (index) {
            if(this.canRemoveFromCart(index)){
                var cartIndex = this.cart.product.indexOf(this.product[index]);
                if(this.cart.quantity[cartIndex] == 1 && cartIndex != -1) {
                    this.cart.totalPrice -= this.product[index].price;
                    this.cart.product.splice(cartIndex, 1);
                    this.cart.quantity.splice(cartIndex, 1);
                } else {
                    this.cart.quantity[cartIndex] -= 1;
                }
                this.product[index].availability += 1;
                this.cart.totalPrice -= this.product[index].price;
            }
            this.$forceUpdate();
        },
        canRemoveFromCart: function (index) {
            var cartIndex = this.cart.product.indexOf(this.product[index]);
            if(cartIndex != -1) {
                return true;
            }
            return false;
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
/* Helper function to check if we can add to cart */
        canAddToCart: function (index) {
            return this.product[index].availability > 0;
        },
/* The checkout function just recreates the cart and empties it */
        completeCheckout: function () {
            this.cart = {product: [], quantity: [], totalPrice: 0};
            alert('Thank you for your purchase!');
            this.goBack();
        },
        validateName: function () {
            return /^[a-zA-Z]+ [a-zA-Z]+$/.test(this.checkoutName);
        },
        validatePhone: function () {
            return /^(\+44|0)7\d{9}$/.test(this.checkoutPhone);
        },
        validateCheckout: function () {
            return this.validateName() && this.validatePhone();
        },
/* Takes the number of taken classes and returns the total price
 THIS WILL NOT WORK AS COMPUTED, DOES NOT UPDATE */
        getCartCount: function () {
            return this.cart.quantity.reduce((sum, a) => sum + a, 0);;
        }
    },
    computed: {
        canCheckout: function () {
            return this.cart.product.length > 0;
        },
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
        },
/* Filtering function for the search bar according to what we have on the
product array and starts with what is on the search variable */
        filteredProducts: function () {
            return this.sortedProducts.filter((product) => {
                if(product.name.toLowerCase().startsWith(this.search.toLowerCase())
                    || product.description.toLowerCase().includes(this.search.toLowerCase())
                    || product.location.toLowerCase().startsWith(this.search.toLowerCase())
                    || (product.price >= parseInt(this.search)) || (product.availability >= parseInt(this.search))) {
                        return true;
                    }
                return false;
            });
        },
/* autocomplete for the search bar; if search is empty, do not return anything
when search has any data, return the first name of a product returned */
        autocomplete: function () {
            if (this.search == '') {
                return '';
            } else if (this.filteredProducts.length > 0) {
                return this.filteredProducts[0].name;
            }
            return '';
        }
    }   
});