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
   * Returns the import regex.
   *
   * @function getAnnotationsRegex
   * @private
   * @memberof ListEntitiesProvider
   * @example
   * const importRegex = provider.getAnnotationsRegex();
   *
   * @returns {RegExp | undefined} - The import regex
   */
  getAnnotationsRegex(): RegExp | undefined {
    // Escape special characters in annotations for regex
    const escapedAnnotations = this.annotations.map((annotation) =>
      annotation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    );

    // Construct regular expression pattern
    const importPattern = `@(${escapedAnnotations.join('|')})`;

    // Construct regular expression
    return new RegExp(importPattern);
  }
}
