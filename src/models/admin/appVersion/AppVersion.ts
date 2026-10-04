import {ajaxGet, ajaxPatch, getApiUrl, Services} from '@healthvisa/utils';

const Service: Services = 'authentication';
const APP_VERSION_URL = '/app-version';

/** Which Android app builds may use the API (REVIEW_FIX_PLAN.md Part 4). */
export interface IAppVersion {
	/** Builds below this must update (blocking). */
	minBuild: number;
	/** Builds below this are offered an update (dismissible). */
	latestBuild: number;
	/** Shown when an update is required. */
	message: string;
}

export function getAppVersion(): Promise<IAppVersion> {
	return ajaxGet<IAppVersion>({url: getApiUrl(Service, APP_VERSION_URL)});
}

export function updateAppVersion(data: Partial<IAppVersion>): Promise<IAppVersion> {
	return ajaxPatch<Partial<IAppVersion>, IAppVersion>({
		data,
		url: getApiUrl(Service, APP_VERSION_URL),
	});
}
