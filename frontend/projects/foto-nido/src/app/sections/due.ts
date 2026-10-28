import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Reveal } from '../shared/reveal';
import { whatsappLink } from '../shared/whatsapp';

const DAY = 86_400_000;
const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const fromIso = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DAY);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, d.getDate());
const fmt = (d: Date, year = false) => d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', ...(year ? { year: 'numeric' } : {}) });

/** "3 al 13 de marzo" o "28 de febrero al 7 de marzo". */
function range(a: Date, b: Date) {
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) return `${a.getDate()} al ${fmt(b)}`;
  return `${fmt(a)} al ${fmt(b)}`;
}

/**
 * Lo que se puede hacer en esta página: escribes la fecha probable de parto y te dice, con fechas reales,
 * cuándo apartar, cuándo es la ventana de maternidad, la de newborn y la del primer año.
 */
@Component({
  selector: 'app-due',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section id="fechas" class="due wrap" aria-labelledby="fechas-t">
      <div class="ask">
        <h2 id="fechas-t" data-reveal>¿Cuándo nace tu bebé?</h2>
        <p data-reveal [revealDelay]="80">Los recién nacidos se fotografían entre el día 5 y el 15, cuando todavía duermen enroscados como en la panza. Esa ventana se cierra rápido, así que conviene apartarla antes.</p>
        <label class="field" data-reveal [revealDelay]="160">
          <span>Fecha probable de parto</span>
          <input type="date" [value]="dueIso()" [min]="minIso" [max]="maxIso" (input)="set($event)" />
        </label>
      </div>
      <div class="plan" aria-live="polite">
        @for (r of rows(); track r.name; let i = $index) {
          <div class="r" data-reveal [revealDelay]="i * 70">
            <span class="n">{{ r.name }}<small>{{ r.note }}</small></span>
            <span class="d">{{ r.date }}</span>
          </div>
        }
        <a class="btn go" [href]="link()" target="_blank" rel="noopener" data-reveal [revealDelay]="300">Apartar con estas fechas</a>
      </div>
    </section>
  `,
  styles: `
    .due { display: grid; grid-template-columns: 5fr 6fr; gap: 6vw; align-items: start; padding-block: var(--section); background: var(--surface); }
    h2 { font-size: var(--step-head); max-width: 11ch; margin-bottom: 28px; }
    .ask p { max-width: 44ch; margin-bottom: 40px; }
    .field { display: grid; gap: 10px; max-width: 360px; font-weight: 600; font-size: var(--step-small); }
    input {
      min-height: 64px; padding: 0 18px; border: 2px solid var(--ink); border-radius: 0; background: var(--bg);
      font-size: var(--step-lead); font-weight: 600; color-scheme: dark; transition: background-color 200ms ease;
    }
    input:focus { outline: none; background: var(--surface-2); }
    .plan { display: grid; gap: 30px; padding-top: 8px; }
    .r { display: flex; justify-content: space-between; align-items: baseline; gap: 24px; }
    .n { font-weight: 600; }
    .n small { display: block; margin-top: 2px; font-size: var(--step-small); font-weight: 400; color: var(--muted); }
    .d { font-size: var(--step-lead); font-weight: 800; letter-spacing: -0.03em; text-align: right; font-variant-numeric: tabular-nums; }
    .go { justify-self: start; margin-top: 12px; }
    @media (max-width: 900px) {
      .due { grid-template-columns: 1fr; gap: 56px; }
      .r { flex-direction: column; gap: 4px; }
      .d { text-align: left; }
      .go { justify-self: stretch; }
    }
  `,
})
export class Due {
  private readonly today = new Date(new Date().setHours(0, 0, 0, 0));
  protected readonly minIso = iso(this.today);
  protected readonly maxIso = iso(addDays(this.today, 300));
  /** Por omisión, un parto dentro de diez semanas, para que la tabla nunca esté vacía */
  protected readonly due = signal(addDays(this.today, 70));
  protected readonly dueIso = computed(() => iso(this.due()));

  protected readonly rows = computed(() => {
    const due = this.due();
    const week = (w: number) => addDays(due, (w - 40) * 7);
    const bookBy = week(30) < this.today ? this.today : week(30);
    const mat = [week(28), week(34)].map((d) => (d < this.today ? this.today : d));
    return [
      { name: 'Aparta tu fecha', note: 'Antes de la semana 30; la movemos cuando nazca', date: bookBy.getTime() === this.today.getTime() ? 'Esta semana' : `Antes del ${fmt(bookBy)}` },
      { name: 'Maternidad', note: 'Semanas 28 a 34, con la luz del atardecer', date: mat[0] >= mat[1] ? 'Ya pasó la ventana' : range(mat[0], mat[1]) },
      { name: 'Recién nacido', note: 'Días 5 a 15, tentativa', date: range(addDays(due, 5), addDays(due, 15)) },
      { name: 'Primer año', note: 'Entre los 10 y los 12 meses', date: `${fmt(addMonths(due, 10))} al ${fmt(addMonths(due, 12), true)}` },
    ];
  });

  protected readonly link = computed(() => {
    const r = this.rows();
    return whatsappLink(
      `Hola, Inés. Mi bebé nace alrededor del ${fmt(this.due(), true)}. Quiero apartar la sesión de recién nacido (${r[2].date}) y me interesa saber de maternidad (${r[1].date}).`,
    );
  });

  protected set(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    if (v) this.due.set(fromIso(v));
  }
}
