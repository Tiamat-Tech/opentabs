import {
  ToolError,
  fetchJSON,
  getCookie,
  getAuthCache,
  setAuthCache,
  clearAuthCache,
  getLocalStorage,
  waitUntil,
  buildQueryString,
} from '@opentabs-dev/plugin-sdk';
import type { FetchFromPageOptions } from '@opentabs-dev/plugin-sdk';

const GRAPH_BASE = 'https://www.priceline.com/pws/v0/pcln-graph/?gqlOp=';
const REST_BASE = 'https://www.priceline.com/pws/v0';

// --- Auth ---

interface PricelineAuth {
  accessToken: string;
  authToken: string;
  email: string;
  cguid: string;
}

const decodeJwtPayload = (jwt: string): Record<string, unknown> | null => {
  try {
    const parts = jwt.split('.');
    const encoded = parts[1];
    if (parts.length !== 3 || !encoded) return null;
    const payload = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const getAuth = (): PricelineAuth | null => {
  const cached = getAuthCache<PricelineAuth>('priceline');
  if (cached) return cached;

  const oktaRaw = getLocalStorage('okta-token-storage');
  if (!oktaRaw) return null;

  let okta: Record<string, unknown>;
  try {
    okta = JSON.parse(oktaRaw) as Record<string, unknown>;
  } catch {
    return null;
  }

  const accessTokenObj = okta.accessToken as { accessToken?: string } | undefined;
  const accessToken = accessTokenObj?.accessToken;
  if (!accessToken) return null;

  const claims = decodeJwtPayload(accessToken);
  if (!claims) return null;

  const authToken = claims['com.priceline.token.dmc.value'] as string | undefined;
  const email = claims.sub as string | undefined;
  if (!authToken || !email) return null;

  const cguid = getCookie('PL_CINFO')?.split('~')[0] ?? '';

  const auth: PricelineAuth = { accessToken, authToken, email, cguid };
  setAuthCache('priceline', auth);
  return auth;
};

export const isAuthenticated = (): boolean => getAuth() !== null;

export const waitForAuth = async (): Promise<boolean> => {
  try {
    await waitUntil(() => isAuthenticated(), {
      interval: 500,
      timeout: 5000,
    });
    return true;
  } catch {
    return false;
  }
};

const requireAuth = (): PricelineAuth => {
  const auth = getAuth();
  if (!auth) throw ToolError.auth('Not authenticated — please log in to Priceline.');
  return auth;
};

export const getEmail = (): string => requireAuth().email;
export const getCguid = (): string => requireAuth().cguid;
export const getAuthToken = (): string => requireAuth().authToken;

// --- GraphQL API ---

interface GraphQLError {
  message?: string;
  extensions?: { code?: string };
}

interface GraphQLResponse {
  data?: Record<string, unknown>;
  errors?: GraphQLError[];
}

export const graphql = async <T>(
  operationName: string,
  variables: Record<string, unknown>,
  persistedHash?: string,
): Promise<T> => {
  const auth = requireAuth();

  const url = `${GRAPH_BASE}${operationName}`;

  const reqBody: Record<string, unknown> = {
    operationName,
    variables,
  };

  if (persistedHash) {
    reqBody.extensions = {
      persistedQuery: { version: 1, sha256Hash: persistedHash },
    };
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${auth.accessToken}`,
    authToken: auth.authToken,
    'apollographql-client-name': 'relax',
    'apollographql-client-version': 'master-1.1.1403-v3',
  };

  const init: FetchFromPageOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(reqBody),
  };

  const resp = (await fetchJSON<GraphQLResponse>(url, init)) ?? ({} as GraphQLResponse);

  const errors = resp.errors ?? [];
  const data = resp.data;

  if (errors.length > 0 && !data) {
    const firstError = errors[0] ?? {};
    const code = firstError.extensions?.code ?? '';
    const message = firstError.message ?? 'Unknown GraphQL error';

    if (code === 'PERSISTED_QUERY_NOT_FOUND' || message.includes('persisted_query_not_found')) {
      throw ToolError.internal(
        `Persisted query hash expired for ${operationName} — Priceline may have deployed a new client version.`,
      );
    }
    if (code === 'UNAUTHENTICATED' || message.includes('not authorized')) {
      clearAuthCache('priceline');
      throw ToolError.auth(`Auth error: ${message}`);
    }
    throw ToolError.internal(`GraphQL error (${operationName}): ${message}`);
  }

  return (data ?? resp) as T;
};

// --- REST API ---

export const rest = async <T>(
  endpoint: string,
  query?: Record<string, string | number | boolean | undefined>,
): Promise<T> => {
  const qs = query ? buildQueryString(query) : '';
  const url = qs ? `${REST_BASE}${endpoint}?${qs}` : `${REST_BASE}${endpoint}`;

  const data = await fetchJSON<T>(url);
  if (data === undefined) throw ToolError.internal(`Empty response from ${endpoint}`);
  return data;
};
