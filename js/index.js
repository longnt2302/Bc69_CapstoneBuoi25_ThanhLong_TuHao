// .toLocaleString('vi', {style : 'currency', currency : 'VND'})

document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://667fb4bdf2cb59c38dc98c1f.mockapi.io/bc69/';
    let allProducts = [];
    let cart = []; // Mảng giỏ hàng

    async function fetchProducts() {
        try {
            const response = await fetch(apiURL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProducts = await response.json();
            renderProducts(allProducts);
            setupFilter(); // Cài đặt sự kiện cho dropdown filter
        } catch (error) {
            alert(`Failed to fetch products: ${error.message}`);
        }
    }

    function renderProducts(products) {
        const productList = document.getElementById('product-list');
        productList.innerHTML = products.map(product => `
            <div class="col-md-4">
                <div class="card">
                    <img src="${product.img}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text"><strong>Price: </strong>${product.price.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</p>
                        <p class="card-text"><strong>Back Camera: </strong>${product.backCamera}</p>
                        <p class="card-text"><strong>Front Camera: </strong>${product.frontCamera}</p>
                        <p class="card-text"><strong>Type: </strong>${product.type}</p>
                        <p class="card-text"><strong>Description: </strong>${product.desc}</p>
                        <button class="cart-btn" id="liveToastBtn" onclick="addToCart('${product.id}')"><i class="fa fa-shopping-cart"></i></button>
                        <button class="buy-btn" onclick="buyNow('${product.id}')">Mua ngay</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function setupFilter() {
        const filterSelect = document.getElementById('filter');
        //  Khi người dùng chọn một tùy chọn khác trong dropdown, sự kiện change sẽ được kích hoạt và hàm được truyền vào sẽ được gọi.
        filterSelect.addEventListener('change', (event) => {
            filterProductsByType(event.target.value);
           // event.target.value là giá trị của tùy chọn được chọn trong dropdown (ví dụ: "all", "android", "ios").
        });
    }

    function filterProductsByType(type) {
        let filteredProducts;
        if (type === 'all') {
            filteredProducts = allProducts;
        } else {
            filteredProducts = allProducts.filter(product => product.type === type);
        }
        renderProducts(filteredProducts);
    }

    window.addToCart = function(productId) {
        const product = allProducts.find(p => p.id === productId);
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1 // Số lượng mặc định là 1 khi thêm vào giỏ hàng
        };

        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1; // Nếu có rồi thì tăng số lượng lên 1
        } else {
            cart.push(cartItem); // Nếu chưa có thì thêm vào giỏ hàng
        }

        renderCart();
    }

    window.buyNow = function(productId) {
        addToCart(productId);
        $('#cartModal').modal('show'); // Mở modal giỏ hàng
    }

    

    function renderCart() {
        const cartList = document.getElementById('cart-list');
        const totalPriceEl = document.getElementById('total-price');
        let totalPrice = 0;

        cartList.innerHTML = cart.map(item => `
            <div class="col-12 mb-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5>${item.name}</h5>
                        <p>Price: ${item.price.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</p>
                        <p>Quantity: <button onclick="changeQuantity('${item.id}', -1)" class="btn btn-sm btn-outline-secondary">-</button> ${item.quantity} <button onclick="changeQuantity('${item.id}', 1)" class="btn btn-sm btn-outline-secondary">+</button></p>
                    </div>
                    <div>
                        <h5>${(item.price * item.quantity).toLocaleString('vi', {style : 'currency', currency : 'VND'})}</h5>
                    </div>
                </div>
            </div>
        `).join('');

        cart.forEach(item => {
            totalPrice += item.price * item.quantity;
        });

        totalPriceEl.innerText = `Tổng tiền: ${totalPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})}`;
    }

    window.changeQuantity = function(productId, amount) {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity += amount;
            if (item.quantity < 1) {
                item.quantity = 1; // Đảm bảo số lượng tối thiểu là 1
            }
            renderCart();
        }
    }

    document.getElementById('cart-button').addEventListener('click', () => {
        renderCart();
        $('#cartModal').modal('show');
    });

    fetchProducts();
});
