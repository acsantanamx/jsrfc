export class InvalidIntegerToConvertException extends Error {
  constructor(message, value) {
    super(message)
    this.value = value
  }

  static lowerThanZero(value) {
    return new InvalidIntegerToConvertException(
      "The integer serial number is lower than zero",
      value
    )
  }

  static greaterThanMaximum(value) {
    return new InvalidIntegerToConvertException(
      "The integer serial number is greater than maximum value",
      value
    )
  }

  getValue() {
    return this.value
  }
}
