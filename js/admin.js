const convertCurrency = (money) => {
  return money.toLocaleString("it-IT", { style: "currency", currency: "VND" });
};

const notice = (string) => {
  return Toastify({
    text: string,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
  }).showToast();
};

function resetForm() {
  let inputs = document.querySelectorAll("input,select,textarea");
  inputs.forEach((input) => {
    input.value = "";
  });
}

const uploadImage = async (url) => {
  try {
    const key = "42a6c2cc809de30f28d38bd1eec78446";
    const image = await axios({
      method: "post",
      url: `https://api.imgbb.com/1/upload?key=${key}&image=${url}`,
    });
  } catch (error) {}
};

const getIds = async () => {
  const data = await axios({
    method: "get",
    url: "https://667fb4bdf2cb59c38dc98c1f.mockapi.io/bc69",
  });
  const res = data.data;
  let ids = [];
  res.forEach((item) => {
    let { id } = item;
    ids.push(id);
  });
  return ids;
};

const getValueForm = async () => {
  const inputs = document.querySelectorAll("input,select,textarea");
  let data = {};
  inputs.forEach((input) => {
    let { id, value } = input;
    data[id] = value;
  });

  return data;
};

const addProduct = async () => {
  let data = await getValueForm();
  const ids = await getIds();
  data["id"] = ++ids.slice(-1)[0];
  try {
    const pushData = await axios({
      method: "POST",
      url: "https://667fb4bdf2cb59c38dc98c1f.mockapi.io/bc69",
      data: data,
    });
    notice("Thêm sản phẩm thành công");
    renderProducts();
    resetForm();
    document.getElementById("content").scrollIntoView({
      behavior: "smooth",
    });
  } catch (error) {
    console.log("error: ", error.message);
  }
};

const renderProducts = async () => {
  try {
    const data = await axios({
      method: "get",
      url: "https://667fb4bdf2cb59c38dc98c1f.mockapi.io/bc69",
    });
    const res = data.data;
    let content = "";
    res.forEach((item) => {
      let { id, name, price, type, desc } = item;
      content += `
            <tr>
                <th scope="row">${name}</th>
                <td>${convertCurrency(price)}</td>
                <td>${type}</td>
                <td>${desc}</td>
                <td><button class="btn btn-danger" onclick="removeProduct(${id})">Xoá</button> <button class="btn btn-warning" onclick="editProduct(${id})">Sửa</button></td>
            </tr>
            `;
    });
    document.getElementById("content").innerHTML = content;
  } catch (error) {
    console.log("error: ", error.message);
  }
};

renderProducts();

const editProduct = async (id) => {
  try {
    const data = await axios({
      method: "GET",
      url: `https://667fb4bdf2cb59c38dc98c1f.mockapi.io/bc69/${id}`,
    });
    const res = data.data;
    let inputs = document.querySelectorAll("input,select,textarea");
    inputs.forEach((input) => {
      let { id } = input;
      document.getElementById(id).value = res[id];
    });
    document.getElementById("idAddProduct").setAttribute("disabled", "disabled");
    document.getElementById("idUpdateProduct").removeAttribute("disabled");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.log("error: ", error.message);
  }
};

const removeProduct = async (id) => {
  try {
    const data = await axios({
      method: "DELETE",
      url: `https://667fb4bdf2cb59c38dc98c1f.mockapi.io/bc69/${id}`,
    });
    notice("Xoá thành công");
    renderProducts();
  } catch (error) {
    console.log("error: ", error.message);
  }
};

const getDataById = async (id) => {
  try {
    const data = await axios({
      method: "get",
      url: `https://667fb4bdf2cb59c38dc98c1f.mockapi.io/bc69/${id}`,
    });
    return data.data;
  } catch (error) {
    console.log("error: ", error.message);
  }
};

const updateProduct = async () => {
  try {
    const data = await getValueForm();
    const { id } = data;
    delete data.id;
    const pushData = await axios({
      method: "PUT",
      url: `https://667fb4bdf2cb59c38dc98c1f.mockapi.io/bc69/${id}`,
      data: data,
    });
    notice("Cập nhật thành công");
    resetForm();
    renderProducts();
    document.getElementById("content").scrollIntoView({
      behavior: "smooth",
    });
  } catch (error) {
    console.log("error: ", error.message);
  }
};
