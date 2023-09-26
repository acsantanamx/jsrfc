import { RfcParser } from "./rfc-parser"
import { RfcIntConverter } from "./rfc-int-converter"
import { CheckSum } from "./check-sum"

/**
 * Value object representation of an RFC.
 */
export class Rfc {
  /** Generic representation of an RFC (some use cases include to invoice without RFC) */
  static RFC_GENERIC = "XAXX010101000"
  /** Foreign representation of RFC (used on foreign parties that does not have mexican RFC) */
  static RFC_FOREIGN = "XEXX010101000"
  static DISALLOW_GENERIC = 1
  static DISALLOW_FOREIGN = 2

  constructor(rfc) {
    this._rfc = rfc
    this.length = this._rfc.length
  }

  /**
   * Parse a string and return a new Rfc instance, otherwise will throw an exception.
   *
   * @param rfc -
   * @throws InvalidExpressionToParseException
   */
  static parse(rfc) {
    const parts = RfcParser.parse(rfc)
    rfc = [
      parts.getName(),
      `${parts.getYear()}`.padStart(2, "0"),
      `${parts.getMonth()}`.padStart(2, "0"),
      `${parts.getDay()}`.padStart(2, "0"),
      parts.getHKey(),
      parts.getChecksum()
    ].join("")

    return new Rfc(rfc)
  }

  /**
   * Parse a string, if unable to parse will return NULL.
   *
   * @param rfc -
   */
  static parseOrNull(rfc) {
    try {
      return Rfc.parse(rfc)
    } catch {
      return null
    }
  }

  /**
   * Method to create the object if and only you already thrust the contents.
   *
   * @param rfc -
   */
  static unparsed(rfc) {
    return new Rfc(rfc)
  }

  /**
   * Create a Rfc object based on its numeric representation.
   *
   * @param serial -
   * @throws InvalidIntegerToConvertException
   */
  static fromSerial(serial) {
    return new Rfc(new RfcIntConverter().intToString(serial))
  }

  static newGeneric() {
    return new Rfc(Rfc.RFC_GENERIC)
  }

  static newForeign() {
    return new Rfc(Rfc.RFC_FOREIGN)
  }

  static isValid(value, flags = 0) {
    try {
      Rfc.checkIsValid(value, flags)

      return true
    } catch {
      return false
    }
  }

  static checkIsValid(value, flags = 0) {
    if (flags & Rfc.DISALLOW_GENERIC && value === Rfc.RFC_GENERIC) {
      throw new Error("No se permite el RFC genérico para público en general")
    }

    if (flags & Rfc.DISALLOW_FOREIGN && value === Rfc.RFC_FOREIGN) {
      throw new Error(
        "No se permite el RFC genérico para operaciones con extranjeros"
      )
    }

    RfcParser.parse(value)
  }

  static obtainDate(rfc) {
    try {
      const parts = RfcParser.parse(rfc)

      return parts.getDate().toMillis()
    } catch {
      return 0
    }
  }

  /**
   * Return the rfc content, remember that it is a multibyte string
   */
  getRfc() {
    return this._rfc
  }

  /**
   * Return true if the RFC corresponds to a "Persona Física"
   */
  isFisica() {
    return this.length === 13
  }

  /**
   * Return true if the RFC corresponds to a "Persona Moral"
   */
  isMoral() {
    return this.length === 12
  }

  /**
   * Return true if the RFC corresponds to a generic local RFC
   */
  isGeneric() {
    return Rfc.RFC_GENERIC === this._rfc
  }

  /**
   * Return true if the RFC corresponds to a generic foreign RFC
   */
  isForeign() {
    return Rfc.RFC_FOREIGN === this._rfc
  }

  /**
   * Calculates the checksum of the RFC.
   * Be aware that there are some valid RFC with invalid checksum.
   */
  calculateChecksum() {
    if (!this.checksum) {
      this.checksum = new CheckSum().calculate(this.getRfc())
    }

    return this.checksum
  }

  /**
   * Return true if the last character of the RFC is the sma as the calculated checksum.
   * Be aware that there are some valid RFC with invalid checksum.
   */
  doesCheckSumMatch() {
    return this.calculateChecksum() === this._rfc.charAt(this.length - 1)
  }

  /**
   * Calculates the serial number (integer representation) of the RFC
   */
  calculateSerial() {
    if (!this.serial) {
      this.serial = new RfcIntConverter().stringToInt(this.getRfc())
    }

    return this.serial
  }

  toString() {
    return this._rfc
  }

  toLocaleString() {
    return this._rfc
  }

  toJSON() {
    return this._rfc
  }
}
