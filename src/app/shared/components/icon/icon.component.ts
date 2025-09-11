import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-icon',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './icon.component.html',
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
})
export class IconComponent implements OnInit {
  @Input({ required: true }) name!: string;
  @Input() class?: string;
  @Input() type: 'fi' | 'google' | 'fa' = 'fi';
  @Input() options?: any;

  featherIcon = '';
  googleIcon = '';
  fontAwesomeIcon = '';
  svgContent: SafeHtml | null = null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void { this.onInit(); }

  onInit() {
    switch (this.type) {
      case 'fi':
        this.loadFeatherIcon();
        break;
      case 'google':
      case 'fa':
    }
  }

  private loadFeatherIcon() {
    const path = `icons/feather/${this.name}.svg`;
    this.http.get(path, { responseType: 'text' }).subscribe({
      next: (svg) => { this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg); },
      error: () => { this.svgContent = null; }
    });
  }
}
