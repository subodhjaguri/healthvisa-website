import 'tailwindcss/tailwind.css';
import 'inter-ui/inter.css';
import 'antd/dist/antd.css';
import 'react-quill/dist/quill.snow.css';
import '../styles/globals.css';
import type {AppProps} from 'next/app';
import React from 'react';
import {Hydrate, QueryClient, QueryClientProvider} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools';
import {setupAdminAuthInterceptor} from '../src/utils/ajax/setup-auth';

const Tls = ({Component, pageProps}: AppProps) => {
	const [queryClient] = React.useState(() => new QueryClient());

	// Bounce expired/invalid admin sessions (401) back to the login screen.
	React.useEffect(() => {
		setupAdminAuthInterceptor();
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			{/**
			 * Hydration helps in prefetching data on next.js server
			 * React query prefetches the data on next server and dehydrates it.
			 * that dehyrated query can be hydrated later on client side
			 */}
			<Hydrate state={pageProps.dehydratedState}>
				{/**
				 * CssBaseline is used to apply the default styles of the UI
				 */}
				<>
					{/* eslint-disable-next-line react/jsx-props-no-spreading */}
					<Component {...pageProps} />
				</>
			</Hydrate>
			{/**
			 * React Query Devtools is used to debug the queries and mutations
			 */}
			<ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
		</QueryClientProvider>
	);
};

export default Tls;
