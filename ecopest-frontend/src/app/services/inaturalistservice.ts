import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface TaxonResult {
  id: number;
  scientificName: string;
  commonName: string;
  photoUrl: string | null;
  rank: string;
}

/** API externa iNaturalist (gratuita, sin API key): nombre cientifico y foto de una especie. */
@Injectable({ providedIn: 'root' })
export class Inaturalistservice {
  private apiURL = 'https://api.inaturalist.org/v1/taxa';

  constructor(private http: HttpClient) {}

  searchTaxa(query: string, locale: string): Observable<TaxonResult[]> {
    const params = new HttpParams().set('q', query).set('per_page', 5).set('locale', locale);
    return this.http.get<any>(this.apiURL, { params }).pipe(
      map((res) =>
        (res.results ?? []).map(
          (t: any): TaxonResult => ({
            id: t.id,
            scientificName: t.name,
            commonName: t.preferred_common_name ?? '',
            photoUrl: t.default_photo?.medium_url ?? t.default_photo?.square_url ?? null,
            rank: t.rank ?? '',
          }),
        ),
      ),
    );
  }
}
