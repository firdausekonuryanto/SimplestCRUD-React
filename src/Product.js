import React, { useEffect, useState } from "react";
import axios from "axios";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    price: "",
    description: "",
    image: "",
  });

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      const data = response.data;
      setProducts(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleCreate = async () => {
    try {
      const formDataWithImage = new FormData();
      formDataWithImage.append("name", formData.name);
      formDataWithImage.append("price", formData.price);
      formDataWithImage.append("description", formData.description);
      formDataWithImage.append("image", selectedImage);

      await axios.post("http://localhost:5000/products", formDataWithImage);

      setFormData({
        id: null,
        name: "",
        price: "",
        description: "",
        image: "",
      });

      fetchData();
    } catch (error) {
      console.error("Error creating/editing product", error);
    }
  };

  const handleEdit = (product) => {
    setIsEditMode(true);
    setEditItemId(product._id);
    setFormData(product);
  };

  const handleUpdate = async () => {
    try {
      const formDataWithImage = new FormData();
      formDataWithImage.append("name", formData.name);
      formDataWithImage.append("price", formData.price);
      formDataWithImage.append("description", formData.description);
      formDataWithImage.append("image", selectedImage);

      await axios.put(
        `http://localhost:5000/products/${editItemId}`,
        formDataWithImage
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === editItemId ? formData : product
        )
      );

      setIsEditMode(false);
      setEditItemId(null);
      setFormData({
        _id: null,
        name: "",
        price: "",
        description: "",
        image: "",
      });
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  // console.log(products);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Product List</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                {isEditMode && editItemId === product._id ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.name
                )}
              </td>
              <td>
                {isEditMode && editItemId === product._id ? (
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.price
                )}
              </td>
              <td>
                {isEditMode && editItemId === product._id ? (
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.description
                )}
              </td>
              <td>
                {isEditMode && editItemId === product._id ? (
                  <input
                    type="file"
                    name="image"
                    onChange={(e) => handleImageChange(e)}
                  />
                ) : (
                  <img
                    src={`http://localhost:5000/uploads/${product.image}`}
                    alt={product.name}
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                )}
              </td>
              <td>
                {isEditMode && editItemId === product._id ? (
                  <>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setIsEditMode(false)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!isEditMode && (
        <div>
          <h2>Add New Product</h2>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="description"
            placeholder="description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <input type="file" name="image" onChange={handleImageChange} />

          <button onClick={handleCreate}>Create</button>
        </div>
      )}
    </div>
  );
};

export default Product;
