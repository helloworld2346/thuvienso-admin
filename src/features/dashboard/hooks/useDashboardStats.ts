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
