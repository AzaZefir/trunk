import React, { useState } from "react";
import style from "./InventoryMain.module.scss";

import CharacterThings from "./characterThings/CharacterThings";
import HealthWaterIndicators from "./healthWaterIndicators/HealthWaterIndicators";
import { Bag } from "./bag/Bag";
import { SelectedItems } from "./selectedItems/SelectedItems";
import PocketHeader from "./pocketDocs/PocketHeader";
import { Pocket } from "./pocketDocs/pocket/Pocket";
import Docs from "./pocketDocs/docs/Docs";
import { InventoryProvider } from "../app/InventoryContext";

const InventoryMain = () => {
  const [isPocketOpen, setIsPocketOpen] = useState(true);
  const [isDocOpen, setIsDocOpen] = useState(false);

  const handlePocketOpen = () => {
    setIsPocketOpen(true);
    setIsDocOpen(false);
  };

  const handleDocOpen = () => {
    setIsDocOpen(true);
    setIsPocketOpen(false);
  };

  return (
    <InventoryProvider>
      <div className={style.container}>
        <section className={style.inventoryContent}>
          <div className={style.inventory}>
            {/* pocket and docs */}
            <div className={style.pocket}>
              <PocketHeader
                isPocketOpen={isPocketOpen}
                isDocOpen={isDocOpen}
                handlePocketOpen={handlePocketOpen}
                handleDocOpen={handleDocOpen}
              />
              {isPocketOpen && <Pocket />}

              {isDocOpen && <Docs />}
            </div>
            {/*selected items slots */}
            <SelectedItems />
          </div>
          <div className={style.inventory}>
            {/* bag */}
            <Bag />
            {/* health, water indicators */}
            <HealthWaterIndicators />
          </div>
        </section>
        {/* character things */}
        <CharacterThings />
      </div>
    </InventoryProvider>
  );
};

export default InventoryMain;
