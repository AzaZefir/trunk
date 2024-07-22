import React from "react";

import jacket from "../../assets/jacket.svg";
import shirt from "../../assets/shirt.svg";
import bodyArmor from "../../assets/body-armor.svg";
import gloves from "../../assets/gloves.svg";
import watches from "../../assets/watches.svg";
import hat from "../../assets/hat.svg";
import glasses from "../../assets/glasses.svg";
import bijouterie from "../../assets/bijouterie.svg";
import bag from "../../assets/bag.svg";
import trousers from "../../assets/trousers.svg";
import shoes from "../../assets/shoes.svg";

import style from "./CharacterThings.module.scss";
import InventoryCloseBtn from "../../shared/components/inventoryCloseBtn/InventoryCloseBtn";

const CharacterThings = () => {
  return (
    <section className={style.characterThings}>
      <div className={style.thingsOnLeftSide}>
        <div className={style.thingsSlots}>
          <div className={style.thingsSlot}>
            <img src={jacket} alt="куртка" />
          </div>
          <div className={style.thingsSlot}>
            <img src={shirt} alt="рубашка" />
          </div>
          <div className={style.thingsSlot}>
            <img src={bodyArmor} alt="бронежилет" />
          </div>
        </div>
        <div className={style.thingsSlots}>
          <div className={style.thingsSlot}>
            <img src={gloves} alt="перчатки" />
          </div>
          <div className={style.thingsSlot}>
            <img src={watches} alt="часы" />
          </div>
        </div>
      </div>
      <div className={style.thingsOnRightSide}>
        
        <div className={style.thingsSlots}>
        <InventoryCloseBtn/>
          <div className={style.thingsSlot}>
            <img src={hat} alt="шляпа" />
          </div>
          <div className={style.thingsSlot}>
            <img src={glasses} alt="очки" />
          </div>
          <div className={style.thingsSlot}>
            <img src={bijouterie} alt="бижутерия" />
          </div>
        </div>
        <div className={style.thingsSlots}>
          <div className={style.thingsSlot}>
            <img src={bag} alt="сумка" />
          </div>
        </div>

        <div className={style.thingsSlots}>
          <div className={style.thingsSlot}>
            <img src={trousers} alt="штаны" />
          </div>
          <div className={style.thingsSlot}>
            <img src={shoes} alt="обувь" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CharacterThings;
