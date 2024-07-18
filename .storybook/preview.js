import * as NextImage from 'next/image';
import 'tailwindcss/tailwind.css';
import '../styles/globals.css';
import 'inter-ui/inter.css';
import {CssBaseline, GeistProvider} from '@geist-ui/core';

//Storybook doesnt support Nextjs images, with all the optimizations that next wraps around it,
//so as a workaround we create a separate wrapper over them and make them unoptimised just for
//previewing them in storybook,and successfully executing storybook builds.
const OriginalNextImage = NextImage.default;
Object.defineProperty(NextImage, 'default', {
	configurable: true,
	value: (props) => <OriginalNextImage {...props} unoptimized />,
});

// This is Geist UI Provider for storybook
export const decorators = [
	(Story) => (
		<GeistProvider>
			<CssBaseline />
			<Story />
		</GeistProvider>
	),
];

export const parameters = {
	actions: {argTypesRegex: '^on[A-Z].*'},
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};
