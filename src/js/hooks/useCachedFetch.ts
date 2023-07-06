import { useEffect, useState } from 'preact/hooks';

const useCachedFetch = (url, storageKey, dataProcessor = (data) => data) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cachedData = localStorage.getItem(storageKey);

    const fetchData = () => {
      setLoading(true);
      fetch(url)
        .then((res) => res.json())
        .then((fetchedData) => {
          const processedData = dataProcessor(fetchedData);
          setData(processedData);
          localStorage.setItem(
            storageKey,
            JSON.stringify({ data: processedData, timestamp: new Date().getTime() }),
          );
        })
        .catch(() => {
          if (cachedData) {
            const { data } = JSON.parse(cachedData);
            setData(data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (!loading) {
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const age = (new Date().getTime() - timestamp) / 1000 / 60;

        if (age < 15) {
          setData(data);
        } else {
          fetchData();
        }
      } else {
        fetchData();
      }
    }
  }, [url, storageKey, dataProcessor, loading]);

  return data;
};

export default useCachedFetch;
