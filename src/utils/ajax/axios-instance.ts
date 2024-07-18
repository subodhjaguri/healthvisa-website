import Axios from 'axios';

const axiosApi = Axios.create({
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

axiosApi.interceptors.request.use(
	(config) => {
		if (config) {
			const newConfig = {...config};
			const token = 'test';
			if (token && newConfig && newConfig.headers) {
				newConfig.headers.Authorization = `Bearer ${token}`;
			}
			return newConfig;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

export const axiosInstance = axiosApi;
