import React, { useContext } from "react";

import style from "./Bag.module.scss";

import InventorySlot from "../../shared/components/inventorySlot/InventorySlot";
import HidenPlace from "../../shared/components/hidenPlace/HidenPlace";
import { InventoryContext } from "../../app/InventoryContext";

// Портфель - блок, который хранит предметы в виде ячеек.
export const Bag = () => {
  const { inventoryData } = useContext(InventoryContext);
  const bagWeight = inventoryData.weight.bag;
  const bagLimit = inventoryData.limit.bag;

  return (
    <div className={style.pocket}>
      <div className={style.pocketHeader}>
        <h2>Портфель</h2>
        <p
          style={{
            color: `${inventoryData.weightError.bag ? "salmon" : ""}`,
          }}
        >
          {bagWeight.toFixed(1)}/{bagLimit} кг
        </p>
      </div>
      <div className={style.inventoryFiveColSlots}>
        {Array.from({ length: 20 }).map((_, index) => {
          const isHidingPlace = index === 4 || index === 9;

          return isHidingPlace ? (
            <HidenPlace index={index} section="bagHidingData" key={index} />
          ) : (
            <InventorySlot index={index} section="bag" key={index} />
          );
        })}
      </div>
    </div>
  );
};
