import { useEffect, useState } from "react";
import style from "./App.module.scss";
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

  const [highlightedBagSlot, setHighlightedBagSlot] = useState(null);
  const [highlightedPocketSlot, setHighlightedPocketSlot] = useState(null);
  const [highlightedDocSlot, setHighlightedDocSlot] = useState(null);
  const [highlightedAdditionalSlot, setHighlightedAdditionalSlot] =
    useState(null);

  // Тайники
  const [bagHidingPlaces, setBagHidingPlaces] = useState([]);
  const [pocketHidingPlaces, setPocketHidingPlaces] = useState([]);

  const handlePocketOpen = () => {
    setIsPocketOpen(true);
    setIsDocOpen(false);
  };

  const handleDocOpen = () => {
    setIsDocOpen(true);
    setIsPocketOpen(false);
  };

  useEffect(() => {
    const initializeItems = (data, skipIndices = []) => {
      const items = new Array(20).fill(null);
      let currentIndex = 0;

      data.forEach((item) => {
        if (item.width === 2) {
          while (
            skipIndices.includes(currentIndex) ||
            skipIndices.includes(currentIndex + 1)
          ) {
            currentIndex += 2;
          }
          if (currentIndex < items.length) {
            items[currentIndex] = { ...item, isFirstCopy: true };
            if (currentIndex + 1 < items.length) {
              items[currentIndex + 1] = {
                ...item,
                isCopy: true,
                isFirstCopy: false,
              };
            }
            currentIndex += 2;
          }
        } else if (item.height === 2) {
          while (
            skipIndices.includes(currentIndex) ||
            skipIndices.includes(currentIndex + 5)
          ) {
            currentIndex += 1;
          }
          if (currentIndex < items.length) {
            items[currentIndex] = { ...item, isFirstCopy: true };
            if (currentIndex + 5 < items.length) {
              items[currentIndex + 5] = {
                ...item,
                isCopy: true,
                isFirstCopy: false,
              };
            }
            currentIndex += 1;
          }
        } else {
          while (skipIndices.includes(currentIndex)) {
            currentIndex += 1;
          }
          if (currentIndex < items.length) {
            items[currentIndex] = item;
            currentIndex += 1;
          }
        }
      });

      return items;
    };

    // Initialize items with specific indices to skip (4 and 9)
    setPocketItems(initializeItems(pocketData, [4]));
    setDocItems(initializeItems(docsData));
    setBagItems(initializeItems(bagData, [4, 9]));
  }, []);

  const handleDragOver = (e, index, section) => {
    e.preventDefault();
    if (section === "pocket") {
      setHighlightedPocketSlot(index);
    } else if (section === "docs") {
      setHighlightedDocSlot(index);
    } else if (section === "bag") {
      setHighlightedBagSlot(index);
    } else if (section === "additional") {
      setHighlightedAdditionalSlot(index);
    }
  };

  const handleDragStart = (e, item, from, index) => {
    if (item.isCopy) return;
    setDraggedItem(item);
    setDraggedFrom({ from, index });
  };

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
      } else if (draggedFrom.from === "bagHidingPlace") {
        fromItems = bagHidingPlaces;
        setFromItems = setBagHidingPlaces;
      } else if (draggedFrom.from === "pocketHidingPlace") {
        fromItems = pocketHidingPlaces;
        setFromItems = setPocketHidingPlaces;
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
      } else if (to === "bagHidingPlace") {
        toItems = bagHidingPlaces;
        setToItems = setBagHidingPlaces;
      } else if (to === "pocketHidingPlace") {
        toItems = pocketHidingPlaces;
        setToItems = setPocketHidingPlaces;
      }

      const newFromItems = fromItems;
      const newToItems = toItems;

      // Функция для проверки, занят ли индекс двухслотовым элементом
      const isTwoSlotItem = (idx) => {
        return (
          newToItems[idx] &&
          (newToItems[idx].width === 2 || newToItems[idx].height === 2)
        );
      };

      // Функция проверки того, является ли перетаскиваемый элемент элементом с двумя слотами
      const isDraggedItemTwoSlot = () => {
        return draggedItem.width === 2 || draggedItem.height === 2;
      };

      // Проверка, являются ли draggedItem и targetItem элементами с двумя слотами.
      if (isDraggedItemTwoSlot() && isTwoSlotItem(index)) {
        console.log("Cannot swap two-slot items");
        clearHighlight();
        return; // Выходим раньше, чтобы предотвратить дальнейшее выполнение
      }

      if (
        (to === "bagHidingPlace" || to === "pocketHidingPlace") &&
        draggedItem.weight > 0.5
      ) {
        console.log(
          "Cannot place item in hiding place as it exceeds weight limit"
        );
        clearHighlight();
        return;
      }

      // Проверка, имеет ли перетаскиваемыйItem ширину или высоту 2.
      if (draggedItem.width === 2 || draggedItem.height === 2) {
        // Предотвратить падение рядом с другим предметом с двумя слотами.
        const rowIndex = Math.floor(index / 5);

        // Check if the dragged item is trying to be placed at the right edge
        const isAtRightEdge =
          (rowIndex < 2 && index % 5 === 3) || // First two rows, right edge is index 4
          (rowIndex >= 2 && index % 5 === 4); // Last two rows, right edge is index 5
        const isAtRightPocketEdge =
          (rowIndex < 1 && index % 5 === 3) || // First two rows, right edge is index 4
          (rowIndex >= 1 && index % 5 === 4);
        if (
          (index < newToItems.length - 1 &&
            isTwoSlotItem(index + 1) &&
            draggedItem.height !== 2) || // Правый слот
          (index < newToItems.length - 5 &&
            isTwoSlotItem(index + 5) &&
            draggedItem.width !== 2) || // Нижний слот
          (draggedItem.width === 2 && isAtRightEdge && to === "bag") || // Запретить размещение элемента шириной 2 на правом краю
          (draggedItem.width === 2 && isAtRightPocketEdge && to === "pocket") || // Запретить размещение элемента шириной 2 на правом краю
          (draggedItem.width === 2 && index % 5 === 4) || // Запретить размещение элемента шириной 2 на правом краю
          (draggedItem.height === 2 && index >= 15 && to !== "pocket") || // Запретить размещение элемента высотой 2 на нижнем крае
          (draggedItem.height === 2 && index >= 15 && to !== "docs") || // Запретить размещение элемента высотой 2 на нижнем крае
          (draggedItem.height === 2 && index >= 5 && to === "pocket") || // Запретить размещение элемента высотой 2 на нижнем крае
          (draggedItem.height === 2 && index >= 5 && to === "docs") // Запретить размещение элемента высотой 2 на нижнем крае
        ) {
          console.log("Cannot drop item here due to constraints");
          clearHighlight();
          return; // Выходим раньше, чтобы предотвратить дальнейшее выполнение
        }
      }

      // Проверка, является ли целевой элемент двухслотовым элементом
      const targetItem = newToItems[index];
      if (targetItem && (targetItem.width === 2 || targetItem.height === 2)) {
        console.log("Cannot swap with a two-slot item");
        clearHighlight();
        return;
      }

      // Обычная обработка предметов без ширины и высоты 2
      if (draggedItem.width === 2) {
        const targetItem = newToItems[index];
        const targetItemNext = newToItems[index + 1];

        newFromItems[draggedFrom.index] = targetItem || null;
        newFromItems[draggedFrom.index + 1] = targetItemNext || null;

        newToItems[index] = { ...draggedItem, isFirstCopy: true };
        newToItems[index + 1] = {
          ...draggedItem,
          isCopy: true,
          isFirstCopy: false,
        };
      } else if (draggedItem.height === 2) {
        const targetItem = newToItems[index];
        const targetItemBelow = newToItems[index + 5];

        newFromItems[draggedFrom.index] = targetItem || null;
        newFromItems[draggedFrom.index + 5] = targetItemBelow || null;

        newToItems[index] = { ...draggedItem, isFirstCopy: true };
        newToItems[index + 5] = {
          ...draggedItem,
          isCopy: true,
          isFirstCopy: false,
        };
      } else {
        const targetItem = newToItems[index];
        newFromItems[draggedFrom.index] = targetItem || null;
        newToItems[index] = draggedItem;
      }

      setFromItems(newFromItems);
      setToItems(newToItems);
      setDraggedItem(null);
      setDraggedFrom(null);
      clearHighlight();
    }
  };

  const clearHighlight = () => {
    setHighlightedPocketSlot(null);
    setHighlightedDocSlot(null);
    setHighlightedBagSlot(null);
    setHighlightedAdditionalSlot(null);
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
                  {Array.from({ length: 10 }).map((_, index) => {
                    const isHidingPlace = index === 4;
                    return isHidingPlace ? (
                      <div
                        className={`${style.inventorySlot} ${
                          highlightedPocketSlot === index ? style.highlight : ""
                        } ${isHidingPlace ? style.hidingPlace : ""}`}
                        key={index}
                        onDragOver={(e) =>
                          handleDragOver(
                            e,
                            index,
                            isPocketOpen ? "pocket" : "docs"
                          )
                        }
                        onDrop={(e) =>
                          handleDrop(e, "pocketHidingPlace", index)
                        }
                        style={{
                          position: `${
                            (pocketHidingPlaces[index]?.width === 2 &&
                              pocketHidingPlaces[index]?.isFirstCopy) ||
                            pocketHidingPlaces[index]?.height === 2
                              ? "relative"
                              : ""
                          }`,
                          zIndex: `${
                            (pocketHidingPlaces[index]?.width === 2 &&
                              pocketHidingPlaces[index]?.isFirstCopy) ||
                            (pocketHidingPlaces[index]?.height === 2 &&
                              pocketHidingPlaces[index]?.isFirstCopy)
                              ? "1"
                              : ""
                          }`,
                          width: `${
                            pocketHidingPlaces[index]?.width === 2 &&
                            pocketHidingPlaces[index]?.isFirstCopy
                              ? "119px"
                              : ""
                          }`,
                          height: `${
                            pocketHidingPlaces[index]?.height === 2 &&
                            pocketHidingPlaces[index]?.isFirstCopy
                              ? "119px"
                              : ""
                          }`,
                        }}
                      >
                        {pocketHidingPlaces[index] && (
                          <img
                            src={pocketHidingPlaces[index].data}
                            alt={pocketHidingPlaces[index].name}
                            onDragStart={(e) =>
                              handleDragStart(
                                e,
                                pocketHidingPlaces[index],
                                "pocketHidingPlace",
                                index
                              )
                            }
                            style={{
                              width: `${
                                pocketHidingPlaces[index]?.width !== 2 &&
                                pocketHidingPlaces[index]?.height !== 2
                                  ? "35px"
                                  : pocketHidingPlaces[index]?.height === 2
                                  ? "40px"
                                  : pocketHidingPlaces[index]?.width === 2
                                  ? "100%"
                                  : ""
                              }`,
                              display: `${
                                (pocketHidingPlaces[index]?.width === 2 &&
                                  !pocketHidingPlaces[index]?.isFirstCopy) ||
                                (pocketHidingPlaces[index]?.height === 2 &&
                                  !pocketHidingPlaces[index]?.isFirstCopy)
                                  ? "none"
                                  : ""
                              }`,
                            }}
                          />
                        )}
                        <span
                          className={style.inventoryQtyChange}
                          style={{ color: "#fff" }}
                        >
                          {pocketHidingPlaces[index]
                            ? pocketHidingPlaces[index].quantity !== 1
                              ? `x${pocketHidingPlaces[index].quantity}`
                              : ""
                            : ""}
                        </span>
                        <span
                          className={style.inventoryWeight}
                          style={{ color: "#fff" }}
                        >
                          {pocketHidingPlaces[index]
                            ? `${(
                                pocketHidingPlaces[index]?.weight *
                                pocketHidingPlaces[index].quantity
                              ).toFixed(1)}`
                            : ""}
                        </span>
                      </div>
                    ) : (
                      <div
                        className={`${style.inventorySlot} ${
                          highlightedPocketSlot === index ? style.highlight : ""
                        } ${isHidingPlace ? style.hidingPlace : ""}`}
                        key={index}
                        onDragOver={(e) =>
                          handleDragOver(
                            e,
                            index,
                            isPocketOpen ? "pocket" : "docs"
                          )
                        }
                        onDrop={(e) => handleDrop(e, "pocket", index)}
                        style={{
                          position: `${
                            (pocketItems[index]?.width === 2 &&
                              pocketItems[index]?.isFirstCopy) ||
                            pocketItems[index]?.height === 2
                              ? "relative"
                              : ""
                          }`,
                          zIndex: `${
                            (pocketItems[index]?.width === 2 &&
                              pocketItems[index]?.isFirstCopy) ||
                            (pocketItems[index]?.height === 2 &&
                              pocketItems[index]?.isFirstCopy)
                              ? "1"
                              : ""
                          }`,
                          width: `${
                            pocketItems[index]?.width === 2 &&
                            pocketItems[index]?.isFirstCopy
                              ? "119px"
                              : ""
                          }`,
                          height: `${
                            pocketItems[index]?.height === 2 &&
                            pocketItems[index]?.isFirstCopy
                              ? "119px"
                              : ""
                          }`,
                        }}
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
                              display: `${
                                (pocketItems[index]?.width === 2 &&
                                  !pocketItems[index]?.isFirstCopy) ||
                                (pocketItems[index]?.height === 2 &&
                                  !pocketItems[index]?.isFirstCopy)
                                  ? "none"
                                  : ""
                              }`,
                            }}
                          />
                        )}
                        <span className={style.inventoryQtyChange}>
                          {pocketItems[index]
                            ? pocketItems[index].quantity !== 1
                              ? `x${pocketItems[index].quantity}`
                              : ""
                            : ""}
                        </span>
                        <span className={style.inventoryWeight}>
                          {pocketItems[index]
                            ? `${(
                                pocketItems[index]?.weight *
                                pocketItems[index].quantity
                              ).toFixed(1)}`
                            : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {isDocOpen && (
                <div className={style.inventoryFiveColSlots}>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div
                      className={`${style.inventorySlot} ${
                        highlightedDocSlot === index ? style.highlight : ""
                      } `}
                      key={index}
                      onDragOver={(e) => handleDragOver(e, index, "docs")}
                      onDrop={(e) => handleDrop(e, "docs", index)}
                      style={{
                        position: `${
                          (docsItems[index]?.width === 2 &&
                            docsItems[index]?.isFirstCopy) ||
                          docsItems[index]?.height === 2
                            ? "relative"
                            : ""
                        }`,
                        zIndex: `${
                          (docsItems[index]?.width === 2 &&
                            docsItems[index]?.isFirstCopy) ||
                          (docsItems[index]?.height === 2 &&
                            docsItems[index]?.isFirstCopy)
                            ? "1"
                            : ""
                        }`,
                        width: `${
                          docsItems[index]?.width === 2 &&
                          docsItems[index]?.isFirstCopy
                            ? "119px"
                            : ""
                        }`,
                        height: `${
                          docsItems[index]?.height === 2 &&
                          docsItems[index]?.isFirstCopy
                            ? "119px"
                            : ""
                        }`,
                      }}
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
                            display: `${
                              (docsItems[index]?.width === 2 &&
                                !docsItems[index]?.isFirstCopy) ||
                              (docsItems[index]?.height === 2 &&
                                !docsItems[index]?.isFirstCopy)
                                ? "none"
                                : ""
                            }`,
                          }}
                        />
                      )}
                      <span className={style.inventoryQtyChange}>
                        {docsItems[index]
                          ? docsItems[index].quantity !== 1
                            ? `x${docsItems[index].quantity}`
                            : ""
                          : ""}
                      </span>
                      <span className={style.inventoryWeight}>
                        {docsItems[index]
                          ? `${(
                              docsItems[index]?.weight *
                              docsItems[index].quantity
                            ).toFixed(1)}`
                          : ""}
                      </span>
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
                    highlightedAdditionalSlot === index ? style.highlight : ""
                  } `}
                  key={index}
                  onDragOver={(e) => handleDragOver(e, index, "additional")}
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
                {Array.from({ length: 20 }).map((_, index) => {
                  const isHidingPlace = index === 4 || index === 9;

                  return isHidingPlace ? (
                    <div
                      className={`${style.inventorySlot} ${
                        highlightedBagSlot === index ? style.highlight : ""
                      } ${isHidingPlace ? style.hidingPlace : ""}`}
                      key={index}
                      onDragOver={(e) =>
                        handleDragOver(e, index, "bagHidingPlace")
                      }
                      onDrop={(e) => handleDrop(e, "bagHidingPlace", index)}
                      style={{
                        position: `${
                          (bagHidingPlaces[index]?.width === 2 &&
                            bagHidingPlaces[index]?.isFirstCopy) ||
                          bagHidingPlaces[index]?.height === 2
                            ? "relative"
                            : ""
                        }`,
                        zIndex: `${
                          (bagHidingPlaces[index]?.width === 2 &&
                            bagHidingPlaces[index]?.isFirstCopy) ||
                          (bagHidingPlaces[index]?.height === 2 &&
                            bagHidingPlaces[index]?.isFirstCopy)
                            ? "1"
                            : ""
                        }`,
                        width: `${
                          bagHidingPlaces[index]?.width === 2 &&
                          bagHidingPlaces[index]?.isFirstCopy
                            ? "119px"
                            : ""
                        }`,
                        height: `${
                          bagHidingPlaces[index]?.height === 2 &&
                          bagHidingPlaces[index]?.isFirstCopy
                            ? "119px"
                            : ""
                        }`,
                      }}
                    >
                      {bagHidingPlaces[index] && (
                        <img
                          src={bagHidingPlaces[index].data}
                          alt={bagHidingPlaces[index].name}
                          className={style.inventoryItem}
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(
                              e,
                              bagHidingPlaces[index],
                              "bagHidingPlace",
                              index
                            )
                          }
                          style={{
                            width: `${
                              bagHidingPlaces[index]?.width !== 2 &&
                              bagHidingPlaces[index]?.height !== 2
                                ? "35px"
                                : bagHidingPlaces[index]?.height === 2
                                ? "40px"
                                : bagHidingPlaces[index]?.width === 2
                                ? "100%"
                                : ""
                            }`,
                            display: `${
                              (bagHidingPlaces[index]?.width === 2 &&
                                !bagHidingPlaces[index]?.isFirstCopy) ||
                              (bagHidingPlaces[index]?.height === 2 &&
                                !bagHidingPlaces[index]?.isFirstCopy)
                                ? "none"
                                : ""
                            }`,
                          }}
                        />
                      )}{" "}
                      <span
                        className={style.inventoryQtyChange}
                        style={{ color: "#fff" }}
                      >
                        {bagHidingPlaces[index]
                          ? bagHidingPlaces[index].quantity !== 1
                            ? `x${bagHidingPlaces[index].quantity}`
                            : ""
                          : ""}
                      </span>
                      <span
                        className={style.inventoryWeight}
                        style={{ color: "#fff" }}
                      >
                        {bagHidingPlaces[index]
                          ? `${(
                              bagHidingPlaces[index]?.weight *
                              bagHidingPlaces[index].quantity
                            ).toFixed(1)}`
                          : ""}
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`${style.inventorySlot} ${
                        highlightedBagSlot === index ? style.highlight : ""
                      }`}
                      key={index}
                      onDragOver={(e) => handleDragOver(e, index, "bag")}
                      onDrop={(e) => handleDrop(e, "bag", index)}
                      style={{
                        position: `${
                          (bagItems[index]?.width === 2 &&
                            bagItems[index]?.isFirstCopy) ||
                          bagItems[index]?.height === 2
                            ? "relative"
                            : ""
                        }`,
                        zIndex: `${
                          (bagItems[index]?.width === 2 &&
                            bagItems[index]?.isFirstCopy) ||
                          (bagItems[index]?.height === 2 &&
                            bagItems[index]?.isFirstCopy)
                            ? "1"
                            : ""
                        }`,
                        width: `${
                          bagItems[index]?.width === 2 &&
                          bagItems[index]?.isFirstCopy
                            ? "119px"
                            : ""
                        }`,
                        height: `${
                          bagItems[index]?.height === 2 &&
                          bagItems[index]?.isFirstCopy
                            ? "119px"
                            : ""
                        }`,
                      }}
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
                            display: `${
                              (bagItems[index]?.width === 2 &&
                                !bagItems[index]?.isFirstCopy) ||
                              (bagItems[index]?.height === 2 &&
                                !bagItems[index]?.isFirstCopy)
                                ? "none"
                                : ""
                            }`,
                          }}
                        />
                      )}{" "}
                      <span className={style.inventoryQtyChange}>
                        {bagItems[index]
                          ? bagItems[index].quantity !== 1
                            ? `x${bagItems[index].quantity}`
                            : ""
                          : ""}
                      </span>
                      <span className={style.inventoryWeight}>
                        {bagItems[index]
                          ? `${(
                              bagItems[index]?.weight * bagItems[index].quantity
                            ).toFixed(1)}`
                          : ""}
                      </span>
                    </div>
                  );
                })}
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
