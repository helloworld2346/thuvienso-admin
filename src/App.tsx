import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import { setupInterceptors } from "@/api/interceptor";
import { Toaster } from "@/components/ui/Toaster";
import { useTheme } from "@/hooks/useTheme";

setupInterceptors();

const queryClient = new QueryClient();

function ThemeSync() {
  useTheme();
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
