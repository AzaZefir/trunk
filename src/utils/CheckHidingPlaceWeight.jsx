export const checkHidingPlaceWeight = (
  target,
  item,
  targetData,
  targetItem,
  source
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
      targetItem &&
      targetItem.weight * targetItem.quantity > 0.5)
  ) {
    const newHidingPlaceWeight = hidingPlaceWeight + (item.weight || 0);

    if (newHidingPlaceWeight > 0.5) {
      alert("В тайник можно положить предметы суммарно не более 0.5кг!");
      return false;
    }
  }

  return true;
};
