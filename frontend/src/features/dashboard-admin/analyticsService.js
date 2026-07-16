import axiosClient from "../../api/axiosClient";

export const getSalesTrend = () =>
  axiosClient.get("/analytics/sales-trend").then((r) => r.data);

export const getTopProducts = () =>
  axiosClient.get("/analytics/top-products").then((r) => r.data);

export const getLowStock = () =>
  axiosClient.get("/analytics/low-stock").then((r) => r.data);
