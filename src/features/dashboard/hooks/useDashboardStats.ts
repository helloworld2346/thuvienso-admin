import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/features/dashboard/api/dashboard.api";

export function useOverviewStats() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: dashboardApi.overview,
  });
}

export function useDocumentByType() {
  return useQuery({
    queryKey: ["dashboard", "document-by-type"],
    queryFn: dashboardApi.documentByType,
  });
}

export function useTopViewed() {
  return useQuery({
    queryKey: ["dashboard", "top-viewed"],
    queryFn: dashboardApi.topViewed,
  });
}

export function useMonthlyTrend() {
  return useQuery({
    queryKey: ["dashboard", "monthly-trend"],
    queryFn: dashboardApi.monthlyTrend,
  });
}

export function useDocumentByStatus() {
  return useQuery({
    queryKey: ["dashboard", "document-by-status"],
    queryFn: dashboardApi.documentByStatus,
  });
}

export function useTopCategories() {
  return useQuery({
    queryKey: ["dashboard", "top-categories"],
    queryFn: dashboardApi.topCategories,
  });
}

export function useUsersByRole() {
  return useQuery({
    queryKey: ["dashboard", "users-by-role"],
    queryFn: dashboardApi.usersByRole,
  });
}

export function useWeeklyActivity() {
  return useQuery({
    queryKey: ["dashboard", "weekly-activity"],
    queryFn: dashboardApi.weeklyActivity,
  });
}
