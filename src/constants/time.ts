export enum INSIGHT_INTERVAL {
  ONE_DAY = "1d",
  ONE_WEEK = "1w",
  ONE_MONTH = "1m",
  THREE_MONTH = "3m",
  SIX_MONTH = "6m",
  ONE_YEAR = "1y",
}

export const INSIGHT_INTERVAL_LABEL = {
  [INSIGHT_INTERVAL.ONE_DAY]: "1 Hari",
  [INSIGHT_INTERVAL.ONE_WEEK]: "1 Minggu",
  [INSIGHT_INTERVAL.ONE_MONTH]: "1 Bulan",
  [INSIGHT_INTERVAL.THREE_MONTH]: "3 Bulan",
  [INSIGHT_INTERVAL.SIX_MONTH]: "6 Bulan",
  [INSIGHT_INTERVAL.ONE_YEAR]: "1 Tahun",
};

export const MONTHS = [
  { label: "Januari", value: 1 },
  { label: "Februari", value: 2 },
  { label: "Maret", value: 3 },
  { label: "April", value: 4 },
  { label: "Mei", value: 5 },
  { label: "Juni", value: 6 },
  { label: "Juli", value: 7 },
  { label: "Agustus", value: 8 },
  { label: "September", value: 9 },
  { label: "Oktober", value: 10 },
  { label: "November", value: 11 },
  { label: "Desember", value: 12 },
];

export const getCurrentYear= () => {
  return new Date().getFullYear();
}

export const getYearOptions = (start = 2024) => {
  const currentYear = getCurrentYear();
  return Array.from({ length: currentYear - start + 1 }, (_, i) => start + i);
}
