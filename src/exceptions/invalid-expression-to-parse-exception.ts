export class InvalidExpressionToParseException extends Error {
  constructor(message, rfc) {
    super(message)
    this.rfc = rfc
  }

  static invalidParts(rfc) {
    return new InvalidExpressionToParseException(
      "The RFC expression does not contain the valid parts",
      rfc
    )
  }

  static invalidDate(rfc) {
    return new InvalidExpressionToParseException(
      "The RFC expression does not contain a valid date",
      rfc
    )
  }

  getRfc() {
    return this.rfc
  }
}
