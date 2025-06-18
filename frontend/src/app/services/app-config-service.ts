import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";
import { filter } from "rxjs/internal/operators/filter";
import { map } from "rxjs/internal/operators/map";
import { tap } from "rxjs/internal/operators/tap";

export interface AppConfig {
    API_BASE_URL: string;
}

@Injectable({ providedIn: 'root' })
export class AppConfigService {
    private configSubject = new BehaviorSubject<AppConfig | null>(null);

    constructor(private http: HttpClient) {}   
 
    loadConfig(): Observable<void> {
        return this.http.get<AppConfig>('/assets/config.json').pipe(
        tap(config => this.configSubject.next(config)),
        map(() => void 0)
        );
    }
    
    get apiBaseUrl$(): Observable<string> {
    return this.configSubject.pipe(
        filter((cfg): cfg is AppConfig => cfg !== null),
        map(cfg => cfg.API_BASE_URL)
    );
    }
}