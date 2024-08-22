import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { TutorService } from './tutor.service';

describe('CoursesService', () => {
  let service: TutorService ;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete'])
        },
     
      ]
    });
    service = TestBed.inject(TutorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
