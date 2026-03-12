/**
 * 圖表資料
 *
 * @property monthPvData    - 當月每日 PV 發電量（kWh），長度 = 當月天數
 * @property monthNewPvData - 當月每日新增 PV 發電量（kWh），長度 = 當月天數
 * @property monthStoreData - 當月每日儲能放電量（kWh），長度 = 當月天數
 * @property yearPvData     - 當年每月 PV 發電量（kWh），長度最多 12
 * @property yearNewPvData  - 當年每月新增 PV 發電量（kWh），長度最多 12
 * @property yearStoreData  - 當年每月儲能放電量（kWh），長度最多 12
 *
 * @remarks
 * - 月資料：`monthPvData`、`monthNewPvData`、`monthStoreData` 長度必須相同
 * - 年資料：`yearPvData`、`yearNewPvData`、`yearStoreData` 長度必須相同，且 <= 12
 */
export interface ChartData {
  monthPvData: number[];
  monthNewPvData: number[];
  monthStoreData: number[];
  yearPvData: number[];
  yearNewPvData: number[];
  yearStoreData: number[];
}
