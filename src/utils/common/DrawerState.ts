export const getCurrentRoute = (router: any) => {
	let currentRoute = 'property';
	if (
		router.pathname.includes('/products') ||
		router.pathname.includes('/categories')
	) {
		currentRoute = 'products';
	} else if (
		router.pathname.includes('/properties') ||
		router.pathname.includes('/property-parts') ||
		router.pathname.includes('property-types')
	) {
		currentRoute = 'property';
	} else if (router.pathname.includes('/users')) {
		currentRoute = 'peoples';
	}

	return currentRoute;
};

export const getActiveRoute = (router: any) => {
	let activeRoute = '/admin/dashboard';
	if (router.pathname.includes('/area')) {
		activeRoute = '/admin/area';
	} else if (router.pathname.includes('/categories')) {
		activeRoute = '/admin/categories';
	} else if (router.pathname.includes('/products')) {
		activeRoute = '/admin/products';
	} else if (router.pathname.includes('/properties')) {
		activeRoute = '/admin/properties';
	} else if (router.pathname.includes('/property-parts')) {
		activeRoute = '/admin/property-parts';
	} else if (router.pathname.includes('/property-types')) {
		activeRoute = '/admin/property-types';
	} else if (router.pathname.includes('/new-members')) {
		activeRoute = '/admin/new-members';
	} else if (router.pathname.includes('/users')) {
		activeRoute = '/admin/users';
	} else if (router.pathname.includes('/orders')) {
		activeRoute = '/admin/orders';
	} else activeRoute = '/admin/dashboard';

	return activeRoute;
};
