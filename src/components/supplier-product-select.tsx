"use client";

import React from 'react';
import { useField } from "@payloadcms/ui";

interface Product {
  name: string;
  id: string;
}

interface SupplierProductSelectProps {
  supplierProductAssociated: Product[];
  supplierProducts: Product[];
}

const SupplierProductSelect: React.FC<SupplierProductSelectProps> = ({
  supplierProductAssociated,
  supplierProducts
}) => {
 	const { setValue: setSupplierProductId } = useField({ path: "supplier_product_id" });

  return (
    <>
      <label
        htmlFor="supplier-product-select"
        style={{
          display: "block",
          fontSize: "14px",
          fontWeight: "500",
          color: "#374151",
          marginBottom: "6px",
        }}
      >
        Produits de fournisseurs
      </label>
      <select
        id="supplier-product-select"
        defaultValue={
          supplierProductAssociated.length > 0
            ? supplierProducts.find((product) =>
                supplierProductAssociated.some(
                  (associated) => associated.name === product.name,
                ),
              )?.id || ""
            : ""
        }
        onChange={(e) => {
          setSupplierProductId(e.target.value);
        }}
        style={{
          width: "100%",
          padding: "12px 16px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          fontSize: "14px",
          backgroundColor: "white",
          color: "#374151",
          outline: "none",
          cursor: "pointer",
          boxSizing: "border-box",
        }}
      >
        <option value="">Sélectionnez un produit</option>
        {supplierProducts.map((product, index) => (
          <option key={index} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>

      {/* Hidden input to store custom data that will be submitted with the form */}
      <input
        type="hidden"
        id="selected-supplier-product-data"
        name="customSupplierProductData"
        defaultValue=""
      />
    </>
  );
};

export default SupplierProductSelect;
