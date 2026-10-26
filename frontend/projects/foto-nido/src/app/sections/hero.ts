import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, effect, inject, viewChild } from '@angular/core';
import { Album } from '../core/booking';
import { Motion, prefersReducedMotion, useGsap } from '../core/motion';
import { Running } from '../shared/running';

/**
 * Portada: una copia chica al centro, entre "Lo pequeño" y "dura poco.". Al bajar, la sección
 * se queda fija y la copia crece hasta llenar la pantalla (un clip-path que se abre), mientras
 * las palabras se apartan. Es la misma copia con la que termina la intro de revelado.
 */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Running],
  template: `
    <section class="hero" id="inicio" #root running="">
      <div class="stage">
        <div class="frame" #frame>
          <img src="media/nb-manta.webp" srcset="media/nb-manta-sm.webp 720w, media/nb-manta.webp 1400w" sizes="100vw"
            alt="Recién nacido dormido, envuelto en una manta café" width="1400" height="2097" fetchpriority="high" />
          <div class="veil"></div>
        </div>
        <p class="top a-fade">Fotografía de recién nacidos y familia · Aguascalientes</p>
        <h1 class="words">
          <span class="w w1"><span class="in">Lo pequeño</span></span>
          <span class="w w2"><span class="in"><em>dura poco.</em></span></span>
        </h1>
        <p class="caption cap a-fade">Lía, 9 días. Estudio Nido.</p>
        <div class="over">
          <p>Fotografío los primeros días, la espera y a los de casa. Sin prisa, en un estudio tibio, con alguien que sabe cargar a un bebé.</p>
          <button type="button" class="thread light" (click)="album.indexOpen.set(true)">Abrir el índice <span class="arrow">→</span></button>
        </div>
        <span class="hint a-fade" aria-hidden="true">Baja para ampliar</span>
      </div>
    </section>
  `,
  styles: `
    .hero { position: relative; height: 100svh; }
    .stage { position: relative; height: 100svh; overflow: hidden; }
    .frame { position: absolute; inset: 0; clip-path: inset(calc(50% - var(--print-h) / 2) calc(50% - var(--print-w) / 2)); will-change: clip-path; }
    .frame img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }
    .veil { position: absolute; inset: 0; background: linear-gradient(0deg, oklch(18% 0.02 45 / 70%), transparent 55%); opacity: 0; }
    .top { position: absolute; left: 0; right: 0; top: 104px; text-align: center; font-size: 0.74rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); }
    .words { position: absolute; inset: 0; pointer-events: none; font-size: clamp(3rem, 7.2vw, 7.6rem); font-weight: 300; line-height: 1; }
    .w { position: absolute; top: 50%; overflow: hidden; padding: 0.06em 0.08em 0.14em; translate: 0 -50%; white-space: nowrap; }
    .w .in { display: inline-block; }
    .w1 { right: calc(50% + var(--print-w) / 2 + 2.4vw); }
    .w2 { left: calc(50% + var(--print-w) / 2 + 2.4vw); }
    .w2 em { color: var(--hilo); font-weight: 340; }
    .cap { position: absolute; left: 0; right: 0; top: calc(50% + var(--print-h) / 2 + 14px); text-align: center; }
    .over { position: absolute; left: var(--gutter); bottom: clamp(34px, 7vh, 70px); max-width: 520px; color: var(--paper); opacity: 0; }
    .over p { font-family: var(--font-display); font-size: clamp(1.5rem, 2.4vw, 2.2rem); line-height: 1.2; font-weight: 340; }
    .thread.light { margin-top: 18px; color: var(--paper); }
    .hint { position: absolute; left: 0; right: 0; bottom: 28px; text-align: center; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); }
    @media (max-width: 760px) {
      .w { translate: none; left: 0; right: 0; text-align: center; }
      .w1 { top: auto; bottom: calc(50% + var(--print-h) / 2 + 8px); }
      .w2 { top: calc(50% + var(--print-h) / 2 + 44px); }
      .words { font-size: clamp(2.6rem, 12vw, 3.6rem); }
      .top { top: 92px; padding: 0 var(--gutter); }
    }
  `,
})
export class Hero {
  protected readonly album = inject(Album);
  private readonly motion = inject(Motion);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly frame = viewChild.required<ElementRef<HTMLElement>>('frame');
  private ready = false;
  private played = false;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const frame = this.frame().nativeElement;
      const { gsap, ScrollTrigger } = useGsap();
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap.set(q('.w .in'), { yPercent: 110 });
      gsap.set(q('.a-fade'), { opacity: 0 });

      // Recorte de la copia en px (mismo cálculo que el CSS) para poder animarlo.
      const printClip = () => {
        const { w, h } = frameSize();
        const x = (frame.clientWidth - w) / 2;
        const y = (frame.clientHeight - h) / 2;
        return `inset(${y}px ${x}px ${y}px ${x}px)`;
      };
      // Lee el tamaño real de la copia midiendo un elemento temporal con las variables CSS.
      const probe = document.createElement('div');
      probe.style.cssText = 'position:absolute;visibility:hidden;width:var(--print-w);height:var(--print-h)';
      root.appendChild(probe);
      const frameSize = () => ({ w: probe.offsetWidth, h: probe.offsetHeight });

      const ctx = gsap.context(() => {
        const mobile = matchMedia('(max-width: 760px)').matches;
        gsap
          .timeline({
            scrollTrigger: { trigger: root, start: 'top top', end: '+=140%', pin: true, scrub: 0.6, invalidateOnRefresh: true },
            defaults: { ease: 'none' },
          })
          .fromTo(frame, { clipPath: () => printClip() }, { clipPath: 'inset(0px 0px 0px 0px)', duration: 1 }, 0)
          .fromTo(q('.frame img'), { scale: 1.08 }, { scale: 1, duration: 1 }, 0)
          .to(q('.w1'), { xPercent: mobile ? 0 : -40, yPercent: mobile ? -60 : 0, opacity: 0, duration: 0.55 }, 0)
          .to(q('.w2'), { xPercent: mobile ? 0 : 40, yPercent: mobile ? 60 : 0, opacity: 0, duration: 0.55 }, 0)
          .to(q('.cap, .top, .hint'), { opacity: 0, duration: 0.25 }, 0)
          .to(q('.veil'), { opacity: 1, duration: 0.4 }, 0.6)
          .fromTo(q('.over'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35 }, 0.65);
      }, root);
      destroyRef.onDestroy(() => {
        ctx.revert();
        probe.remove();
      });
      this.ready = true;
      if (this.motion.introDone()) this.play();
      void ScrollTrigger;
    });

    effect(() => {
      if (this.motion.introDone() && this.ready) this.play();
    });
  }

  /** Entrada después de la intro: las palabras suben desde su máscara. */
  private play() {
    if (this.played) return;
    this.played = true;
    const { gsap } = useGsap();
    const q = gsap.utils.selector(this.root().nativeElement);
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .to(q('.w .in'), { yPercent: 0, duration: 1.3, stagger: 0.12 }, 0.1)
      .to(q('.a-fade'), { opacity: 1, duration: 0.9, stagger: 0.08 }, 0.5);
  }
}
