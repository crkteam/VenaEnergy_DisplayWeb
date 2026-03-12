/**
 * 電力總覽資料
 *
 * @property mainData  - 主要資料
 * @property gridValue - 電網當前功率（kW）
 * @property gridData  - 電網詳細資料
 * @property pv1Value  - PV1 當前功率（kW）
 * @property pv1Data   - PV1 詳細資料
 * @property pv2Value  - PV2 當前功率（kW）
 * @property pv2Data   - PV2 詳細資料
 * @property essValue  - 儲能系統當前功率（kW）
 * @property essData   - 儲能系統詳細資料
 */
export interface PowerData {
  mainData: PowerDetailData;
  gridValue: number;
  gridData: PowerDetailData;
  pv1Value: number;
  pv1Data: PowerDetailData;
  pv2Value: number;
  pv2Data: PowerDetailData;
  essValue: number;
  essData: PowerDetailData;
}

/**
 * 電力詳細資料
 *
 * @property pvToday    - 今日 PV 發電量（kWh）
 * @property storeToday - 今日儲電量（kWh）
 * @property storeTotal - 累計儲電量（kWh）
 * @property pvTotal    - 累計 PV 發電量（kWh）
 */
export interface PowerDetailData {
  pvToday: number;
  storeToday: number;
  storeTotal: number;
  pvTotal: number;
}
