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

import InventoryMain from "./components/InventoryMain";

function App() {
 
//   const [pocketItems, setPocketItems] = useState([]);
//   const [docsItems, setDocItems] = useState([]);
//   const [bagItems, setBagItems] = useState([]);
//   const [additionalItems, setAdditionalItems] = useState([]);

//   const [draggedItem, setDraggedItem] = useState(null);
//   const [draggedFrom, setDraggedFrom] = useState(null);

//   const [highlightedBagSlot, setHighlightedBagSlot] = useState(null);
//   const [highlightedPocketSlot, setHighlightedPocketSlot] = useState(null);
//   const [highlightedDocSlot, setHighlightedDocSlot] = useState(null);
//   const [highlightedAdditionalSlot, setHighlightedAdditionalSlot] =
//     useState(null);

//   // Тайники
//   const [bagHidingPlaces, setBagHidingPlaces] = useState([]);
//   const [pocketHidingPlaces, setPocketHidingPlaces] = useState([]);

//   const handlePocketOpen = () => {
//     setIsPocketOpen(true);
//     setIsDocOpen(false);
//   };

//   const handleDocOpen = () => {
//     setIsDocOpen(true);
//     setIsPocketOpen(false);
//   };

//   useEffect(() => {
//     const initializeItems = (data, skipIndices = []) => {
//       const items = new Array(20).fill(null);
//       let currentIndex = 0;

//       data.forEach((item) => {
//         if (item.width === 2) {
//           while (
//             skipIndices.includes(currentIndex) ||
//             skipIndices.includes(currentIndex + 1)
//           ) {
//             currentIndex += 2;
//           }
//           if (currentIndex < items.length) {
//             items[currentIndex] = { ...item, isFirstCopy: true };
//             if (currentIndex + 1 < items.length) {
//               items[currentIndex + 1] = {
//                 ...item,
//                 isCopy: true,
//                 isFirstCopy: false,
//               };
//             }
//             currentIndex += 2;
//           }
//         } else if (item.height === 2) {
//           while (
//             skipIndices.includes(currentIndex) ||
//             skipIndices.includes(currentIndex + 5)
//           ) {
//             currentIndex += 1;
//           }
//           if (currentIndex < items.length) {
//             items[currentIndex] = { ...item, isFirstCopy: true };
//             if (currentIndex + 5 < items.length) {
//               items[currentIndex + 5] = {
//                 ...item,
//                 isCopy: true,
//                 isFirstCopy: false,
//               };
//             }
//             currentIndex += 1;
//           }
//         } else {
//           while (skipIndices.includes(currentIndex)) {
//             currentIndex += 1;
//           }
//           if (currentIndex < items.length) {
//             items[currentIndex] = item;
//             currentIndex += 1;
//           }
//         }
//       });

//       return items;
//     };

//     // Initialize items with specific indices to skip (4 and 9)
//     setPocketItems(initializeItems(pocketData, [4]));
//     setDocItems(initializeItems(docsData));
//     setBagItems(initializeItems(bagData, [4, 9]));
//   }, []);

//   const handleDragOver = (e, index, section) => {
//     e.preventDefault();
//     if (section === "pocket") {
//       setHighlightedPocketSlot(index);
//     } else if (section === "docs") {
//       setHighlightedDocSlot(index);
//     } else if (section === "bag") {
//       setHighlightedBagSlot(index);
//     } else if (section === "additional") {
//       setHighlightedAdditionalSlot(index);
//     }
//   };

//   const handleDragStart = (e, item, from, index) => {
//     if (item.isCopy) return;
//     setDraggedItem(item);
//     setDraggedFrom({ from, index });
//   };

//   const handleDrop = (e, to, index) => {
//     e.preventDefault();
//     if (draggedItem && draggedFrom) {
//       let fromItems, setFromItems, toItems, setToItems;

//       // Определение массива источника
//       switch (draggedFrom.from) {
//         case "pocket":
//           fromItems = pocketItems;
//           setFromItems = setPocketItems;
//           break;
//         case "docs":
//           fromItems = docsItems;
//           setFromItems = setDocItems;
//           break;
//         case "bag":
//           fromItems = bagItems;
//           setFromItems = setBagItems;
//           break;
//         case "additional":
//           fromItems = additionalItems;
//           setFromItems = setAdditionalItems;
//           break;
//         case "bagHidingPlace":
//           fromItems = bagHidingPlaces;
//           setFromItems = setBagHidingPlaces;
//           break;
//         case "pocketHidingPlace":
//           fromItems = pocketHidingPlaces;
//           setFromItems = setPocketHidingPlaces;
//           break;
//         default:
//           return; // Если источник не определен, выходим
//       }

//       // Определение массива цели
//       switch (to) {
//         case "pocket":
//           toItems = pocketItems;
//           setToItems = setPocketItems;
//           break;
//         case "docs":
//           toItems = docsItems;
//           setToItems = setDocItems;
//           break;
//         case "bag":
//           toItems = bagItems;
//           setToItems = setBagItems;
//           break;
//         case "additional":
//           toItems = additionalItems;
//           setToItems = setAdditionalItems;
//           break;
//         case "bagHidingPlace":
//           toItems = bagHidingPlaces;
//           setToItems = setBagHidingPlaces;
//           break;
//         case "pocketHidingPlace":
//           toItems = pocketHidingPlaces;
//           setToItems = setPocketHidingPlaces;
//           break;
//         default:
//           return; // Если цель не определена, выходим
//       }

//       const newFromItems = fromItems;
//       const newToItems = toItems;
//       const targetItem = newToItems[index];

//       // Функция для проверки, занят ли индекс двухслотовым элементом
//       const isTwoSlotItem = (idx) => {
//         return (
//           newToItems[idx] &&
//           (newToItems[idx].width === 2 || newToItems[idx].height === 2)
//         );
//       };

//       // Функция проверки того, является ли перетаскиваемый элемент элементом с двумя слотами
//       const isDraggedItemTwoSlot = () => {
//         return draggedItem.width === 2 || draggedItem.height === 2;
//       };

//       // Проверка, являются ли draggedItem и targetItem элементами с двумя слотами.
//       if (isDraggedItemTwoSlot() && isTwoSlotItem(index)) {
//         console.log("Cannot swap two-slot items");
//         clearHighlight();
//         return; // Выходим раньше, чтобы предотвратить дальнейшее выполнение
//       }

//       if (
//         (to === "bagHidingPlace" || to === "pocketHidingPlace") &&
//         draggedItem.weight > 0.5
//       ) {
//         console.log(
//           "Cannot place item in hiding place as it exceeds weight limit"
//         );
//         clearHighlight();
//         return;
//       }

//       // Проверка, имеет ли перетаскиваемыйItem ширину или высоту 2.
//       if (draggedItem.width === 2 || draggedItem.height === 2) {
//         // Предотвратить падение рядом с другим предметом с двумя слотами.
//         const rowIndex = Math.floor(index / 5);

//         // Check if the dragged item is trying to be placed at the right edge
//         const isAtRightEdge =
//           (rowIndex < 2 && index % 5 === 3) || // First two rows, right edge is index 4
//           (rowIndex >= 2 && index % 5 === 4); // Last two rows, right edge is index 5
//         const isAtRightPocketEdge =
//           (rowIndex < 1 && index % 5 === 3) || // First two rows, right edge is index 4
//           (rowIndex >= 1 && index % 5 === 4);
//         if (
//           (index < newToItems.length - 1 &&
//             isTwoSlotItem(index + 1) &&
//             draggedItem.height !== 2) || // Правый слот
//           (index < newToItems.length - 5 &&
//             isTwoSlotItem(index + 5) &&
//             draggedItem.width !== 2) || // Нижний слот
//           (draggedItem.width === 2 && isAtRightEdge && to === "bag") || // Запретить размещение элемента шириной 2 на правом краю
//           (draggedItem.width === 2 && isAtRightPocketEdge && to === "pocket") || // Запретить размещение элемента шириной 2 на правом краю
//           (draggedItem.width === 2 && index % 5 === 4) || // Запретить размещение элемента шириной 2 на правом краю
//           (draggedItem.height === 2 && index >= 15 && to !== "pocket") || // Запретить размещение элемента высотой 2 на нижнем крае
//           (draggedItem.height === 2 && index >= 15 && to !== "docs") || // Запретить размещение элемента высотой 2 на нижнем крае
//           (draggedItem.height === 2 && index >= 5 && to === "pocket") || // Запретить размещение элемента высотой 2 на нижнем крае
//           (draggedItem.height === 2 && index >= 5 && to === "docs") // Запретить размещение элемента высотой 2 на нижнем крае
//         ) {
//           console.log("Cannot drop item here due to constraints");
//           clearHighlight();
//           return; // Выходим раньше, чтобы предотвратить дальнейшее выполнение
//         }
//       }

//       // Проверка, является ли целевой элемент двухслотовым элементом
//       if (targetItem && (targetItem.width === 2 || targetItem.height === 2)) {
//         console.log("Cannot swap with a two-slot item");
//         clearHighlight();
//         return;
//       }
//       // Перемещение предметов по количеству
//       if (draggedItem.quantity > 1 && fromItems !== toItems) {
//         if (targetItem && targetItem.name === draggedItem.name) {
//           // Увеличить количество предмета на целевом слоте, если имена совпадают
//           newToItems[index] = {
//             ...targetItem,
//             quantity: targetItem.quantity + 1,
//           };

//           // Уменьшить количество исходного элемента
//           newFromItems[draggedFrom.index] = {
//             ...draggedItem,
//             quantity: draggedItem.quantity - 1,
//           };
//         } else {
//           // Обменять местами предметы, если имена не совпадают
//           const tempItem = newToItems[index];

//           // Уменьшить количество исходного элемента
//           newFromItems[draggedFrom.index] = {
//             ...draggedItem,
//             quantity: draggedItem.quantity - 1,
//           };
// console.log(fromItems);
// console.log(toItems);
//           // Переместить исходный элемент в целевой слот
//           newToItems[index] = {
//             ...draggedItem,
//             quantity: (draggedItem.quantity === 3 || draggedItem.quantity === 2) && fromItems !== toItems ? draggedItem.quantity : 1,
//           };

//           // Переместить целевой элемент в исходный слот
//           if (tempItem) {
//             newFromItems[draggedFrom.index] = tempItem;
//           }
//         }
//       } else {
//         if (newToItems[index]?.name === draggedItem?.name) {
//           newToItems[index] = {
//             ...newToItems[index],
//             quantity: newToItems[index].quantity + 1,
//           };
//           // Remove the item from the source slot
//           newFromItems[draggedFrom.index] = null;
//         } else {
//           // Swap items if names do not match
//           if (draggedItem.width === 2) {
//             const targetItemNext = newToItems[index + 1];

//             newFromItems[draggedFrom.index] = targetItem || null;
//             newFromItems[draggedFrom.index + 1] = targetItemNext || null;

//             newToItems[index] = { ...draggedItem, isFirstCopy: true };
//             newToItems[index + 1] = {
//               ...draggedItem,
//               isCopy: true,
//               isFirstCopy: false,
//             };
//           } else if (draggedItem.height === 2) {
//             const targetItemBelow = newToItems[index + 5];

//             newFromItems[draggedFrom.index] = targetItem || null;
//             newFromItems[draggedFrom.index + 5] = targetItemBelow || null;

//             newToItems[index] = { ...draggedItem, isFirstCopy: true };
//             newToItems[index + 5] = {
//               ...draggedItem,
//               isCopy: true,
//               isFirstCopy: false,
//             };
//           } else {
//             newFromItems[draggedFrom.index] = targetItem || null;
//             newToItems[index] = draggedItem;
//           }
//         }
//       }

//       setFromItems(newFromItems);
//       setToItems(newToItems);
//       setDraggedItem(null);
//       setDraggedFrom(null);
//       clearHighlight();
//     }
//   };

  // const clearHighlight = () => {
  //   setHighlightedPocketSlot(null);
  //   setHighlightedDocSlot(null);
  //   setHighlightedBagSlot(null);
  //   setHighlightedAdditionalSlot(null);
  // };

  return (
    <section className={style.inventoryWrapper}>
      <header className={style.inventoryHeader}>
        <h3>
          32<span className={style.weight}>кг</span>$<span>9000</span>
        </h3>
        <img src={logo} alt="GTA-5-RP" className={style.logo} />
      </header>
      <InventoryMain/>
    </section>
  );
}

export default App;
