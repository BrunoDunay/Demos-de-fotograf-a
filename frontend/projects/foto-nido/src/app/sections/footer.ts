import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT } from '../core/content';
import { MotionToggle } from '../shared/motion-toggle';

/** Pie: el nombre abre el cierre a todo lo ancho; abajo, dónde encontrar el estudio y los enlaces. */
@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MotionToggle],
  template: `
    <footer class="foot wrap">
      <p class="name" aria-hidden="true">Nido</p>
      <div class="row">
        <ul class="places">
          <li><a [href]="'mailto:' + c.email">{{ c.email }}</a></li>
          <li><a [href]="'https://www.instagram.com/' + c.instagram" target="_blank" rel="noopener">&#64;{{ c.instagram }}</a></li>
          <li>{{ c.studio }}</li>
        </ul>
        <nav class="cols" aria-label="Pie de página">
          <div>
            <a href="/#sesiones">Sesiones</a>
            <a href="/#fechas">Fechas</a>
            <a href="/#dia">Un día de sesión</a>
          </div>
          <div>
            <a href="/#ines">Inés</a>
            <a href="/#tarifas">Tarifas</a>
            <a href="/#cartas">Cartas</a>
          </div>
          <div>
            <a routerLink="/aviso-de-privacidad">Aviso de privacidad</a>
            <a routerLink="/terminos">Términos</a>
            <app-motion-toggle />
          </div>
        </nav>
      </div>
      <div class="legal">
        <p>Sitio demo con marca ficticia. Fotos de Pexels. Diseño y desarrollo: <a class="link" href="https://portafolio-web-chi-ten.vercel.app" target="_blank" rel="noopener">Bruno Dunay</a></p>
        <a class="link" href="#inicio">Volver arriba</a>
      </div>
    </footer>
  `,
  styles: `
    .foot { display: flex; flex-direction: column; min-height: 90svh; padding-block: 140px 28px; background: var(--surface); }
    /* El nombre a todo lo ancho: 4 letras a 41vw */
    .name { font-size: 41vw; font-weight: 800; line-height: 0.74; letter-spacing: -0.07em; margin-left: -0.04em; }
    .row { display: grid; grid-template-columns: 5fr 7fr; gap: 6vw; margin-top: 72px; }
    .places { list-style: none; padding: 0; display: grid; gap: 6px; font-size: var(--step-lead); font-weight: 800; letter-spacing: -0.03em; }
    .places a { transition: opacity 200ms ease; }
    @media (hover: hover) and (pointer: fine) { .places a:hover { opacity: 0.7; } }
    .places a:active { opacity: 0.6; }
    .cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; font-size: var(--step-small); }
    .cols div { display: grid; align-content: start; gap: 4px; }
    .cols a { padding-block: 6px; transition: opacity 200ms ease; }
    @media (hover: hover) and (pointer: fine) { .cols a:hover { opacity: 0.7; } }
    .cols a:active { opacity: 0.6; }
    .legal { display: flex; justify-content: space-between; gap: 24px; margin-top: auto; padding-top: 96px; font-size: var(--step-small); }
    @media (max-width: 760px) {
      .foot { min-height: auto; }
      .row { grid-template-columns: 1fr; gap: 48px; margin-top: 40px; }
      .cols { grid-template-columns: 1fr 1fr; }
      .legal { flex-direction: column; padding-top: 64px; }
    }
  `,
})
export class Footer {
  protected readonly c = CONTACT;
}
