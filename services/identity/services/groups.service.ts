import { api } from "@/services/axios";

export interface GroupDto {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  isSystemGroup: boolean;
  memberCount: number;
  roleIds: string[] | null;
  roleNames: string[] | null;
  createdAt: string;
}

export interface CreateGroupCommand {
  name: string;
  description?: string | null;
  isDefault: boolean;
  roleIds: string[] | null;
}

export interface UpdateGroupCommand extends CreateGroupCommand {}

export type AuthHeaders = { accessToken: string; tenant?: string };

function authHeaders(auth?: AuthHeaders): Record<string, string> | undefined {
  if (!auth?.accessToken) return undefined;
  const h: Record<string, string> = { Authorization: `Bearer ${auth.accessToken}` };
  if (auth.tenant) h.tenant = auth.tenant;
  return h;
}

export const groupsService = {
  getGroups: async (search?: string, auth?: AuthHeaders): Promise<GroupDto[]> => {
    const { data } = await api.get<GroupDto[]>("/api/v1/identity/groups", {
      params: search ? { search } : undefined,
      ...(authHeaders(auth) && { headers: authHeaders(auth) }),
    });
    return data || [];
  },

  getGroupById: async (id: string, auth?: AuthHeaders): Promise<GroupDto> => {
    const { data } = await api.get<GroupDto>(`/api/v1/identity/groups/${id}`, {
      ...(authHeaders(auth) && { headers: authHeaders(auth) }),
    });
    return data!;
  },

  createGroup: async (payload: CreateGroupCommand, auth?: AuthHeaders): Promise<GroupDto> => {
    const { data } = await api.post<GroupDto>("/api/v1/identity/groups", payload, {
      ...(authHeaders(auth) && { headers: authHeaders(auth) }),
    });
    return data!;
  },

  updateGroup: async (
    id: string,
    payload: UpdateGroupCommand,
    auth?: AuthHeaders
  ): Promise<GroupDto> => {
    const { data } = await api.put<GroupDto>(`/api/v1/identity/groups/${id}`, payload, {
      ...(authHeaders(auth) && { headers: authHeaders(auth) }),
    });
    return data!;
  },

  deleteGroup: async (id: string, auth?: AuthHeaders): Promise<void> => {
    await api.delete(`/api/v1/identity/groups/${id}`, {
      ...(authHeaders(auth) && { headers: authHeaders(auth) }),
    });
  },
};
