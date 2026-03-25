import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../components/vista-docente/docente-analiza/docente-crea-material/material-docente/safe-html.pipe';
import { SafeUrlPipe } from '../components/vista-docente/docente-analiza/docente-crea-material/material-docente/safe.pipe';

@NgModule({
  declarations: [SafeHtmlPipe , SafeUrlPipe],
  imports: [CommonModule],
  exports: [SafeHtmlPipe , SafeUrlPipe],
})
export class SharedModule {}