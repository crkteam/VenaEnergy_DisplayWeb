import { createApp } from "vue";
import App from "./App.vue";

import "@fontsource/noto-sans-tc/400.css"; // Regular
import "@fontsource/noto-sans-tc/500.css"; // Medium
import "@fontsource/noto-sans-tc/700.css"; // Bold

import "./style/tailwind.css";

import ECharts from "vue-echarts";
import { use } from "echarts/core";

// 按需引入 ECharts 組件
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from "echarts/components";

// 註冊必要的組件
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
]);

const app = createApp(App);
app.component("v-chart", ECharts);
app.mount("#ve-app");
