import type { AxiosError, AxiosRequestConfig } from "axios";
import { http } from "@/api/axios";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export function setupInterceptors() {
  http.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  let isRefreshing = false;
  let queue: {
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
  }[] = [];

  const processQueue = (error: unknown, token: string | null) => {
    queue.forEach((p) => {
      if (token) p.resolve(token);
      else p.reject(error);
    });
    queue = [];
  };

  http.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as RetryConfig | undefined;
      const status = error.response?.status;

      if (status !== 401 || !original || original._retry) {
        return Promise.reject(error);
      }

      const currentToken = useAuthStore.getState().token;
      if (!currentToken) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: (token: string) => {
              if (original.headers) {
                original.headers.Authorization = `Bearer ${token}`;
              }
              resolve(http(original));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        const result = await authApi.refresh(currentToken);
        useAuthStore.getState().setToken(result.token);
        processQueue(null, result.token);
        if (original.headers) {
          original.headers.Authorization = `Bearer ${result.token}`;
        }
        return http(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
}
