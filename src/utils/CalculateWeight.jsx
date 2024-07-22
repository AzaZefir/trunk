export const calculateWeight = (data) => {
  return data.reduce(
    (acc, item) =>
      acc +
      (item && !isNaN(item.weight) && !isNaN(item.quantity)
        ? item.weight * item.quantity
        : 0),
    0
  );
};
