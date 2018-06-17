import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendClientService } from './backend-client.service';

import { BrowserCacheDatabase } from '../browser-cache/browser-cache.database';

@Injectable({
  providedIn: 'root'
})
export class AlveoClientService {
  private apiKey: string = null;
  private database: BrowserCacheDatabase;

  constructor(private apiClient: BackendClientService) {
    this.database = new BrowserCacheDatabase("AlveoClientCache");
  }

  public async retrieve(storageKey: string, request: Promise<any>= null, useCache: boolean= true) {
    if (!useCache && request == null) {
      throw new Error('Both cache and no API request provided, this is undefined behaviour');
    }

    if (useCache) {
      try {
        let data = await this.database.get(storageKey);
        if (data != null) {
          console.log('Using cache for (AlveoClient): ' + storageKey);

          return data;
        }
      } catch (error) {} // Ignore because we might have other options
    }

    if (request != null) {
      let response = await request;

      if (useCache) {
        console.log('Caching (AlveoClient) ' + storageKey);
        let a = await this.database.put(storageKey, response);
      }

      return response;
    }

    throw new Error('No data');
  }

  public getListDirectory(useCache: boolean= true, useApi: boolean= true) {
    return this.retrieve(
      'lists', 
      (useApi)? this.apiClient.getListIndex().toPromise(): null, 
      useCache
    );
  }

  public getList(list_id: string, useCache: boolean= true, useApi: boolean= true) {
    return this.retrieve(
      'list:' + list_id,
      (useApi)? this.apiClient.getList(list_id).toPromise(): null,
      useCache
    );
  }

  public getItem(item_id: string, useCache: boolean= true, useApi: boolean= true) {
    return this.retrieve(
      'item:' + item_id,
      (useApi)? this.apiClient.getItem(item_id).toPromise(): null,
      useCache
    );
  }

  public getDocument(item_id: string, document_id: string, useCache: boolean= true, useApi: boolean= true): Promise<any> {
    return this.retrieve(
      'document:' + item_id + ':' + document_id,
      (useApi)? this.apiClient.getDocument(item_id, document_id).toPromise(): null,
      useCache
    );
  }

  public async getUserDetails(): Promise<any> {
    return this.apiClient.getUserDetails().toPromise();
  }

  public async oAuthenticate(clientID: string, clientSecret: string, authCode: string, callbackUrl: string): Promise<any> {
    let tokenResponse = await this.apiClient.getOAuthToken(
        clientID,
        clientSecret,
        authCode,
        callbackUrl,
      ).toPromise();

    let apiResponse = await this.apiClient.getApiKey(tokenResponse['access_token']).toPromise();

    this.setApiKey(apiResponse['apiKey']);
  }

  public async purgeCache(): Promise<any> {
    await this.database.rebuild();
  }

  public async purgeCacheByKey(storageKey: string): Promise<any> {
    await this.database.put(storageKey, null);
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  private setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  public unregister() {
    this.apiKey = null;
  }
}