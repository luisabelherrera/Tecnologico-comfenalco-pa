import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tutor } from 'src/app/models/tutor.interface';

import { TutorService } from 'src/app/services/tutor/tutor.service';

@Component({
  selector: 'app-courses',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.scss']
})
export class TutorComponent implements OnInit {
  
  courses$: Observable<tutor[]>;
  selectedCourse: tutor;

  constructor(private tutorService: TutorService) { }

  ngOnInit(): void {
  
  }

 
  
}
