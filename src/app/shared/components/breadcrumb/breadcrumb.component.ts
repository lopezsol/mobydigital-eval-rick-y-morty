import { Component, inject, input } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
})
export class BreadcrumbComponent {
  router = inject(Router);
  breadcrumbs: string[] = [];
  $extraLabel = input<string | null>(null);
  breadcrumbItems: BreadcrumbItem[] = [];
  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.buildBreadcrumbs();
      });

    this.buildBreadcrumbs();
  }

  private buildBreadcrumbs(): void {
    const url = this.router.url;
    const pathSegments = url
      .split('/')
      .filter((segment) => segment.length > 0)
      .filter((segment) => !this.isId(segment));

    const items: BreadcrumbItem[] = [];

    // Siempre empezamos con Home
    items.push({ label: 'Home', path: '/characters' });

    // Caso especial: si está en /profile, solo mostrar Home + extraLabel
    if (pathSegments.length === 1 && pathSegments[0] === 'profile') {
      if (this.$extraLabel()) {
        items.push({ label: this.$extraLabel()! });
      }
      this.breadcrumbItems = items;
      return;
    }

    let accumulatedPath = '';
    pathSegments.forEach((segment, index) => {
      accumulatedPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1 && !this.$extraLabel();

      items.push({
        label: this.capitalize(segment),
        path: isLast ? undefined : accumulatedPath,
      });
    });

    if (this.$extraLabel()) {
      items.push({ label: this.$extraLabel()! });
    }

    this.breadcrumbItems = items;
  }

  private isId(segment: string): boolean {
    return /^[0-9]+$/.test(segment) || /^[0-9a-fA-F-]{36}$/.test(segment);
  }

  private capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
