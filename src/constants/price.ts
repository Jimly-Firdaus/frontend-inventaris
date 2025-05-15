export enum PRODUCT_PRICE_TYPE {
  WHOLESALE = "wholesale",
  RETAIL = "retail",
  FLASH_SALE_WHOLESALE = "flash_sale_wholesale",
  FLASH_SALE_RETAIL = "flash_sale_retail",
}

export const PRODUCT_PRICE_TYPE_LABEL = {
  [PRODUCT_PRICE_TYPE.WHOLESALE]: "Grosir",
  [PRODUCT_PRICE_TYPE.RETAIL]: "Eceran",
  [PRODUCT_PRICE_TYPE.FLASH_SALE_WHOLESALE]: "Flash Sale Grosir",
  [PRODUCT_PRICE_TYPE.FLASH_SALE_RETAIL]: "Flash Sale Eceran",
};
