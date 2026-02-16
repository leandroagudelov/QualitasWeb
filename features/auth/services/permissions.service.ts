import { api } from "@/services/axios";

const PERMISSIONS_RETRY_DELAY_MS = 2000;
const PERMISSIONS_MAX_RETRIES = 2;

/**
 * Fetches the current authenticated user's permissions from the backend.
 * On 429 (rate limit) retries up to PERMISSIONS_MAX_RETRIES times with delay.
 * @param accessToken - Optional. Si se pasa (p. ej. tras el login), se usa este token en la petición para evitar 401 por timing con el store.
 * @returns Array of permission strings (e.g., "Permissions.QualitasCompliance.MarcosNormativos.View")
 */
export const permissionsService = {
  getUserPermissions: async (accessToken?: string): Promise<string[]> => {
    for (let attempt = 0; attempt <= PERMISSIONS_MAX_RETRIES; attempt++) {
      try {
        const { data } = await api.get<string[]>("/api/v1/identity/permissions", {
          ...(accessToken && {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        });
        return data || [];
      } catch (error: unknown) {
        const status = (error as { response?: { status?: number } })?.response?.status;
        const is429 = status === 429;
        if (is429 && attempt < PERMISSIONS_MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, PERMISSIONS_RETRY_DELAY_MS));
          continue;
        }
        if (is429) {
          console.warn("[PERMISSIONS] Rate limit (429) al cargar permisos. El login continúa; los permisos se pueden recargar más tarde.");
        } else {
          console.warn("[PERMISSIONS] No se pudieron cargar permisos:", status, (error as Error)?.message);
        }
        return [];
      }
    }
    return [];
  },
};
