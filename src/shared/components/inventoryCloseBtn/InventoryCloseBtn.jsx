import React from "react";

import style from "./InventoryCloseBtn.module.scss";

const InventoryCloseBtn = ({ inventoryError }) => {
  return (
    <button className={style.inventoryclose}>
      <span className={style.closeBadge}>ESC</span>ВЫЙТИ
      <span className={style.errorText}>{inventoryError}</span>
    </button>
  );
};

export default InventoryCloseBtn;
