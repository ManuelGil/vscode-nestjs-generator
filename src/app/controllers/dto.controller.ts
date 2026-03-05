/**
 * @file Provides class-validator annotation regex patterns used by
 * {@link ListDTOsProvider} to identify DTO files in the workspace.
 *
 * @module controllers/dto
 */

/**
 * Holds the list of `class-validator` decorator names and builds a regex
 * pattern that {@link ListDTOsProvider} uses to scan workspace files for
 * DTO annotations.
 *
 * @class
 * @export
 * @public
 */
export class DTOController {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Private properties
  /**
   * The list of DTO annotations.
   * @type {string[]}
   * @private
   * @memberof DTOController
   */
  private readonly annotations: string[] = [
    'IsDefined',
    'IsOptional',
    'Equals',
    'NotEquals',
    'IsEmpty',
    'IsNotEmpty',
    'IsIn',
    'IsNotIn',
    'IsBoolean',
    'IsDate',
    'IsString',
    'IsNumber',
    'IsInt',
    'IsArray',
    'IsEnum',
    'IsDivisibleBy',
    'IsPositive',
    'IsNegative',
    'Min',
    'Max',
    'MinDate',
    'MaxDate',
    'IsBooleanString',
    'IsDateString',
    'IsNumberString',
    'Contains',
    'NotContains',
    'IsAlpha',
    'IsAlphanumeric',
    'IsDecimal',
    'IsAscii',
    'IsBase32',
    'IsBase58',
    'IsBase64',
    'IsIBAN',
    'IsBIC',
    'IsByteLength',
    'IsCreditCard',
    'IsCurrency',
    'IsISO4217CurrencyCode',
    'IsEthereumAddress',
    'IsBtcAddress',
    'IsDataURI',
    'IsEmail',
    'IsFQDN',
    'IsFullWidth',
    'IsHalfWidth',
    'IsVariableWidth',
    'IsHexColor',
    'IsHSL',
    'IsRgbColor',
    'IsIdentityCard',
    'IsPassportNumber',
    'IsPostalCode',
    'IsHexadecimal',
    'IsOctal',
    'IsMACAddress',
    'IsIP',
    'IsPort',
    'IsISBN',
    'IsEAN',
    'IsISIN',
    'IsISO8601',
    'IsJSON',
    'IsJWT',
    'IsObject',
    'IsNotEmptyObject',
    'IsLowercase',
    'IsLatLong',
    'IsLatitude',
    'IsLongitude',
    'IsMobilePhone',
    'IsISO31661Alpha2',
    'IsISO31661Alpha3',
    'IsLocale',
    'IsPhoneNumber',
    'IsMongoId',
    'IsMultibyte',
    'IsNumberString',
    'IsSurrogatePair',
    'IsTaxId',
    'IsUrl',
    'IsMagnetURI',
    'IsUUID',
    'IsFirebasePushId',
    'IsUppercase',
    'Length',
    'MinLength',
    'MaxLength',
    'Matches',
    'IsMilitaryTime',
    'IsTimeZone',
    'IsHash',
    'IsMimeType',
    'IsSemVer',
    'IsISSN',
    'IsISRC',
    'IsRFC3339',
    'IsStrongPassword',
    'ArrayContains',
    'ArrayNotContains',
    'ArrayNotEmpty',
    'ArrayMinSize',
    'ArrayMaxSize',
    'ArrayUnique',
    'IsInstance',
    'Allow',
  ];

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the DTOController class.
   *
   * @constructor
   * @public
   * @memberof DTOController
   */
  constructor() {}

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods
  /**
   * Builds a regex that matches class-validator decorators at the start of a line.
   *
   * @function getAnnotationsRegex
   * @public
   * @memberof DTOController
   *
   * @returns {RegExp | undefined} A regex matching class-validator decorators.
   */
  getAnnotationsRegex(): RegExp | undefined {
    // Escape special characters in annotations for regex
    const escapedAnnotations = this.annotations.map((annotation) =>
      annotation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    );

    // Match start of line, ignore commented lines, allow indentation, then '@Annotation' with word boundary
    const importPattern = `^(?!\\s*\\/\\/)\\s*@(${escapedAnnotations.join(
      '|',
    )})\\b`;

    return new RegExp(importPattern);
  }
}
