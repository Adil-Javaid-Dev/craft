// lib/api-client.ts
export interface ClientData {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  email: string;
  dateOfBirth: string;
  mailingAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneMobile: string;
  phoneAlternate: string;
  phoneWork: string;
  fax: string;
  ssn: string;
  experianReportNumber: string;
  transUnionFileNumber: string;
}

export interface Client extends ClientData {
  _id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Base API fetch function
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    let errorMessage = "Request failed";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

// Client API functions
export const clientApi = {
  // Create a new client
  createClient: async (
    clientData: ClientData
  ): Promise<ApiResponse<Client>> => {
    return apiFetch<ApiResponse<Client>>("/clients", {
      method: "POST",
      body: JSON.stringify(clientData),
    });
  },

  // Get all clients
  getClients: async (filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<
    ApiResponse<{
      clients: Client[];
      total: number;
      totalPages: number;
      currentPage: number;
    }>
  > => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/clients?${queryString}` : "/clients";

    return apiFetch<ApiResponse<never>>(url);
  },

  // Get client by ID
  getClient: async (id: string): Promise<ApiResponse<Client>> => {
    return apiFetch<ApiResponse<Client>>(`/clients/${id}`);
  },

  // Update client
  updateClient: async (
    id: string,
    clientData: Partial<ClientData>
  ): Promise<ApiResponse<Client>> => {
    return apiFetch<ApiResponse<Client>>(`/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(clientData),
    });
  },

  // Update client status
  updateClientStatus: async (
    id: string,
    status: "active" | "inactive"
  ): Promise<ApiResponse<Client>> => {
    return apiFetch<ApiResponse<Client>>(`/clients/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // Delete client
  deleteClient: async (id: string): Promise<ApiResponse<void>> => {
    return apiFetch<ApiResponse<void>>(`/clients/${id}`, {
      method: "DELETE",
    });
  },

  // Upload document
  uploadDocument: async (
    clientId: string,
    documentType: string,
    file: File
  ): Promise<ApiResponse<{ document: never }>> => {
    const formData = new FormData();
    formData.append("file", file);

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const res = await fetch(
      `${baseUrl}/clients/${clientId}/documents/${documentType}`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    if (!res.ok) {
      let errorMessage = "Upload failed";
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = res.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return res.json();
  },

  // Download document
  downloadDocument: async (
    clientId: string,
    documentType: string
  ): Promise<Blob> => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const res = await fetch(
      `${baseUrl}/clients/${clientId}/documents/${documentType}`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) {
      let errorMessage = "Download failed";
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = res.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return res.blob();
  },
};
