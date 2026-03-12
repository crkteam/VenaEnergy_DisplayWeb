/**
 * 天氣資料
 *
 * @property date     - 日期，格式：YYYY.MM.DD
 * @property day      - 星期，格式：(一) ~ (日)
 * @property location - 地點名稱
 * @property temp     - 溫度（°C）
 * @property condition - 天氣狀況代碼
 *   - `01d` 晴天（白天）  `01n` 晴天（夜晚）
 *   - `02d` 少雲（白天）  `02n` 少雲（夜晚）
 *   - `03d` 烏雲（白天）  `03n` 烏雲（夜晚）
 *   - `10d` 下雨（白天）  `10n` 下雨（夜晚）
 *   - `11d` 打雷下雨（白天）  `11n` 打雷下雨（夜晚）
 *   - `50d` 強風（白天）  `50n` 強風（夜晚）
 */

export interface WeatherData {
  date: string;
  day: string;
  location: string;
  temp: number;
  condition: string;
}

export const defaultWeather: WeatherData = {
  date: "2025.01.01",
  day: "(一)",
  location: "桃園場",
  temp: 27,
  condition: "01d",
};
