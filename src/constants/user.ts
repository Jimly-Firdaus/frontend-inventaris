export enum USER_ROLE {
  OWNER = "owner",
  WAREHOUSE_MANAGER = "warehouse",
  STORE_MANAGER = "store"
}

export const TABS_AVAILABLE_BY_USER_ROLE = {
  [USER_ROLE.OWNER]: [
    {
      id: 1,
      tabLabel: "Transaksi",
      routeName: "TransactionsPage",
    },
    {
      id: 2,
      tabLabel: "Toko",
      routeName: "ManageStoresPage",
    },
    {
      id: 3,
      tabLabel: "Barang",
      routeName: "ManageProductsPage",
    },
    {
      id: 4,
      tabLabel: "Akun Gudang",
      routeName: "ManageWarehouseAccountPage",
    },
    {
      id: 5,
      tabLabel: "Insight Expense",
      routeName: "ExpenseInsightPage",
    },
  ],
  [USER_ROLE.WAREHOUSE_MANAGER]: [
    {
      id: 1,
      tabLabel: "Barang",
      routeName: "ManageProductsPage",
    },
    {
      id: 2,
      tabLabel: "Pemasukan Barang",
      routeName: "TransactionsPage",
    },
    {
      id: 3,
      tabLabel: "Pengeluaran Barang",
      routeName: "OutboundPage",
    },
  ],
  [USER_ROLE.STORE_MANAGER]: [
    {
      id: 1,
      tabLabel: "Barang",
      routeName: "ManageProductsPage",
    },
    {
      id: 2,
      tabLabel: "Transaksi",
      routeName: "ManageStoresPage",
    },
  ]
}
