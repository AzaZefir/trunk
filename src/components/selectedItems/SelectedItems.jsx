import React from "react";
import SelectedItemsSlot from "../../shared/components/selectedItemsSlot/SelectedItemsSlot";
import style from "./SelectedItems.module.scss";

export const SelectedItems = () => {
  // Определите пропущенные слоты
  const slotsToSkip = [1, 5];
  const slots = Array.from({ length: 12 });

  let displayNumber = 1;

  return (
    <div className={style.inventoryFourColSlots}>
      {slots.map((_, index) => {
        const shouldSkip = slotsToSkip.includes(index);

        const currentNumber = shouldSkip ? null : displayNumber++;

        return (
          <SelectedItemsSlot
            index={index}
            key={index}
            section="selectedItems"
            displayNumber={currentNumber}
          />
        );
      })}
    </div>
  );
};
