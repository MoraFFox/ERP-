export interface CreateClientRequest {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country: string;
    website?: string;
    industry?: string;
    companySize?: string;
    notes?: string;
}
export interface UpdateClientRequest extends Partial<CreateClientRequest> {
    status?: "ACTIVE" | "INACTIVE" | "PROSPECT" | "CHURNED";
}
export interface ClientResponse {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    zipCode?: string | null;
    country: string;
    website?: string | null;
    industry?: string;
    companySize?: string;
    status: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: {
        id: string;
        firstName: string;
        lastName: string;
    };
}
export interface ClientListResponse {
    clients: ClientResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
//# sourceMappingURL=client.d.ts.map