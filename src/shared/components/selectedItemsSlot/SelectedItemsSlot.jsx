import React, { useContext } from "react";
import { InventoryContext } from "../../../app/InventoryContext";
import style from "./SelectedItemsSlot.module.scss";
import { useInventoryDragDrop } from "../../hooks/useInventoryDragDrop";
const SelectedItemsSlot = ({ index, section, displayNumber }) => {
  const { inventoryData } = useContext(InventoryContext);
  const item =
    inventoryData && inventoryData[section] && inventoryData[section][index];

  const { dragRef, dropRef } = useInventoryDragDrop(index, section, item);

  return (
    <div className={`${style.inventorySlot}`} ref={dropRef}>
      {item && (
        <img
          ref={dragRef}
          src={item.data}
          alt={item.name}
          className={style.inventoryItem}
          draggable
          style={{
            width: `${
              item?.width !== 2 && item?.height !== 2
                ? "35px"
                : item?.height === 2
                ? "40px"
                : item?.width === 2
                ? "100%"
                : ""
            }`,
          }}
        />
      )}
      {displayNumber !== null && (
        <span className={style.keys}>{displayNumber}</span>
      )}
      <span className={style.inventoryQtyChange}>
        {item ? (item.quantity !== 1 ? `x${item.quantity}` : "") : ""}
      </span>
      <span className={style.inventoryWeight}>
        {item ? `${(item?.weight * item.quantity).toFixed(1)}` : ""}
      </span>
    </div>
  );
};

export default SelectedItemsSlot;
