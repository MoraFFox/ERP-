import type { CreateClientRequest, UpdateClientRequest, ClientResponse, ClientListResponse } from "../types/client";
export declare class ClientService {
    static createClient(data: CreateClientRequest, createdById: string): Promise<ClientResponse>;
    static getClientById(id: string): Promise<ClientResponse>;
    static getClients(query: any): Promise<ClientListResponse>;
    static updateClient(id: string, data: UpdateClientRequest): Promise<ClientResponse>;
    static deleteClient(id: string): Promise<void>;
}
//# sourceMappingURL=clientService.d.ts.map
