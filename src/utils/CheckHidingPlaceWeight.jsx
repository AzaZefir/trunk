export const checkHidingPlaceWeight = (
  target,
  item,
  targetData,
  targetItem,
  source,
  setIsBagHidenPlaceOverweight,
  setIsPocketHidenPlaceOverweight
) => {
  const hidingPlaceWeight = targetData.reduce(
    (total, invItem) =>
      total + (invItem?.weight || 0) * (invItem?.quantity || 1),
    0
  );
  if (
    target === "pocketHidingData" ||
    target === "bagHidingData" ||
    (source !== "bag" &&
      source !== "pocket" &&
      source !== "selectedItems" &&
      source !== "docs" &&
      targetItem &&
      targetItem.weight * targetItem.quantity > 0.5)
  ) {
    const newHidingPlaceWeight = hidingPlaceWeight + (item.weight || 0);

    if (newHidingPlaceWeight > 0.5) {
      if (target === "pocketHidingData") {
        setIsPocketHidenPlaceOverweight(true);
      } else if (target === "bagHidingData") {
        setIsBagHidenPlaceOverweight(true);
      }
      return false;
    }
  }

  return true;
};
