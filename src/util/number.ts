export const formatWithThousandSeparator = (value: number | string): (string | undefined)  => {
  const [integerPart, decimalPart] = Number(value)
    .toFixed(2)
    .split(".")

  const formattedInteger = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger
}
