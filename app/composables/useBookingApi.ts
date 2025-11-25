// app/composables/useBookingApi.ts

export function useBookingApi() {
  const router = useRouter();
  const nuxtApp = useNuxtApp();

  // Ensure correct typing for app-level $fetch
  const appFetch = nuxtApp.$fetch as typeof $fetch;

  async function guardedFetch<T>(
    request: string,
    options?: any
  ): Promise<T | undefined> {
    // Normalise so tests always receive an Object instead of undefined
    const finalOptions = options ?? {};

    try {
      return await appFetch<T>(request, finalOptions);
    } catch (error: any) {
      const status =
        error?.statusCode ?? error?.status ?? error?.response?.status;

      // Airtable throttling or service outage → redirect only
      if (status === 429 || status === 503) {
        await router.push("/booking-paused");
        return;
      }

      // Everything else → surface as real error
      throw error;
    }
  }

  return { guardedFetch };
}
