import React, { useContext } from "react";
import { InventoryContext } from "../../../app/InventoryContext";
import style from "./InventorySlot.module.scss";
import { useInventoryDragDrop } from './../../hooks/useInventoryDragDrop';
const InventorySlot = ({ index, section }) => {
  const { inventoryData } = useContext(InventoryContext);
  const item =
    inventoryData && inventoryData[section] && inventoryData[section][index];

  const { dragRef, dropRef, slotStyle } = useInventoryDragDrop(
    index,
    section,
    item
  );
  
  return (
    <div ref={dropRef} className={`${style.inventorySlot}`} style={slotStyle}>
      {item && (
        <img
          ref={dragRef}
          src={item.data}
          alt={item.name}
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
            display: `${
              (item?.width === 2 && !item?.isFirstCopy) ||
              (item?.height === 2 && !item?.isFirstCopy)
                ? "none"
                : ""
            }`,
          }}
        />
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

export default InventorySlot;
