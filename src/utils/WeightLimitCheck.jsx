export const weightLimitCheck = (
  source,
  target,
  item,
  targetItem,
  updatedData
) => {
  const newWeight = updatedData.weight[target] + (item.weight || 0);

  if (targetItem) {
    const reverseWeight = updatedData.weight[source] + (targetItem.weight || 0);
    if (reverseWeight > updatedData.limit[source]) {
      return {
        weightError: {
          ...updatedData.weightError,
          [source]: "Вес превышен!",
        },
        isValid: false,
      };
    }
  }

  if (newWeight > updatedData.limit[target]) {
    return {
      weightError: {
        ...updatedData.weightError,
        [target]: "Вес превышен!",
      },
      isValid: false,
    };
  }

  return {
    weightError: {
      ...updatedData.weightError,
      [target]: "",
      [source]: "",
    },
    isValid: true,
  };
};
