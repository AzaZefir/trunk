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

      // Проверка весовых ограничений и прочих условий
      if (target === "selectedItems") {
        if (
          ((targetIndex === 0 || targetIndex === 4) &&
            item.type !== "steelArms") || // Index 0 or 4 must be steelArms
          ((targetIndex === 2 || targetIndex === 6) &&
            item.type !== "bullet") || // Index 2 or 6 must be bullet
          ((targetIndex === 3 ||
            targetIndex === 7 ||
            targetIndex === 8 ||
            targetIndex === 9 ||
            targetIndex === 10 ||
            targetIndex === 11 ||
            targetIndex === 12) &&
            item.type === "bullet") || // Other indexes cannot have width 2 or height 2
          (targetIndex !== 0 &&
            targetIndex !== 4 &&
            targetIndex !== 2 &&
            targetIndex !== 6 &&
            (item.width === 2 || item.height === 2)) // Other indexes cannot have width 2 or height 2
        ) {
          console.log("Неверное размещение предмета");
          return prevData;
        }
      }

      // Проверка веса для тайника
      if (
        target !== "docs" &&
        target !== "selectedItems" &&
        !checkHidingPlaceWeight(target, item, targetData, targetItem, source)
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

      if (targetItem && (targetItem.width === 2 || targetItem.height === 2)) {
        console.log("Cannot swap with a two-slot item");
        return prevData;
      }

      if (
        targetItem &&
        sourceIndex !== -1 &&
        targetItem.name !== sourceItem.name
      ) {
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
          isCopy: true,
          isFirstCopy: false,
        };
      }

       // Логика для размещения пуль при размещении оружия
    if (
      item.type === "steelArms" &&
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
        if (!targetData[2]) {
          targetData[2] = bullets[0];
          bullets.shift();
        }

        if (!targetData[6] && bullets.length > 0) {
          targetData[6] = bullets[0];
          bullets.shift();
        }
      }
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
    <InventoryContext.Provider value={{ inventoryData, moveItem }}>
      {children}
    </InventoryContext.Provider>
  );
};
