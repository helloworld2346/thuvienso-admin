import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { News, NewsPage, NewsPayload } from "@/features/news/news.types";

export const newsApi = {
  adminList: async (
    page: number,
    size: number,
    keyword?: string,
    status?: string,
  ): Promise<NewsPage> => {
    const { data } = await http.get<ApiResponse<NewsPage>>(
      ENDPOINTS.NEWS.ADMIN_LIST,
      {
        params: {
          page,
          size,
          keyword: keyword || undefined,
          status: status || undefined,
        },
      },
    );
    return data.Result;
  },

  getById: async (id: string): Promise<News> => {
    const { data } = await http.get<ApiResponse<News>>(
      ENDPOINTS.NEWS.BY_ID(id),
    );
    return data.Result;
  },

  create: async (payload: NewsPayload): Promise<News> => {
    const { data } = await http.post<ApiResponse<News>>(
      ENDPOINTS.NEWS.BASE,
      payload,
    );
    return data.Result;
  },

  update: async (id: string, payload: NewsPayload): Promise<News> => {
    const { data } = await http.put<ApiResponse<News>>(
      ENDPOINTS.NEWS.BY_ID(id),
      payload,
    );
    return data.Result;
  },

  remove: async (id: string): Promise<void> => {
    await http.delete(ENDPOINTS.NEWS.BY_ID(id));
  },
  uploadImage: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);

    const { data } = await http.post<ApiResponse<{ url: string }>>(
      ENDPOINTS.NEWS.UPLOAD_IMAGE,
      form,
      { headers: { "Content-Type": undefined } },
    );
    return data.Result.url;
  },
};
