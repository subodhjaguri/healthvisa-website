export const getCurrentRoute = (router: any) => {
	let currentRoute = 'property';
	if (
		router.pathname.includes('/products') ||
		router.pathname.includes('/categories') ||
		router.pathname.includes('/diagnostics') ||
		router.pathname.includes('/labs') ||
		router.pathname.includes('/tests') ||
		router.pathname.includes('/symptoms')
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
	} else if (router.pathname.includes('/diagnostics')) {
		activeRoute = '/admin/diagnostics';
	} else if (router.pathname.includes('/lab-appointments')) {
		activeRoute = '/admin/lab-appointments';
	} else if (router.pathname.includes('/labs')) {
		activeRoute = '/admin/labs';
	} else if (router.pathname.includes('/tests')) {
		activeRoute = '/admin/tests';
	} else if (router.pathname.includes('/symptoms')) {
		activeRoute = '/admin/symptoms';
	} else if (router.pathname.includes('/products')) {
		activeRoute = '/admin/products';
	} else if (router.pathname.includes('/properties')) {
		activeRoute = '/admin/properties';
	} else if (router.pathname.includes('/property-parts')) {
		activeRoute = '/admin/property-parts';
	} else if (router.pathname.includes('/property-types')) {
		activeRoute = '/admin/property-types';
	} else if (router.pathname.includes('/news')) {
		activeRoute = '/admin/news';
	} else if (router.pathname.includes('/new-members')) {
		activeRoute = '/admin/new-members';
	} else if (router.pathname.includes('/users')) {
		activeRoute = '/admin/users';
	} else if (router.pathname.includes('/orders')) {
		activeRoute = '/admin/orders';
	} else if (router.pathname.includes('/referral-codes')) {
		activeRoute = '/admin/referral-codes';
	} else if (router.pathname.includes('/documents')) {
		activeRoute = '/admin/documents';
	} else activeRoute = '/admin/dashboard';

	return activeRoute;
};
