import React, { useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../types/Types";
import { InventoryContext } from "../../app/InventoryContext";

export const useInventoryDragDrop = (index, section, item) => {
  const { moveItem } = useContext(InventoryContext);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.INVENTORY_SLOT,
    item: {
      itemId: item?.itemId,
      name: item?.name,
      quantity: item?.quantity,
      data: item?.data,
      width: item?.width,
      height: item?.height,
      weight: item?.weight,
      section: section,
      index: index,
      type: item?.type,
      model: item?.model,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.INVENTORY_SLOT,
    drop: (droppedItem) => {
      moveItem(droppedItem.section, section, droppedItem, index);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const slotStyle = {
    cursor: `${item ? "pointer" : ""}`,
    opacity: isDragging ? 0.5 : 1,
    overflow: "hidden",
    backgroundColor: isOver ? "rgba(57, 57, 57, 1)" : "rgba(22, 22, 22, 0.76)",
    position: `${
      (item?.width === 2 && item?.isFirstCopy) || item?.height === 2
        ? "relative"
        : ""
    }`,
    zIndex: `${
      (item?.width === 2 && item?.isFirstCopy) ||
      (item?.height === 2 && item?.isFirstCopy)
        ? "1"
        : ""
    }`,
    width: `${item?.width === 2 && item?.isFirstCopy ? "120px" : "60px"}`,
    height: `${item?.height === 2 && item?.isFirstCopy ? "120px" : "60px"}`,
  };

  return {
    dragRef: drag,
    dropRef: drop,
    isDragging,
    slotStyle,
  };
};
