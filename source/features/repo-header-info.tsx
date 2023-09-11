import * as pageDetect from 'github-url-detection';
import { RepoForkedIcon, StarIcon } from '@primer/octicons-react';
import React from 'dom-chef';
import { CachedFunction } from 'webext-storage-cache';

import observe from '../helpers/selector-observer.js';
import features from '../feature-manager.js';
import api from '../github-helpers/api.js';
import GetRepositoryInfo from './repo-header-info.gql';
import { cacheByRepo } from '../github-helpers/index.js';
import abbreviateNumber from '../helpers/abbreviate-number.js';

type RepositoryInfo = {
	isFork: boolean;
	stargazerCount: number;
};

const repositoryInfo = new CachedFunction('stargazer-count', {
	async updater(): Promise<RepositoryInfo> {
		const {repository: {isFork, stargazerCount}} = await api.v4(GetRepositoryInfo);

		return {isFork, stargazerCount}
	},
	maxAge: {days: 1},
	staleWhileRevalidate: {days: 3},
	cacheKey: cacheByRepo,
});

async function add(repoLink: HTMLAnchorElement): Promise<void> {
	const {isFork, stargazerCount} = await repositoryInfo.get();
	
	if (isFork) {
		repoLink.append(
			<RepoForkedIcon className="v-align-text-bottom ml-1" width={12} height={12}/>
		)
	}
	
	repoLink.after(
		<div className="d-flex flex-items-center flex-justify-center mr-1 gap-1">
			<StarIcon className="v-align-text-bottom" width={12} height={12}/>
			<span className="f6">{abbreviateNumber(stargazerCount)}</span>
		</div>
	)
}

function init(signal: AbortSignal): void {
	observe('header .AppHeader-context-full li:last-child a', add, {signal});
}

void features.add(import.meta.url, {
	include: [
		pageDetect.hasRepoHeader,
	],
	init,
});

/*
Test URLs

Repository:
https://github.com/refined-github/refined-github

*/
