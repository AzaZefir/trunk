import React, { useContext } from "react";
import { InventoryContext } from "../../../app/InventoryContext";
import style from "./HidenPlace.module.scss";
import { useInventoryDragDrop } from './../../hooks/useInventoryDragDrop';
const HidenPlace = ({ index, section }) => {
  const { inventoryData } = useContext(InventoryContext);
  const item = inventoryData?.[section]?.[index] || null;
  const { dragRef, dropRef } = useInventoryDragDrop(index, section, item);

  return (
    <div className={`${style.inventorySlot}`} ref={dropRef} style={{}}>
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
      <span className={style.inventoryQtyChange} style={{ color: "#fff" }}>
        {item ? (item.quantity !== 1 ? `x${item.quantity}` : "") : ""}
      </span>
      <span className={style.inventoryWeight} style={{ color: "#fff" }}>
        {item ? `${(item?.weight * item.quantity).toFixed(1)}` : ""}
      </span>
    </div>
  );
};

export default HidenPlace;
