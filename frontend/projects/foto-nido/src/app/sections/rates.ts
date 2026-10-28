import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { EXTRAS, NOTES, RATES } from '../core/content';
import { Reveal } from '../shared/reveal';
import { whatsappLink } from '../shared/whatsapp';

const money = (n: number) => '$' + n.toLocaleString('es-MX');

/**
 * Tarifas impresas en un boleto: eliges el paquete arriba y el boleto cambia; en el talón,
 * el precio y el botón para apartar. Abajo, los extras y lo que preguntan antes de apartar.
 */
@Component({
  selector: 'app-rates',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section id="tarifas" class="rates wrap" aria-labelledby="tarifas-t">
      <h2 id="tarifas-t" data-reveal>Tarifas</h2>
      <div class="tabs" role="tablist" aria-label="Paquetes" data-reveal [revealDelay]="80">
        @for (r of rates; track r.name; let i = $index) {
          <button type="button" role="tab" [attr.aria-selected]="pick() === i" [class.on]="pick() === i" (click)="pick.set(i)">{{ r.name }}</button>
        }
      </div>

      <div class="ticket" role="tabpanel" data-reveal [revealDelay]="140">
        <div class="main">
          <p class="what">{{ rate().name }}</p>
          <p class="line">{{ rate().line }}</p>
          <ul>
            @for (d of rate().details; track d) {
              <li>{{ d }}</li>
            }
          </ul>
        </div>
        <div class="stub">
          <span class="perf" aria-hidden="true">@for (d of dots; track $index) {<i></i>}</span>
          <span class="notch a" aria-hidden="true"></span>
          <span class="notch b" aria-hidden="true"></span>
          <p class="price">{{ money(rate().price) }}</p>
          <a class="bar" [href]="link()" target="_blank" rel="noopener">Apartar</a>
        </div>
      </div>
      <p class="terms" data-reveal>Apartas con $1,000 por transferencia; el resto se paga el día de la sesión. Cambiar la fecha no cuesta si avisas con una semana.</p>

      <div class="more">
        <div data-reveal>
          <h3>Extras</h3>
          @for (e of extras; track e.name) {
            <p class="x"><span>{{ e.name }}</span><b>{{ e.price }}</b></p>
          }
        </div>
        <div data-reveal [revealDelay]="80">
          <h3>Antes de apartar</h3>
          <dl>
            @for (n of notes; track n.q) {
              <div><dt>{{ n.q }}</dt><dd>{{ n.a }}</dd></div>
            }
          </dl>
        </div>
      </div>
    </section>
  `,
  styles: `
    .rates { padding-block: var(--section); }
    h2 { font-size: var(--step-head); margin-bottom: 32px; }
    .tabs { display: flex; flex-wrap: wrap; gap: 8px 28px; margin-bottom: 28px; }
    .tabs button { min-height: 44px; font-size: var(--step-lead); font-weight: 600; color: var(--muted); transition: color 200ms ease, scale 160ms var(--ease-out); }
    .tabs button.on { color: var(--ink); text-decoration: underline; text-decoration-thickness: 3px; text-underline-offset: 8px; }
    @media (hover: hover) and (pointer: fine) { .tabs button:hover { color: var(--ink); } }
    .tabs button:active { scale: 0.97; }

    /* El boleto: dorado lleno, dos partes, muescas y perforación del color del fondo */
    .ticket { position: relative; display: grid; grid-template-columns: 7fr 3fr; width: min(64vw, 1000px); min-height: 380px; background: var(--ink); color: var(--accent-ink); }
    .main { display: flex; flex-direction: column; padding: 40px; }
    .what { font-size: var(--step-head); font-weight: 800; line-height: 0.95; letter-spacing: -0.045em; }
    .line { margin-top: 12px; font-weight: 600; }
    ul { margin-top: auto; padding: 28px 0 0; list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 28px; }
    li::before { content: '· '; }
    .stub { position: relative; display: flex; flex-direction: column; justify-content: center; gap: 24px; padding: 32px 28px; }
    .perf { position: absolute; left: -3px; top: 22px; bottom: 22px; display: flex; flex-direction: column; justify-content: space-between; }
    .perf i { width: 6px; height: 6px; border-radius: 50%; background: var(--bg); }
    .price { font-size: var(--step-head); font-weight: 800; letter-spacing: -0.04em; text-align: center; }
    .bar { display: grid; place-items: center; min-height: 56px; background: var(--bg); color: var(--ink); font-weight: 600; transition: background-color 200ms ease, scale 160ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .bar:hover { background: var(--surface-2); } }
    .bar:active { scale: 0.97; }
    .notch { position: absolute; width: 28px; height: 28px; border-radius: 50%; background: var(--bg); }
    .notch.a { left: -14px; top: -14px; }
    .notch.b { left: -14px; bottom: -14px; }
    .terms { max-width: 60ch; margin-top: 24px; color: var(--muted); }

    .more { display: grid; grid-template-columns: 5fr 7fr; gap: 6vw; margin-top: 120px; }
    h3 { font-size: var(--step-lead); letter-spacing: -0.03em; margin-bottom: 20px; }
    .x { display: flex; justify-content: space-between; gap: 20px; padding-block: 8px; }
    .x b { white-space: nowrap; }
    dl { display: grid; gap: 24px; }
    dt { font-weight: 800; margin-bottom: 6px; }

    @media (max-width: 860px) {
      .ticket { grid-template-columns: 1fr; width: 100%; }
      .main { padding: 28px 24px; }
      ul { grid-template-columns: 1fr; }
      .stub { padding: 64px 24px 28px; }
      .main { padding-bottom: 48px; }
      .perf { left: 22px; right: 22px; top: -3px; bottom: auto; flex-direction: row; }
      .notch.a { left: -14px; top: -14px; }
      .notch.b { left: auto; right: -14px; top: -14px; bottom: auto; }
      .more { grid-template-columns: 1fr; gap: 64px; margin-top: 88px; }
    }
  `,
})
export class Rates {
  protected readonly rates = RATES;
  protected readonly extras = EXTRAS;
  protected readonly notes = NOTES;
  protected readonly money = money;
  protected readonly dots = Array.from({ length: 16 });
  /** El paquete "Nido" es el que más eligen: arranca seleccionado */
  protected readonly pick = signal(RATES.findIndex((r) => r.featured));
  protected readonly rate = computed(() => this.rates[this.pick()]);
  protected readonly link = computed(() => whatsappLink(`Hola, Inés. Quiero apartar el paquete ${this.rate().name} (${money(this.rate().price)}). ¿Qué fechas tienes?`));
}
