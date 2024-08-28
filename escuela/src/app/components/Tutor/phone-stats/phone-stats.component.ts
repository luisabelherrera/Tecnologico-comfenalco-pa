import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { TutorService } from 'src/app/services/tutor/tutor.service';

@Component({
  selector: 'app-phone-stats',
  templateUrl: './phone-stats.component.html',
  styleUrls: ['./phone-stats.component.scss']
})
export class PhoneStatsComponent implements OnInit {
  chart: any;

  constructor(private tutorService: TutorService) { }

  ngOnInit(): void {
    this.loadPhoneStats();
  }

  loadPhoneStats(): void {
    this.tutorService.getAllTutores().subscribe(tutores => {
      const phoneCounts = this.getPhoneCounts(tutores);
      this.renderChart(phoneCounts);
    });
  }

  getPhoneCounts(tutores: any[]): any[] {
    const phoneCountMap = new Map<string, number>();

    tutores.forEach(tutor => {
      const phone = tutor.telefono;
      if (phoneCountMap.has(phone)) {
        phoneCountMap.set(phone, phoneCountMap.get(phone)! + 1);
      } else {
        phoneCountMap.set(phone, 1);
      }
    });

    return Array.from(phoneCountMap.entries()).sort((a, b) => b[1] - a[1]);
  }

  renderChart(phoneCounts: any[]): void {
    const labels = phoneCounts.map(entry => entry[0]);
    const data = phoneCounts.map(entry => entry[1]);

    this.chart = new Chart('phoneChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Número de Teléfonos',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
