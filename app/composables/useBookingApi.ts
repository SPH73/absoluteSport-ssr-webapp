// app/composables/useBookingApi.ts

type GuardedFetchErrorData = {
  status?: number;
  isBookingUnavailable?: boolean;
  originalError?: unknown;
};

export function useBookingApi() {
  async function guardedFetch<T>(
    request: string,
    options?: Parameters<typeof $fetch>[1],
  ): Promise<T> {
    const finalOptions = options ?? {};

    try {
      // Nuxt exposes $fetch globally via ofetch
      // https://nuxt.com/docs/4.x/api/utils
      return await $fetch<T>(request, finalOptions);
    } catch (error: any) {
      const status =
        error?.statusCode ??
        error?.status ??
        error?.response?.statusCode ??
        error?.response?.status;

      // Airtable throttling / outage – redirect to booking-paused page
      if (status === 429 || status === 503) {
        // Only redirect on client-side
        // In SSR context, we'll let the error propagate so callers can handle it
        if (import.meta.client) {
          // Use navigateTo() instead of useRouter() - it can be called from anywhere
          // and doesn't require being in a component setup context
          await navigateTo("/booking-paused?context=booking");
          // Return undefined to indicate redirect happened
          return undefined as T;
        }

        // For SSR, throw the error so callers (like ticker) can catch and handle it
        throw createError<GuardedFetchErrorData>({
          statusCode: status ?? 503,
          statusMessage: "Booking data provider unavailable",
          data: {
            status,
            isBookingUnavailable: true,
            originalError: error,
          },
        });
      }

      // Everything else – surface as a normal Nuxt error
      throw error;
    }
  }

  return { guardedFetch };
}
