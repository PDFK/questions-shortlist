export const validOptions = (value, component) => {
  const killerValue = Array.isArray(value)
    ? value
    : typeof value === "object"
    ? [value]
    : [];
  const options = component.state.options.map(function(option) {
    return option.value;
  });
  const validOptions =
    killerValue.filter(function(item) {
      return options.includes(item.value);
    }) || [];
  return validOptions;
};
