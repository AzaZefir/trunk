import React, { createContext, useEffect, useState } from "react";
import { bagData, docsData, pocketData } from "./../data/index";
import { calculateWeight } from "../utils/CalculateWeight";
import { weightLimitCheck } from "../utils/WeightLimitCheck";
import { checkHidingPlaceWeight } from "./../utils/CheckHidingPlaceWeight";

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [inventoryData, setInventoryData] = useState({
    pocket: initializeItems(pocketData, [4]),
    pocketHidingData: [],
    bag: initializeItems(bagData, [4, 9]),
    docs: initializeItems(docsData),
    selectedItems: [],
    bagHidingData: [],
    weight: {
      docs: 0,
      pocket: 0,
      bag: 0,
    },
    limit: {
      docs: 20,
      pocket: 8,
      bag: 25,
    },
    weightError: {
      pocket: "",
      bag: "",
      docs: "",
    },
  });
  const [isBagHidenPlaceOverweight, setIsBagHidenPlaceOverweight] =
    useState(false);
  const [isPocketHidenPlaceOverweight, setIsPocketHidenPlaceOverweight] =
    useState(false);

  useEffect(() => {
    setInventoryData((prevData) => ({
      ...prevData,
      weight: {
        docs: calculateWeight(prevData?.docs),
        pocket: calculateWeight(prevData.pocket),
        bag: calculateWeight(prevData.bag),
      },
    }));
  }, [inventoryData.docs, inventoryData.pocket, inventoryData.bag]);

  const moveItem = (source, target, item, targetIndex) => {
    setInventoryData((prevData) => {
      const updatedData = { ...prevData };
      const sourceData = updatedData[source];
      const targetData = updatedData[target];

      const sourceIndex = sourceData.findIndex(
        (invItem) => invItem?.itemId === item.itemId
      );
      const sourceItem = sourceData[sourceIndex];
      const targetItemIndex = targetData.findIndex(
        (invItem) => invItem?.itemId === item.itemId
      );
      const targetItem = targetData[targetIndex];

      if (sourceIndex === -1) {
        return prevData; // Предмет не найден в исходной секции
      }

      // Проверка на перемещение оружия в секцию pocket или docs
      if (
        (target === "pocket" ||
          target === "docs" ||
          target === "pocketHidingData") &&
        item.type === "gun"
      ) {
        console.log(
          "Нельзя перемещать оружие в секцию pocket, pocketHidingData или docs"
        );
        return prevData;
      }

      // Проверка весовых ограничений и прочих условий
      if (target === "selectedItems") {
        if (
          ((targetIndex === 0 || targetIndex === 4) && item.type !== "gun") || // Индекс 0 или 4 должен быть gun
          ((targetIndex === 2 || targetIndex === 6) &&
            item.type !== "bullet") || // Индекс 2 или 6 должен быть bullet
          ([3, 7, 8, 9, 10, 11, 12].includes(targetIndex) &&
            (item.type === "bullet" || item.type === "gun")) || // Другие индексы не могут содержать bullet
          (![0, 4, 2, 6].includes(targetIndex) &&
            (item.width === 2 || item.height === 2)) || // Другие индексы не могут иметь ширину 2 или высоту 2
          ((targetIndex !== 0 || targetIndex !== 4) && item.height === 2) || // Индексы, кроме 0 и 4, не могут иметь высоту 2
          item.type === "bullet"
        ) {
          console.log("Неверное размещение предмета");
          return prevData;
        }
      }

      // Проверка веса для тайника
      if (
        !checkHidingPlaceWeight(
          target,
          item,
          targetData,
          targetItem,
          source,
          setIsBagHidenPlaceOverweight,
          setIsPocketHidenPlaceOverweight
        )
      ) {
        return prevData;
      }

      // Проверка веса при перемещении между секциями
      if (source !== target) {
        const { weightError, isValid } = weightLimitCheck(
          source,
          target,
          item,
          targetItem,
          updatedData
        );
        if (!isValid) {
          return {
            ...prevData,
            weightError,
          };
        }
        updatedData.weightError = weightError;
      }

      updatedData.weightError = {
        ...updatedData.weightError,
        [target]: "",
      };

      const isTwoSlotItem = (idx) => {
        return (
          targetData[idx] &&
          (targetData[idx].width === 2 || targetData[idx].height === 2)
        );
      };

      const isDraggedItemTwoSlot = () => {
        return item.width === 2 || item.height === 2;
      };

      if (isDraggedItemTwoSlot() && isTwoSlotItem(targetIndex)) {
        console.log("Cannot swap two-slot items");
        return prevData;
      }

      if (item.width === 2 || item.height === 2) {
        if (source === "selectedItems") {
          const isSlotFree =
            !targetData[targetIndex] && !targetData[targetIndex + 1];

          if (!isSlotFree && source !== target) {
            console.log("Slot is occupied");
            return prevData;
          }
        }
        const rowIndex = Math.floor(targetIndex / 5);

        const isAtRightEdge =
          (rowIndex < 2 && targetIndex % 5 === 3) ||
          (rowIndex >= 2 && targetIndex % 5 === 4);

        const isAtRightPocketEdge =
          (rowIndex < 1 && targetIndex % 5 === 3) ||
          (rowIndex >= 1 && targetIndex % 5 === 4);

        if (
          (targetIndex < targetData.length - 1 &&
            isTwoSlotItem(targetIndex + 1) &&
            item.height !== 2) ||
          (targetIndex < targetData.length - 5 &&
            isTwoSlotItem(targetIndex + 5) &&
            item.width !== 2) ||
          (item.width === 2 && isAtRightEdge && target === "bag") ||
          (item.width === 2 && isAtRightPocketEdge && target === "pocket") ||
          (item.width === 2 &&
            targetIndex % 5 === 4 &&
            target !== "selectedItems") ||
          (item.height === 2 && targetIndex >= 15 && target !== "pocket") ||
          (item.height === 2 && targetIndex >= 15 && target !== "docs") ||
          (item.height === 2 && targetIndex >= 5 && target === "pocket") ||
          (item.height === 2 && targetIndex >= 5 && target === "docs")
        ) {
          console.log("Cannot drop item here due to constraints");
          return prevData;
        }
      }

      if (
        targetItem &&
        (targetItem.width === 2 || targetItem.height === 2) &&
        source !== "selectedItems"
      ) {
        console.log("Cannot swap with a two-slot item");
        return prevData;
      }

      // Новая проверка для предотвращения обмена между предметами gun на индексах 0 и 4
      if (
        source !== target &&
        sourceItem.type === "gun" &&
        targetItem?.type === "gun"
      ) {
        console.log("Cannot swap guns between slots 0 and 4");
        return prevData;
      }

      if (
        targetItem &&
        sourceIndex !== -1 &&
        targetItem.name !== sourceItem.name
      ) {
        if (source === "selectedItems") {
          const isSlotFree =
            !targetData[targetIndex] && !targetData[targetIndex + 1];

          if (!isSlotFree && source !== target) {
            console.log("Slot is occupied");
            return prevData;
          }
        }

        sourceData[sourceIndex] = targetItem;
        targetData[targetIndex] = sourceItem;
      } else {
        // Проверка веса при перемещении между секциями
        if (source !== target) {
          // Логика для перемещения между разными секциями
          if (sourceItem.quantity > 1) {
            sourceItem.quantity -= 1;
          } else {
            sourceData[sourceIndex] = null;
          }

          if (targetItemIndex !== -1) {
            targetData[targetItemIndex].quantity += 1;
          } else {
            targetData[targetIndex] = {
              ...item,
              quantity: 1,
            };
          }
        } else {
          // Логика для перемещения внутри одной секции
          if (sourceIndex !== targetIndex) {
            if (sourceItem.quantity === 3 || sourceItem.quantity === 2) {
              // Перемещение предмета с quantity === 3 без изменения количества
              sourceData[sourceIndex] = null;
              targetData[targetIndex] = {
                ...item,
                quantity: sourceItem.quantity,
              };
            } else {
              // Обычное перемещение внутри одной секции
              if (sourceItem.quantity > 1) {
                sourceItem.quantity -= 1;
              } else {
                sourceData[sourceIndex] = null;
              }

              if (targetData[targetIndex]) {
                targetData[targetIndex].quantity += 1;
              } else {
                targetData[targetIndex] = {
                  ...item,
                  quantity: 1,
                };
              }
            }
          }
        }
      }

      // Новая логика для предметов с шириной 2 или высотой 2
      if (item.width === 2) {
        const targetItemNext = targetData[targetIndex + 1];

        sourceData[sourceIndex] = targetItem || null;
        sourceData[sourceIndex + 1] = targetItemNext || null;

        targetData[targetIndex] = { ...item, isFirstCopy: true };
        targetData[targetIndex + 1] = {
          ...item,
          quantity: 0,
          isCopy: true,
          isFirstCopy: false,
        };
      } else if (item.height === 2) {
        // Определяем индекс элемента ниже целевого индекса
        const targetItemBelowIndex = targetIndex + 5;

        // Проверяем, чтобы индексы не выходили за границы
        if (targetItemBelowIndex >= targetData.length) {
          return;
        }

        const targetItemBelow = targetData[targetItemBelowIndex];

        // Обновляем данные для исходной и целевой секций
        sourceData[sourceIndex] = targetItem || null;
        sourceData[sourceIndex + 5] = targetItemBelow || null;

        targetData[targetIndex] = { ...item, isFirstCopy: true };
        targetData[targetItemBelowIndex] = {
          ...item,
          quantity: 0,
          isCopy: true,
          isFirstCopy: false,
        };
      }

      // Логика для размещения пуль при размещении оружия
      if (
        item.type === "gun" &&
        target === "selectedItems" &&
        (targetIndex === 0 || targetIndex === 4)
      ) {
        // Удаление пуль из старого места оружия
        const bullets = sourceData.filter(
          (i) => i?.type === "bullet" && i?.model === item.model
        );

        sourceData.forEach((i, idx) => {
          if (i?.type === "bullet" && i?.model === item.model) {
            sourceData[idx] = null;
          }
        });

        // Проверка и размещение пуль в слоты 2 и 6
        if (bullets.length > 0) {
          const targetItemNext = targetData[targetIndex + 2];

          targetData[sourceIndex] = targetItem || null;
          targetData[sourceIndex + 2] = targetItemNext || null;

          targetData[targetIndex] = { ...item, isFirstCopy: true };
          targetData[targetIndex + 2] = bullets[0];
        }
      }

      // Логика для перемещения пуль вместе с оружием
      if (
        item.type === "gun" &&
        source === "selectedItems" &&
        target !== "selectedItems"
      ) {
        // Найти все пули, которые соответствуют оружию
        const bullets = sourceData.filter(
          (i) => i?.type === "bullet" && i?.model === item.model
        );

        // Удалить пули из исходного массива
        sourceData.forEach((i, idx) => {
          if (i?.type === "bullet" && i?.model === item.model) {
            sourceData[idx] = null;
          }
        });

        // Переместить каждую пулю в первый свободный слот секции `bag`, кроме индексов 4 и 9
        bullets.forEach((bullet) => {
          // Найти индекс целевой секции `bag`
          const targetDataBag = updatedData["bag"];

          // Найти первый свободный слот в секции `bag`, кроме индексов 4 и 9
          let firstEmptySlotIndex = targetDataBag.findIndex(
            (targetItem, idx) => targetItem === null && ![4, 9].includes(idx)
          );

          if (firstEmptySlotIndex !== -1) {
            targetDataBag[firstEmptySlotIndex] = bullet;
          } else {
            console.log(
              "Нет свободных слотов для пуль в секции 'bag', кроме индексов 4 и 9"
            );
          }
        });
      }

      updatedData[source] = sourceData; // Удаление null элементов
      updatedData[target] = targetData;

      // Пересчитываем вес
      updatedData.weight[source] = calculateWeight(sourceData);
      updatedData.weight[target] = calculateWeight(targetData);

      return updatedData;
    });
  };

  // Function to initialize items in the inventory
  function initializeItems(data, skipIndices = []) {
    const items = new Array(20).fill(null);
    let currentIndex = 0;
    data.forEach((item) => {
      if (item.width === 2) {
        while (
          skipIndices.includes(currentIndex) ||
          skipIndices.includes(currentIndex + 1) ||
          items[currentIndex] !== null ||
          items[currentIndex + 1] !== null
        ) {
          currentIndex += 1;
        }
        if (currentIndex < items.length) {
          items[currentIndex] = { ...item, isFirstCopy: true };
          if (currentIndex + 1 < items.length) {
            items[currentIndex + 1] = {
              ...item,
              quantity: 0,
              isCopy: true,
              isFirstCopy: false,
            };
          }
          currentIndex += 2;
        }
      } else if (item.height === 2) {
        while (
          skipIndices.includes(currentIndex) ||
          skipIndices.includes(currentIndex + 5) ||
          items[currentIndex] !== null ||
          items[currentIndex + 5] !== null
        ) {
          currentIndex += 1;
        }
        if (currentIndex < items.length) {
          items[currentIndex] = { ...item, isFirstCopy: true };
          if (currentIndex + 5 < items.length) {
            items[currentIndex + 5] = {
              ...item,
              quantity: 0,
              isCopy: true,
              isFirstCopy: false,
            };
          }
          currentIndex += 1;
        }
      } else {
        while (
          skipIndices.includes(currentIndex) ||
          items[currentIndex] !== null
        ) {
          currentIndex += 1;
        }
        if (currentIndex < items.length) {
          items[currentIndex] = item;
          currentIndex += 1;
        }
      }
    });

    return items;
  }

  return (
    <InventoryContext.Provider
      value={{
        inventoryData,
        moveItem,
        isBagHidenPlaceOverweight,
        isPocketHidenPlaceOverweight,
        setIsBagHidenPlaceOverweight,
        setIsPocketHidenPlaceOverweight,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
