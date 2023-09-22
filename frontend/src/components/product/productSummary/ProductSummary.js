import React, { useEffect } from "react";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCart4, BsCartX } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";

import "./ProductSummary.scss";
import InfoBox from "../../infoBox/InfoBox";
import {
  CALC_STORE_VALUE,
  CALC_OUT_OF_STOCK,
  CALC_CATEGORY,
  selectTotalStockValue,
  selectTOutOfStock,
  selectCategory,
} from "../../../redux/features/product/productSlice";

// Icons
const earningIcon = <AiFillDollarCircle size={40} color="#fff" />;
const productIcon = <BsCart4 size={40} color="#fff" />;
const categoryIcon = <BiCategory size={40} color="#fff" />;
const outOfStockIcon = <BsCartX size={40} color="#fff" />;

// Format amount
export const formatNumbers = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ProductSummary = ({ products }) => {
  const dispatch = useDispatch();
  const totalStockValue = useSelector(selectTotalStockValue);
  const outOfStock = useSelector(selectTOutOfStock);
  const category = useSelector(selectCategory);

  useEffect(() => {
    dispatch(CALC_STORE_VALUE(products));
    dispatch(CALC_OUT_OF_STOCK(products));
    dispatch(CALC_CATEGORY(products));
  }, [dispatch, products]);

  return (
    <div className="product-summary">
      <h3 className="--mt">Inventory Stats</h3>
      <div className="info-summary">
        <InfoBox
          icon={productIcon}
          title={"Total Products"}
          count={products.length}
          bgColour={"card1"}
        />
        <InfoBox
          icon={earningIcon}
          title={"Total Store Value"}
          count={`R${formatNumbers(totalStockValue.toFixed(2))}`}
          bgColour={"card2"}
        />
        <InfoBox
          icon={outOfStockIcon}
          title={"Out Of Stock"}
          count={outOfStock}
          bgColour={"card3"}
        />
        <InfoBox
          icon={categoryIcon}
          title={"All Categories"}
          count={category.length}
          bgColour={"card4"}
        />
      </div>
    </div>
  );
};

export default ProductSummary;
