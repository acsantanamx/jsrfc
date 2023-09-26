import { DateTime } from "luxon"
import { InvalidExpressionToParseException } from "./exceptions/invalid-expression-to-parse-exception"

export class RfcParser {
  constructor(name, year, month, day, hKey, checksum, date) {
    this._name = name
    this._year = year
    this._month = month
    this._day = day
    this._hKey = hKey
    this._checksum = checksum
    this._date = date
  }

  /**
   * @param rfc -
   * @throws InvalidExpressionToParseException
   *
   */
  static parse(rfc) {
    /**
     * Explicación de la expresión regular:
     * - desde el inicio
     *      /^
     * - letras y números para el nombre (3 para morales, 4 para físicas)
     *      (?<name>[A-ZÑ&]\{3,4\})
     * - año mes y día, la validez de la fecha se comprueba después
     *      (?<year>[0-9]\{2\})(?<month>[0-9]\{2\})(?<day>[0-9]\{2\})
     * - homoclave (letra o dígito 2 veces + A o dígito 1 vez)
     *      (?<hkey>[A-Z0-9]\{2\})(?<checksum>[A0-9]\{1\})
     * - hasta el final
     *      $/
     * - tratamiento unicode
     *      u
     */
    const regex = /^(?<name>[A-ZÑ&]{3,4})(?<year>\d{2})(?<month>\d{2})(?<day>\d{2})(?<hkey>[A-Z0-9]{2})(?<checksum>[A0-9])$/u
    const matches = regex.exec(rfc.toUpperCase())
    if (!matches?.groups)
      throw new Error("The RFC expression does not contain the valid parts")
    const date = DateTime.fromISO(
      `20${matches.groups.year}-${matches.groups.month}-${matches.groups.day}`
    )
    if (
      `${matches.groups.year}${matches.groups.month}${matches.groups.day}` !==
      date.toFormat("yyLLdd")
    ) {
      throw InvalidExpressionToParseException.invalidDate(rfc)
    }

    return new RfcParser(
      matches.groups.name,
      Number(matches.groups.year),
      Number(matches.groups.month),
      Number(matches.groups.day),
      matches.groups.hkey,
      matches.groups.checksum,
      date
    )
  }

  getName() {
    return this._name
  }

  getYear() {
    return this._year
  }

  getMonth() {
    return this._month
  }

  getDay() {
    return this._day
  }

  getHKey() {
    return this._hKey
  }

  getChecksum() {
    return this._checksum
  }

  getDate() {
    return this._date
  }
}
