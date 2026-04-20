const HYGRAPH_ENDPOINT =
  "https://eu-west-2.cdn.hygraph.com/content/cmnylbgot01mo07us6qai7jya/master";

/**
 * Execute a GraphQL query against the Hygraph CMS.
 * Must be called server-side (uses process.env.HYGRAPH_TOKEN).
 */
export async function hygraphQuery<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const token = process.env.HYGRAPH_TOKEN;
  if (!token) {
    throw new Error("HYGRAPH_TOKEN is not defined in environment variables");
  }

  const res = await fetch(HYGRAPH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
    // No caching by default — let call sites decide
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Hygraph API error: ${res.status} ${res.statusText}`
    );
  }

  const json = (await res.json()) as { data?: T; errors?: unknown[] };

  if (json.errors?.length) {
    throw new Error(
      `GraphQL errors: ${JSON.stringify(json.errors, null, 2)}`
    );
  }

  return json.data as T;
}
