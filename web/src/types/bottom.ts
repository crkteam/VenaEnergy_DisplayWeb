import { Color } from "three";

/**
 * 場景底部顏色配置
 *
 * @property floorColor            - 地板顏色
 * @property gridPrimaryColor      - 網格主要顏色
 * @property gridSecondaryColor    - 網格次要顏色
 * @property blockFloorColor       - 區塊地板顏色
 * @property solar1Color           - 太陽能板 1 顏色
 * @property solar2Color           - 太陽能板 2 顏色
 * @property electricColor         - 電網顏色
 * @property container1Color       - 容器 1 顏色
 * @property container2Color       - 容器 2 顏色
 * @property bigTransformerColor   - 大型變壓器顏色
 * @property bigBatteryColor       - 大型電池顏色
 * @property ammeterColor          - 電表顏色
 * @property smallBatteryColor     - 小型電池顏色
 * @property smallTransformerColor - 小型變壓器顏色
 * @property arrowColor            - 箭頭顏色
 */
export interface BottomColorData {
  bgColor: number;
  floorColor: number;
  gridPrimaryColor: number;
  gridSecondaryColor: number;
  blockFloorColor: number;
  solar1Color: number;
  solar2Color: number;
  electricColor: number;
  container1Color: number;
  container2Color: number;
  bigTransformerColor: number;
  bigBatteryColor: number;
  ammeterColor: number;
  smallBatteryColor: number;
  smallTransformerColor: number;
  arrowColor: number;
}
