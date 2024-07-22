import React from "react";
import InventorySlot from "../../../shared/components/inventorySlot/InventorySlot";
import style from './Docs.module.scss'
const Docs = () => {
  return (
    <div className={style.inventoryFiveColSlots}>
      {Array.from({ length: 10 }).map((_, index) => (
        <InventorySlot index={index} key={index} section="docs" />
      ))}
    </div>
  );
};

export default Docs;
