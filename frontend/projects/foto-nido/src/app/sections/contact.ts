import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT } from '../core/content';
import { Reveal } from '../shared/reveal';
import { whatsappLink } from '../shared/whatsapp';

/** Cierre: el correo como letrero, en los colores invertidos de la página. Sin formulario. */
@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section id="reserva" class="contact wrap" aria-labelledby="reserva-t">
      <h2 class="visually-hidden" id="reserva-t">Reserva</h2>
      <p class="ask" data-reveal>Escríbeme con la fecha probable de parto o la edad de tu bebé, y te digo qué días tengo libres.</p>
      <a class="mail" [href]="'mailto:' + c.email + '?subject=' + subject" data-reveal [revealDelay]="100">{{ c.email.split('@')[0] }}&#64;<wbr />{{ c.email.split('@')[1] }}</a>
      <div class="foot">
        <p>{{ c.phone }}<br />{{ c.studio }}, {{ c.city }}<br />{{ c.hours }}</p>
        <p class="nets">
          <a class="link" [href]="wa" target="_blank" rel="noopener">WhatsApp</a>
          <a class="link" [href]="'https://www.instagram.com/' + c.instagram" target="_blank" rel="noopener">Instagram</a>
        </p>
      </div>
    </section>
  `,
  styles: `
    .contact { position: relative; display: flex; flex-direction: column; min-height: 100svh; padding-block: 120px var(--margin); background: var(--ink); color: var(--accent-ink); }
    .ask { max-width: 30ch; font-size: var(--step-lead); font-weight: 600; line-height: 1.25; letter-spacing: -0.02em; }
    /* El correo de margen a margen: 19 caracteres a 10.2vw */
    .mail {
      margin-top: auto; margin-bottom: 12vh; font-size: 10.2vw; font-weight: 400; line-height: 1; letter-spacing: -0.05em; white-space: nowrap;
      transition: color 250ms ease;
    }
    @media (hover: hover) and (pointer: fine) { .mail:hover { color: var(--surface-2); } }
    .mail:active { opacity: 0.7; }
    .foot { display: flex; justify-content: space-between; align-items: end; gap: 24px; font-size: var(--step-small); }
    .nets { display: flex; gap: 24px; }
    @media (max-width: 760px) {
      .contact { min-height: 86svh; padding-top: 88px; }
      .mail { font-size: 11.5vw; white-space: normal; margin-bottom: 9vh; }
      .foot { flex-direction: column; align-items: start; }
    }
  `,
})
export class Contact {
  protected readonly c = CONTACT;
  protected readonly subject = encodeURIComponent('Quiero apartar una sesión');
  protected readonly wa = whatsappLink('Hola, Inés. Quiero apartar una sesión.');
}
