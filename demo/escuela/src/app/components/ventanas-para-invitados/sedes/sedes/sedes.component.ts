import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.scss']
})
export class SedesComponent implements OnInit {
  isMobileMenuOpen = false;
  selectedSection = 'sedes'; // Set to 'sedes' to highlight the active navigation link

  constructor(public router: Router) {}

  ngOnInit(): void {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.classList.toggle('mobile-menu-open', this.isMobileMenuOpen);
  }

  smoothScrollToTop(): void {
    const scrollDuration = 1000;
    const scrollStep = -window.scrollY / (scrollDuration / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) window.scrollBy(0, scrollStep);
      else clearInterval(scrollInterval);
    }, 15);
  }

  irAOtraVentana(): void {
    this.router.navigate(['/login']).then(() => this.smoothScrollToTop());
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}