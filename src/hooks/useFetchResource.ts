import { useState, useEffect } from "react";
import { service as axios } from "../api/axiosInstance";

export function useFetchData<T>(url: string, dep?: any) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!url.length) return;
    setData([]);
    (async (): Promise<void> => {
      setLoading(true);
      try {
        const response: any = await axios.get(url);
        setData(response.data);
      } catch (fetchError) {
        setError(fetchError);
      } finally {
        setLoading(false);
      }
    })();
  }, [dep, url]);

  return { loading, data, error };
}
