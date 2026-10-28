import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Barra simple: el nombre, cuatro enlaces y una acción. Sin adornos. */
@Component({
  selector: 'app-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <header class="bar wrap">
      <a routerLink="/" fragment="inicio" class="name" aria-label="Nido, ir al inicio">Nido</a>
      <nav aria-label="Secciones">
        <a href="/#sesiones">Sesiones</a>
        <a href="/#fechas">Fechas</a>
        <a href="/#tarifas">Tarifas</a>
        <a href="/#cartas">Cartas</a>
      </nav>
      <a class="btn small" href="/#reserva">Aparta tu fecha</a>
    </header>
  `,
  styles: `
    .bar { position: fixed; inset: 0 0 auto; z-index: 50; display: flex; align-items: center; gap: 32px; height: 68px; background: var(--bg); }
    .name { font-weight: 800; font-size: var(--step-lead); letter-spacing: -0.04em; transition: opacity 200ms ease; }
    .name:active { opacity: 0.7; }
    nav { display: flex; gap: 26px; margin-left: auto; font-weight: 600; font-size: var(--step-small); }
    nav a { padding: 10px 0; transition: opacity 200ms ease; }
    @media (hover: hover) and (pointer: fine) { nav a:hover { opacity: 0.7; } }
    nav a:active { opacity: 0.6; }
    .small { min-height: 44px; padding: 0 18px; font-size: var(--step-small); }
    @media (max-width: 760px) {
      .bar { height: 60px; }
      nav { display: none; }
      .small { margin-left: auto; }
    }
  `,
})
export class Bar {}
