import { useRouter } from "#app";

type FetchOptions<T> = Parameters<typeof $fetch<T>>[1];

export function useBookingApi() {
  const router = useRouter();

  async function guardedFetch<T>(
    request: Parameters<typeof $fetch<T>>[0],
    options?: FetchOptions<T>
  ): Promise<T> {
    try {
      return await $fetch<T>(request, options);
    } catch (error: any) {
      const status =
        error?.status ??
        error?.response?.status ??
        error?.data?.statusCode ??
        error?.data?.status;

      // Treat Airtable quota / downtime as a booking-freeze scenario
      if (status === 429 || status === 503) {
        // Redirect to the booking-paused route and return a safe placeholder
        await router.push("/booking-paused");
        return {} as T;
      }

      // All other errors bubble up to the calling component
      throw error;
    }
  }

  return {
    guardedFetch,
  };
}
