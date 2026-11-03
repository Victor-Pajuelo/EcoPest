import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Authservice } from '../../services/authservice';
import { Inspectionservice } from '../../services/inspectionservice';
import { Incidentservice } from '../../services/incidentservice';
import { Pestservice } from '../../services/pestservice';
import { Businessservice } from '../../services/businessservice';
import { Recommendationservice } from '../../services/recommendationservice';
import { Reportservice } from '../../services/reportservice';
import { CountDTO } from '../../models/CountDTO';
import { TranslatePipe } from '../../i18n/translatepipe';
import { Languageservice } from '../../i18n/languageservice';
import { Barchartcomponent } from '../shared/barchartcomponent/barchartcomponent';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatIconModule, MatButtonModule, TranslatePipe, Barchartcomponent],
  templateUrl: './homecomponent.html',
  styleUrl: './homecomponent.css',
})
export class Homecomponent implements OnInit {
  inspections = signal<number | null>(null);
  incidents = signal<number | null>(null);
  pests = signal<number | null>(null);
  companies = signal<number | null>(null);
  recommendations = signal<number | null>(null);
  byRisk = signal<CountDTO[]>([]);
  byPest = signal<CountDTO[]>([]);

  constructor(
    public auth: Authservice,
    public lang: Languageservice,
    private inspS: Inspectionservice,
    private incS: Incidentservice,
    private pestS: Pestservice,
    private bizS: Businessservice,
    private recS: Recommendationservice,
    private reports: Reportservice,
  ) {}

  ngOnInit(): void {
    this.inspS.getInspections().subscribe({ next: (d) => this.inspections.set(d.length) });
    this.incS.getIncidents().subscribe({ next: (d) => this.incidents.set(d.length) });
    this.pestS.getPests().subscribe({ next: (d) => this.pests.set(d.length) });
    this.bizS.getBusinesses().subscribe({ next: (d) => this.companies.set(d.length) });
    this.recS.getRecommendations().subscribe({ next: (d) => this.recommendations.set(d.length) });
    this.reports.incidentsByRisk().subscribe({ next: (d) => this.byRisk.set(d) });
    this.reports.incidentsByPest().subscribe({ next: (d) => this.byPest.set(d) });
  }
}
