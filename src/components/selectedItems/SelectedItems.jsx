import React from "react";
import SelectedItemsSlot from "../../shared/components/selectedItemsSlot/SelectedItemsSlot";
import style from "./SelectedItems.module.scss";
export const SelectedItems = () => {
  return (
    <div className={style.inventoryFourColSlots}>
      {Array.from({ length: 12 }).map((_, index) => (
        <SelectedItemsSlot index={index} key={index} section="selectedItems" />
      ))}
    </div>
  );
};
