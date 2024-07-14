// .toLocaleString('vi', {style : 'currency', currency : 'VND'})

document.addEventListener("DOMContentLoaded", () => {
  // Khai báo URL API và mảng sản phẩm
  const apiURL = "https://667fb4bdf2cb59c38dc98c1f.mockapi.io/bc69/";
  let allProducts = [];
  let cart = loadCart(); // Load giỏ hàng từ localStorage

  // Hàm lấy dữ liệu sản phẩm từ API
  async function fetchProducts() {
    try {
      const response = await fetch(apiURL); // Gửi yêu cầu GET tới API
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } // báo lỗi theo status nếu phản hồi không thành công
      allProducts = await response.json(); // Chuyển đổi phản hồi thành JSON và lưu vào allProducts
      renderProducts(allProducts); // Hiển thị danh sách sản phẩm
      setupFilter(); // Cài đặt sự kiện cho dropdown filter
    } catch (error) {
      alert(`Failed to fetch products: ${error.message}`); // Hiển thị thông báo lỗi nếu có
    }
  }

  // Hàm hiển thị danh sách sản phẩm
  function renderProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = products
      .map(
        (product) => `
            <div class="col-md-4">
                <div class="card">
                    <img src="${product.img}" class="card-img-top" alt="${
          product.name
        }">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text"><strong>Price: </strong>${product.price.toLocaleString(
                          "vi",
                          { style: "currency", currency: "VND" }
                        )}</p>
                        <p class="card-text"><strong>Back Camera: </strong>${
                          product.backCamera
                        }</p>
                        <p class="card-text"><strong>Front Camera: </strong>${
                          product.frontCamera
                        }</p>
                        <p class="card-text"><strong>Type: </strong>${
                          product.type
                        }</p>
                        <p class="card-text"><strong>Description: </strong>${product.desc.substring(
                          0,
                          150
                        )}...</p>
                        <button class="cart-btn" onclick="addToCart('${
                          product.id
                        }')"><i class="fa fa-shopping-cart"></i></button>
                        <button class="buy-btn" onclick="buyNow('${
                          product.id
                        }')">Mua ngay</button>
                    </div>
                </div>
            </div>
        `
      )
      .join(""); // Ghép tất cả các phần tử trong mảng thành một chuỗi
  }

  // Hàm cài đặt sự kiện filter
  function setupFilter() {
    const filterSelect = document.getElementById("filter");
    filterSelect.addEventListener("change", (event) => {
      filterProductsByType(event.target.value); // Lọc sản phẩm theo loại mà người dùng bấm
    });
  }

  // Hàm lọc sản phẩm theo loại
  function filterProductsByType(type) {
    let filteredProducts;
    if (type === "all") {
      filteredProducts = allProducts; // Hiển thị tất cả sản phẩm nếu chọn "all"
    } else {
      filteredProducts = allProducts.filter((product) => product.type === type);
    } // Lọc sản phẩm theo loại
    renderProducts(filteredProducts); // Hiển thị danh sách sản phẩm đã lọc
  }

  // Hàm thêm sản phẩm vào giỏ hàng
  window.addToCart = function (productId) {
    const product = allProducts.find((p) => p.id === productId); // Tìm sản phẩm theo ID
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1, // Số lượng mặc định là 1 khi thêm vào giỏ hàng
    };

    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1; // Nếu đã có sản phẩm thì tăng số lượng lên 1
    } else {
      cart.push(cartItem); // Nếu chưa có thì thêm sản phẩm vào giỏ hàng
    }
    showToast(); // Hiển thị thông báo toast
    saveCart(); // Lưu giỏ hàng vào localStorage

    renderCart();
  };

  // Hàm hiển thị thông báo toast khi thêm sản phẩm vào giỏ hàng
  function showToast() {
    const toastEl = document.getElementById("cart-toast");
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }

  // Hàm hiển thị thông báo toast khi thanh toán
  function showToast2() {
    const toastEl = document.getElementById("cart-toast2");
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }

  // Hàm hiển thị thông báo toast khi xóa sản phẩm khỏi giỏ hàng
  function showToast3() {
    const toastEl = document.getElementById("cart-toast3");
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }

  // Hàm mua ngay sản phẩm và mở modal giỏ hàng
  window.buyNow = function (productId) {
    addToCart(productId);
    $("#cartModal").modal("show"); // Mở modal giỏ hàng
  };

  // Hàm hiển thị giỏ hàng
  function renderCart() {
    const cartList = document.getElementById("cart-list");
    const totalPriceEl = document.getElementById("total-price");
    let totalPrice = 0;

    cartList.innerHTML = cart
      .map(
        (item) => `
            <div class="col-12 mb-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5>${item.name}</h5>
                        <p>Price: ${item.price.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}</p>
                        <p>Quantity: <button onclick="changeQuantity('${
                          item.id
                        }', -1)" class="btn btn-sm btn-outline-secondary">-</button> ${
          item.quantity
        } <button onclick="changeQuantity('${
          item.id
        }', 1)" class="btn btn-sm btn-outline-secondary">+</button></p>
                    </div>
                    <div>
                        <h5>${(item.price * item.quantity).toLocaleString(
                          "vi",
                          { style: "currency", currency: "VND" }
                        )}</h5>
                    </div>
                    <button onclick="removeFromCart('${
                      item.id
                    }')" class="btn btn-sm btn-outline-danger"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </div>
        `
      )
      .join("");

    cart.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });

    totalPriceEl.innerText = `Tổng tiền: ${totalPrice.toLocaleString("vi", {
      style: "currency",
      currency: "VND",
    })}`;
  }

  // Hàm thay đổi số lượng sản phẩm trong giỏ hàng
  window.changeQuantity = function (productId, amount) {
    const item = cart.find((i) => i.id === productId);
    if (item) {
      item.quantity += amount;
      if (item.quantity < 1) {
        item.quantity = 1; // Đảm bảo số lượng tối thiểu là 1
      }
      saveCart(); // Lưu giỏ hàng vào localStorage
      renderCart();
    }
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  window.removeFromCart = function (productId) {
    cart = cart.filter((item) => item.id !== productId);
    showToast3();
    saveCart(); // Lưu giỏ hàng vào localStorage
    renderCart(); // Cập nhật giao diện giỏ hàng
  };

  // Sự kiện khi nhấn nút giỏ hàng để mở modal giỏ hàng
  document.getElementById("cart-button").addEventListener("click", () => {
    renderCart();
    $("#cartModal").modal("show");
  });

  // Hàm lưu giỏ hàng vào localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Hàm tải giỏ hàng từ localStorage
  function loadCart() {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
    //Nếu storedCart có giá trị (không phải null), JSON.parse(storedCart) sẽ được thực hiện. JSON.parse chuyển đổi chuỗi JSON storedCart thành một đối tượng JavaScript (mảng).
    //Nếu storedCart không có giá trị (bằng null), [] sẽ được trả về, tức là một mảng rỗng.
  }

  // Hàm xóa giỏ hàng
  function clearCart() {
    cart = [];
    saveCart();
    renderCart();
  }

  // Sự kiện khi nhấn nút thanh toán để xóa giỏ hàng và hiển thị thông báo
  document.querySelector(".btnThanhToan").addEventListener("click", () => {
    clearCart(); // Clear giỏ hàng khi nhấn nút thanh toán
    showToast2();
  });

  fetchProducts(); // Gọi hàm lấy dữ liệu sản phẩm
  renderCart(); // Hiển thị giỏ hàng
});
