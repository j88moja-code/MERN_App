import React from "react";
import "./ProductList.scss";
import { SpinnerImage } from "../../loader/Loader";

const ProductList = ({ products, isLoading }) => {
  const shortText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }
    return text;
  };
  return (
    <div className="product-list">
      <hr />
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>Inventory Items</h3>
          </span>
          <span>
            <h3>Search products...</h3>
          </span>
        </div>
        {isLoading && <SpinnerImage />}
        <div className="table">
          {!isLoading && products.length === 0 ? (
            <p>-- No products found, please add a product...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product, index) => {
                  const { _id, name, category, price, quantity } = product;
                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{shortText(name, 18)}</td>
                      <td>{category}</td>
                      <td>
                        {"R"}
                        {price}
                      </td>
                      <td>{quantity}</td>
                      <td>
                        {"R"}
                        {price * quantity}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
