import React from "react";
import style from "./Pocket.module.scss";

import InventorySlot from "../../../shared/components/inventorySlot/InventorySlot";
import HidenPlace from "./../../../shared/components/hidenPlace/HidenPlace";

export const Pocket = () => {
  return (
    <div className={style.inventoryFiveColSlots}>
      {Array.from({ length: 10 }).map((_, index) => {
        const isHidingPlace = index === 4;
        return isHidingPlace ? (
          <HidenPlace index={index} key={index} section="pocketHidingData" />
        ) : (
          <InventorySlot index={index} key={index} section="pocket" />
        );
      })}
    </div>
  );
};
