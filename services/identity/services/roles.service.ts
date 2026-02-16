import { api } from "@/services/axios";

export interface RoleDto {
  id: string;
  name: string;
  description: string | null;
  permissions: string[] | null;
}

export interface UpsertRoleCommand {
  id?: string;
  name: string;
  description?: string | null;
}

export type AuthHeaders = { accessToken: string; tenant?: string };

function authHeaders(auth?: AuthHeaders): Record<string, string> | undefined {
  if (!auth?.accessToken) return undefined;
  const h: Record<string, string> = { Authorization: `Bearer ${auth.accessToken}` };
  if (auth.tenant) h.tenant = auth.tenant;
  return h;
}

export const rolesService = {
  getRoles: async (auth?: AuthHeaders): Promise<RoleDto[]> => {
    const { data } = await api.get<RoleDto[]>("/api/v1/identity/roles", {
      ...(authHeaders(auth) && { headers: authHeaders(auth) }),
    });
    return data || [];
  },

  getRoleById: async (id: string, auth?: AuthHeaders): Promise<RoleDto> => {
    const { data } = await api.get<RoleDto>(`/api/v1/identity/roles/${id}`, {
      ...(authHeaders(auth) && { headers: authHeaders(auth) }),
    });
    return data!;
  },

  getRolePermissions: async (id: string, auth?: AuthHeaders): Promise<RoleDto> => {
    const { data } = await api.get<RoleDto>(`/api/v1/identity/${id}/permissions`, {
      ...(authHeaders(auth) && { headers: authHeaders(auth) }),
    });
    return data!;
  },

  createOrUpdateRole: async (payload: UpsertRoleCommand, auth?: AuthHeaders): Promise<RoleDto> => {
    const { data } = await api.post<RoleDto>("/api/v1/identity/roles", payload, {
      ...(authHeaders(auth) && { headers: authHeaders(auth) }),
    });
    return data!;
  },

  updateRolePermissions: async (
    id: string,
    payload: { roleId?: string; permissions: string[] },
    auth?: AuthHeaders
  ): Promise<void> => {
    await api.put(`/api/v1/identity/${id}/permissions`, payload, {
      ...(authHeaders(auth) && { headers: authHeaders(auth) }),
    });
  },

  deleteRole: async (id: string, auth?: AuthHeaders): Promise<void> => {
    await api.delete(`/api/v1/identity/roles/${id}`, {
      ...(authHeaders(auth) && { headers: authHeaders(auth) }),
    });
  },
};
