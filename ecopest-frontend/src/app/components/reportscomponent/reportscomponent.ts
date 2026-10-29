import { Component, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Authservice } from '../../services/authservice';
import { Reportservice } from '../../services/reportservice';
import { Weatherservice } from '../../services/weatherservice';
import { AverageWeatherDTO, CountDTO } from '../../models/CountDTO';
import { TranslatePipe } from '../../i18n/translatepipe';
import { Barchartcomponent } from '../shared/barchartcomponent/barchartcomponent';

@Component({
  selector: 'app-reports',
  imports: [MatTableModule, TranslatePipe, Barchartcomponent],
  templateUrl: './reportscomponent.html',
  styleUrl: './reportscomponent.css',
})
export class Reportscomponent implements OnInit {
  inspectionsByCompany = signal<CountDTO[]>([]);
  usersByCompany = signal<CountDTO[]>([]);
  usersByRole = signal<CountDTO[]>([]);
  incidentsByPest = signal<CountDTO[]>([]);
  incidentsByRisk = signal<CountDTO[]>([]);
  evidenceByIncident = signal<CountDTO[]>([]);
  recommendationsByIncident = signal<CountDTO[]>([]);
  weather = signal<AverageWeatherDTO[]>([]);
  weatherColumns = ['name', 'avgTemperature', 'avgHumidity'];

  constructor(
    public auth: Authservice,
    private r: Reportservice,
    private w: Weatherservice,
  ) {}

  ngOnInit(): void {
    this.r.inspectionsByCompany().subscribe({ next: (d) => this.inspectionsByCompany.set(d) });
    this.r.usersByCompany().subscribe({ next: (d) => this.usersByCompany.set(d) });
    if (this.auth.isAdmin()) {
      this.r.usersByRole().subscribe({ next: (d) => this.usersByRole.set(d) });
    }
    this.r.incidentsByPest().subscribe({ next: (d) => this.incidentsByPest.set(d) });
    this.r.incidentsByRisk().subscribe({ next: (d) => this.incidentsByRisk.set(d) });
    this.r.evidenceByIncident().subscribe({ next: (d) => this.evidenceByIncident.set(d) });
    this.r.recommendationsByIncident().subscribe({ next: (d) => this.recommendationsByIncident.set(d) });
    this.w.getAverages().subscribe({ next: (d) => this.weather.set(d) });
  }
}
