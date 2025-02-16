import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const router = createRouter({ routeTree });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      experimental_prefetchInRender: true,
    },
  },
});

export default function App() {
  const [isRouterReady, setIsRouterReady] = useState(false);

  useEffect(() => {
    router.load().then(() => setIsRouterReady(true));
  }, []);

  if (!isRouterReady) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
