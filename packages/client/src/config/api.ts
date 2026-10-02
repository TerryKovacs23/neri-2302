const LOCAL_API_URL = 'http://localhost:3000';

export function resolveApiUrl(
  configuredUrl: string | undefined = import.meta.env.VITE_API_URL,
  clientOrigin: string | undefined =
    typeof window === 'undefined' ? undefined : window.location.origin,
): string {
  const normalizedConfiguredUrl = configuredUrl?.trim().replace(/\/+$/, '');
  if (normalizedConfiguredUrl) {
    return normalizedConfiguredUrl;
  }

  if (!clientOrigin) {
    return LOCAL_API_URL;
  }

  const origin = new URL(clientOrigin);
  const apiHostname = origin.hostname.replace(
    /-\d+\.app\.github\.dev$/i,
    '-3000.app.github.dev',
  );

  return apiHostname === origin.hostname
    ? LOCAL_API_URL
    : `${origin.protocol}//${apiHostname}`;
}
