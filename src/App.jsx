import { useEffect, useState } from "react";
import style from "./App.module.scss";
import { calculateTotalSlots } from "./utils/calculateTotalSlots";
import logo from "./assets/logo.svg";
import health from "./assets/health.svg";
import water from "./assets/water.svg";
import jacket from "./assets/jacket.svg";
import shirt from "./assets/shirt.svg";
import bodyArmor from "./assets/body-armor.svg";
import gloves from "./assets/gloves.svg";
import watches from "./assets/watches.svg";
import hat from "./assets/hat.svg";
import glasses from "./assets/glasses.svg";
import bijouterie from "./assets/bijouterie.svg";
import bag from "./assets/bag.svg";
import trousers from "./assets/trousers.svg";
import shoes from "./assets/shoes.svg";
import { bagData, docsData, pocketData } from "./data";

function App() {
  const [healthPercentage, setHealthPercentage] = useState(40);
  const [waterPercentage, setWaterPercentage] = useState(38);
  const [isPocketOpen, setIsPocketOpen] = useState(true);
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [pocketItems, setPocketItems] = useState([]);
  const [docsItems, setDocItems] = useState([]);
  const [bagItems, setBagItems] = useState([]);
  const [additionalItems, setAdditionalItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);

  const totalSlots = calculateTotalSlots({ data: bagData, initialTotal: 20 });

  const handlePocketOpen = () => {
    setIsPocketOpen(true);
    setIsDocOpen(false);
  };

  const handleDocOpen = () => {
    setIsDocOpen(true);
    setIsPocketOpen(false);
  };

  useEffect(() => {
    setPocketItems(pocketData);
    setDocItems(docsData);
    setBagItems(bagData);
  }, []);

  const handleDragStart = (e, item, from, index) => {
    setDraggedItem(item);
    setDraggedFrom({ from, index });
  };

  // функция отвечающая за логику перемещения предметов
  // TODO: priority - important: сделать так чтобы при перемещении двуслотных предметов не ломалась grid сетка
  // TODO: при перемещении двуслотных предметов во время наведения на другие слоты как с предметами так и без подсвечивать не один слот а два
  // TODO: не давать сдвигать предметы при вставке двуслотных предметов
  const handleDrop = (e, to, index) => {
    e.preventDefault();
    if (draggedItem && draggedFrom) {
      let fromItems, setFromItems;
      if (draggedFrom.from === "pocket") {
        fromItems = pocketItems;
        setFromItems = setPocketItems;
      } else if (draggedFrom.from === "docs") {
        fromItems = docsItems;
        setFromItems = setDocItems;
      } else if (draggedFrom.from === "bag") {
        fromItems = bagItems;
        setFromItems = setBagItems;
      } else if (draggedFrom.from === "additional") {
        fromItems = additionalItems;
        setFromItems = setAdditionalItems;
      }

      let toItems, setToItems;
      if (to === "pocket") {
        toItems = pocketItems;
        setToItems = setPocketItems;
      } else if (to === "docs") {
        toItems = docsItems;
        setToItems = setDocItems;
      } else if (to === "bag") {
        toItems = bagItems;
        setToItems = setBagItems;
      } else if (to === "additional") {
        toItems = additionalItems;
        setToItems = setAdditionalItems;
      }

      // TODO: пофиксить: при использовании spread оператора [...fromItems], [...toItems] дублирование предметов
      // Переместить предметы
      const newFromItems = fromItems;
      const newToItems = toItems;

      // Запомнить предмет в слоте назначения
      const targetItem = newToItems[index];

      // Переместить предмет в слот назначения
      newToItems[index] = draggedItem;

      // Если в слоте назначения был предмет, переместить его на место исходного предмета
      if (targetItem) {
        newFromItems[draggedFrom.index] = targetItem;
      } else {
        newFromItems[draggedFrom.index] = null;
      }

      setFromItems(newFromItems);
      setToItems(newToItems);

      setDraggedItem(null);
      setDraggedFrom(null);
    }
  };

  return (
    <section className={style.inventoryWrapper}>
      <header className={style.inventoryHeader}>
        <h3>
          32<span className={style.weight}>кг</span>$<span>9000</span>
        </h3>
        <img src={logo} alt="GTA-5-RP" className={style.logo} />
      </header>
      <div className={style.container}>
        <section className={style.inventoryContent}>
          <div className={style.inventory}>
            {/* pocket and docs */}
            <div className={style.pocket}>
              <div className={style.pocketHeader}>
                <div className={style.btns}>
                  <button
                    onClick={handlePocketOpen}
                    className={`${style.pocketBtn} ${
                      isPocketOpen ? style.active : ""
                    }`}
                  >
                    Карман
                  </button>
                  <button
                    className={`${style.docBtn} ${
                      isDocOpen ? style.active : ""
                    }`}
                    onClick={handleDocOpen}
                  >
                    Документы
                  </button>
                </div>
                <p>1/8 кг</p>
              </div>
              {isPocketOpen && (
                <div className={style.inventoryFiveColSlots}>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div
                      className={`${style.inventorySlot} ${
                        pocketItems[index]?.width === 2 ? style.doubleSlot : ""
                      } ${
                        pocketItems[index]?.height === 2
                          ? style.doubleHeightSlot
                          : ""
                      }`}
                      key={index}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, "pocket", index)}
                    >
                      {pocketItems[index] && (
                        <img
                          src={pocketItems[index].data}
                          alt={pocketItems[index].name}
                          onDragStart={(e) =>
                            handleDragStart(
                              e,
                              pocketItems[index],
                              "pocket",
                              index
                            )
                          }
                          style={{
                            width: `${
                              pocketItems[index]?.width !== 2 &&
                              pocketItems[index]?.height !== 2
                                ? "35px"
                                : pocketItems[index]?.height === 2
                                ? "40px"
                                : pocketItems[index]?.width === 2
                                ? "100%"
                                : ""
                            }`,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
              {isDocOpen && (
                <div className={style.inventoryFiveColSlots}>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div
                      className={`${style.inventorySlot} ${
                        docsItems[index]?.width === 2 ? style.doubleSlot : ""
                      } ${
                        docsItems[index]?.height === 2
                          ? style.doubleHeightSlot
                          : ""
                      }`}
                      key={index}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, "docs", index)}
                    >
                      {docsItems[index] && (
                        <img
                          src={docsItems[index].data}
                          alt={docsItems[index].name}
                          onDragStart={(e) =>
                            handleDragStart(e, docsItems[index], "docs", index)
                          }
                          style={{
                            width: `${
                              docsItems[index]?.width !== 2 &&
                              docsItems[index]?.height !== 2
                                ? "35px"
                                : docsItems[index]?.height === 2
                                ? "40px"
                                : docsItems[index]?.width === 2
                                ? "100%"
                                : ""
                            }`,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* slots */}
            <div className={style.inventoryFourColSlots}>
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  className={`${style.inventorySlot} ${
                    additionalItems[index]?.width === 2 ? style.doubleSlot : ""
                  } ${
                    additionalItems[index]?.height === 2
                      ? style.doubleHeightSlot
                      : ""
                  }`}
                  key={index}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, "additional", index)}
                >
                  {additionalItems[index] && (
                    <img
                      src={additionalItems[index].data}
                      alt={additionalItems[index].name}
                      className={style.inventoryItem}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(
                          e,
                          additionalItems[index],
                          "additional",
                          index
                        )
                      }
                      style={{
                        width: `${
                          additionalItems[index]?.width !== 2 &&
                          additionalItems[index]?.height !== 2
                            ? "35px"
                            : additionalItems[index]?.height === 2
                            ? "40px"
                            : additionalItems[index]?.width === 2
                            ? "100%"
                            : ""
                        }`,
                      }}
                    />
                  )}
                  <span>0</span>
                </div>
              ))}
            </div>
          </div>
          <div className={style.inventory}>
            {/* bag */}
            <div className={style.pocket}>
              <div className={style.pocketHeader}>
                <h2>Портфель</h2>
                <p>1/25 кг</p>
              </div>
              <div className={style.inventoryFiveColSlots}>
                {Array.from({ length: totalSlots }).map((_, index) => (
                  <div
                    className={`${style.inventorySlot} ${
                      bagItems[index]?.width === 2 ? style.doubleSlot : ""
                    } ${
                      bagItems[index]?.height === 2
                        ? style.doubleHeightSlot
                        : ""
                    }`}
                    key={index}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, "bag", index)}
                  >
                    {bagItems[index] && (
                      <img
                        src={bagItems[index].data}
                        alt={bagItems[index].name}
                        className={style.inventoryItem}
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, bagItems[index], "bag", index)
                        }
                        style={{
                          width: `${
                            bagItems[index]?.width !== 2 &&
                            bagItems[index]?.height !== 2
                              ? "35px"
                              : bagItems[index]?.height === 2
                              ? "40px"
                              : bagItems[index]?.width === 2
                              ? "100%"
                              : ""
                          }`,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* health, water indicators */}
            <div className={style.indicators}>
              <div className={style.healthIndicator}>
                <div className={style.healthIcon}>
                  <img src={health} alt="health" />
                </div>
                <div className={style.healthIndicatorRange}>
                  <div className={style.healthIndicatorBg}>
                    <div
                      className={style.healthIndicatorFill}
                      style={{ width: `${healthPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className={style.waterIndicator}>
                <div className={style.waterIcon}>
                  <img src={water} alt="water" />
                </div>
                <div className={style.waterIndicatorRange}>
                  <div className={style.waterIndicatorBg}>
                    <div
                      className={style.waterIndicatorFill}
                      style={{ width: `${waterPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={style.characterThings}>
          {/* character things */}
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
      </div>
    </section>
  );
}

export default App;
