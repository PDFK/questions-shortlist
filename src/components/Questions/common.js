export const validOptions = (value, component) => {
  const killer_value = Array.isArray(value)
    ? value
    : typeof value === "object"
    ? [value]
    : [];
  const options = component.state.options.map(function(option) {
    return option.value;
  });
  const valid_options =
    killer_value.filter(function(item) {
      return options.includes(item.value);
    }) || [];
  return valid_options;
};
