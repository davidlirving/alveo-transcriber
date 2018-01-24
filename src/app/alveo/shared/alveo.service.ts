import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';
import { DBService, Databases } from './db.service';
import { ApiService } from './api.service';

@Injectable()
export class AlveoService {
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private dbService: DBService) {
  }

  private cacheRequest(storageName: string): Observable<any> {
    return new Observable((observer) =>
      {
        this.dbService.instance(Databases.Cache).get(storageName).then(
          storageName => {
            if (storageName['storage'] === null) {
              observer.error("404");
            }
            observer.next(storageName['storage']);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      }
    );
  }

  private apiRequest(request: Observable<any>): Observable<any> {
    return new Observable((observer) =>
      {
        if (this.authService.isApiAuthed()) {
          request.subscribe(
            data => {
              observer.next(data);
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
        } else {
          //observer.error("Warning: API request ignored: not API authed");
          observer.error(403);
        }
      }
    );
  }

  private retrieve(
    request: Observable<any>,
    storageClass: string,
    useCache= true,
    useApi= true,
  ): Observable<any>
  {
    return new Observable((observer) =>
      {
        new Observable((cacheObserver) =>
          {
            if (useCache) {
              this.cacheRequest(storageClass).subscribe(
                data => {
                  console.log("Using DB source for: " + storageClass)
                  cacheObserver.next(data);
                  cacheObserver.complete()
                },
                error => {
                  cacheObserver.error(error);
                }
              );
            } else {
              cacheObserver.error("Cache requests not allowed, method flag disabled");
            }
          }).subscribe(
            data => {
              observer.next(data);
              observer.complete();
            },
            error => {
              if (useApi) {
                this.apiRequest(request).subscribe(
                  data => {
                    if (useCache) {
                      console.log("Caching "+storageClass);
                      this.dbService.instance(Databases.Cache).put(storageClass, {storage: data});
                    }

                    observer.next(data);
                    observer.complete;
                  },
                  error => {
                    observer.error(error);
                  }
                )
              } else {
                observer.error("API requests not allowed, method flag disabled");
              }
            }
          );
      }
    );
  }

  public getListDirectory(useCache= true, useApi= true): Observable<any> {
    return this.retrieve(this.requestListDirectory(), 'lists', useCache, useApi);
  }

  private requestListDirectory(): Observable<any> {
    return new Observable((observer) =>
      {
        this.apiService.getListIndex().subscribe(
          (data) => {
            let lists = data['own'];
            lists = lists.concat(data['shared']);

            observer.next(lists);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      }
    );
  }

  public getList(listUrl: string, useCache= true, useApi= true): Observable<any> {
    return this.retrieve(this.requestList(listUrl), listUrl, useCache, useApi);
  }

  public requestList(listUrl: string): Observable<any> {
    return this.apiService.getList(listUrl);
  }

  public getItem(itemUrl: any, useCache= true, useApi= true): Observable<any> {
    return this.retrieve(this.requestItem(itemUrl), itemUrl, useCache, useApi);
  }

  public requestItem(itemUrl: string): Observable<any> {
    return this.apiService.getItem(itemUrl);
  }

  public getAudioFile(fileUrl: any, useCache= true, useApi = true): Observable<any> {
    return this.retrieve(this.requestAudioFile(fileUrl), fileUrl, useCache, useApi);
  }

  public requestAudioFile(audioFileUrl: any) {
    return this.apiService.getDocument(audioFileUrl);
  }
}
