import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ----------------- PRODUCT TYPES -----------------
export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  category?: string;
  expiryDate?: string;
  isDamaged?: boolean;
  isPerishable?: boolean;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  category?: string;
  expiryDate?: string;
  isDamaged?: boolean;
  isPerishable?: boolean;
}

// ----------------- DASHBOARD TYPES -----------------
export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummarId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface DashboardMetrics {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

// ----------------- USER TYPES -----------------
export interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export interface NewUser {
  name: string;
  email: string;
  role: string;
  password?: string;
}

export interface UpdateUserInput {
  userId: string;
  name: string;
  email: string;
  role: string;
  password?: string;
}

export interface DeleteUserInput {
  userId: string;
}

// ----------------- DELIVERY TYPES -----------------
export interface Delivery {
  deliveryId: string;
  userId: string;
  productId: string;
  quantity: number;
  category: string;
  address: string;
  contact: string;
  deadline: string;
  status: "Pending" | "Completed" | "On Hold" | "Returned" | "Damaged";
}

export interface NewDelivery {
  userId: string;
  productId: string;
  quantity: number;
  category: string;
  address: string;
  contact: string;
  deadline: string;
}

export interface UpdateDeliveryInput extends Delivery {}

export interface DeleteDeliveryInput {
  deliveryId: string;
}

// ----------------- REPORT TYPES -----------------
export interface ReportRequest {
  tableName: string;
}

// ----------------- API SETUP -----------------
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
    credentials: "include",
  }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Users", "Expenses", "Deliveries"],

  endpoints: (build) => ({
    // --------- Dashboard ---------
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),

    // --------- Products ---------
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),

    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),

    // --------- Users ---------
    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    createUser: build.mutation<User, NewUser>({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: build.mutation<User, UpdateUserInput>({
      query: (user) => ({
        url: "/users",
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: build.mutation<void, DeleteUserInput>({
      query: ({ userId }) => ({
        url: "/users",
        method: "DELETE",
        body: { userId },
      }),
      invalidatesTags: ["Users"],
    }),

    // --------- Expenses ---------
    getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),

    // --------- Deliveries ---------
    getDeliveries: build.query<Delivery[], void>({
      query: () => "/deliveries",
      providesTags: ["Deliveries"],
    }),

    createDelivery: build.mutation<Delivery, NewDelivery>({
      query: (newDelivery) => ({
        url: "/deliveries",
        method: "POST",
        body: newDelivery,
      }),
      invalidatesTags: ["Deliveries", "Products"],
    }),

    updateDelivery: build.mutation<Delivery, UpdateDeliveryInput>({
      query: (data) => ({
        url: "/deliveries",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Deliveries", "Products"],
    }),

    deleteDelivery: build.mutation<void, DeleteDeliveryInput>({
      query: ({ deliveryId }) => ({
        url: "/deliveries",
        method: "DELETE",
        body: { deliveryId },
      }),
      invalidatesTags: ["Deliveries", "Products"],
    }),

    // --------- Reports (AI PDF) ---------
    generateReport: build.mutation<Blob, ReportRequest>({
      query: ({ tableName }) => ({
        url: "/report",
        method: "POST",
        body: { tableName },
        responseHandler: async (response) => response.blob(),
      }),
    }),

    // --------- Auth ---------
    // login: build.mutation<
    //   { success: boolean; user: User; message: string },
    //   { email: string; password: string }
    // >({
    //   query: (credentials) => ({
    //     url: "/auth/login",
    //     method: "POST",
    //     body: credentials,
    //   }),
    // }),


  }),
});

// ----------------- HOOK EXPORTS -----------------
export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetExpensesByCategoryQuery,
  useGetDeliveriesQuery,
  useCreateDeliveryMutation,
  useUpdateDeliveryMutation,
  useDeleteDeliveryMutation,
  useGenerateReportMutation,
  // useLoginMutation,
} = api;
