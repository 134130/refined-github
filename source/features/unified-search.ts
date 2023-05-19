import * as pageDetect from 'github-url-detection';

import features from '../feature-manager.js';
import observe from '../helpers/selector-observer.js';

function addListener(inputElement: HTMLInputElement): void {
	const searchForm = inputElement.parentElement;
	if (!(searchForm instanceof HTMLFormElement)) {
		throw new TypeError('Failed to find Form element');
	}

	inputElement.addEventListener('change', () => {
		searchForm.action = /is:[a-zA-Z]+/.test(inputElement.value)
			? searchForm.action.replace(/\/issues$/, '/pulls')
			: searchForm.action.replace(/\/pulls$/, '/issues');
	});
}

function init(signal: AbortSignal): void {
	observe('input#js-issues-search', addListener, {signal});
}

void features.add(import.meta.url, {
	include: [
		pageDetect.isPRList,
	],
	init,
});
