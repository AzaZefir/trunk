import React, { useContext } from "react";
import style from "./PocketHeader.module.scss";
import { InventoryContext } from "../../app/InventoryContext";
const PocketHeader = ({
  handlePocketOpen,
  handleDocOpen,
  isPocketOpen,
  isDocOpen,
}) => {
  const { inventoryData } = useContext(InventoryContext);
  const pocketWeight = inventoryData.weight?.pocket;
  const pocketLimit = inventoryData.limit?.pocket;

  const docsWeight = inventoryData.weight?.docs;
  const docsLimit = inventoryData.limit?.docs;
  return (
    <div className={style.pocketHeader}>
      <div className={style.btns}>
        <button
          onClick={handlePocketOpen}
          className={`${style.pocketBtn} ${isPocketOpen ? style.active : ""}`}
        >
          Карман
        </button>
        <button
          className={`${style.docBtn} ${isDocOpen ? style.active : ""}`}
          onClick={handleDocOpen}
        >
          Документы
        </button>
      </div>

      {isPocketOpen ? (
        <p
          style={{
            color: `${inventoryData.weightError.pocket ? "salmon" : ""}`,
          }}
        >
          {pocketWeight.toFixed(1)}/{pocketLimit} кг
        </p>
      ) : (
        <p
          style={{
            color: `${inventoryData.weightError.docs ? "salmon" : ""}`,
          }}
        >
          {docsWeight.toFixed(1)}/{docsLimit} кг
        </p>
      )}
    </div>
  );
};

export default PocketHeader;
