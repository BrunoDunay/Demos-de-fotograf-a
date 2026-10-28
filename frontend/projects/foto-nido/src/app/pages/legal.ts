import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

interface LegalDoc {
  title: string;
  updated: string;
  intro: string;
  sections: { h: string; p: string[] }[];
}

const DOCS: Record<string, LegalDoc> = {
  privacidad: {
    title: 'Aviso de privacidad',
    updated: 'Octubre de 2026',
    intro:
      'Nido, estudio de fotografía de Inés Calvo (en adelante, “Nido”), con domicilio en Calle Hornedo 512, Zona Centro, Aguascalientes, Ags., es responsable del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.',
    sections: [
      { h: 'Datos que recabamos', p: ['Nombre, número de WhatsApp, correo electrónico, fecha probable de parto o fecha de la sesión y, si tú lo compartes, el nombre de tu bebé y datos relevantes para su cuidado durante la sesión (alergias o indicaciones médicas).'] },
      { h: 'Para qué los usamos', p: ['Agendar y preparar tu sesión, enviarte tu guía y tu galería, y avisarte de cambios de fecha.', 'De forma secundaria, para enviarte promociones de temporada. Puedes pedir que dejemos de hacerlo en cualquier momento.'] },
      { h: 'Fotografías de tu familia', p: ['Las fotos son tuyas para uso personal. Solo publicamos en redes o en este sitio las imágenes que tú autorices por escrito, y nunca con el nombre completo de tu bebé.'] },
      { h: 'Con quién los compartimos', p: ['No vendemos ni rentamos tus datos. Solo los compartimos con proveedores que nos ayudan a operar (galería en línea e impresión de álbumes), bajo acuerdos de confidencialidad.'] },
      { h: 'Tus derechos ARCO', p: ['Puedes acceder, rectificar, cancelar u oponerte al uso de tus datos escribiendo a privacidad@nidoestudio.mx con tu nombre completo y una identificación. Respondemos en un plazo máximo de 20 días hábiles.'] },
    ],
  },
  terminos: {
    title: 'Términos y condiciones',
    updated: 'Octubre de 2026',
    intro: 'Al apartar una sesión en Nido aceptas las siguientes condiciones. Están pensadas para que tu sesión sea tranquila y segura para tu bebé.',
    sections: [
      { h: 'Anticipo y pagos', p: ['La fecha se aparta con un anticipo de $1,000 que se descuenta del total. El resto se paga el día de la sesión, por transferencia, tarjeta o efectivo.'] },
      { h: 'Cambios de fecha', p: ['Puedes cambiar la fecha sin costo avisando con una semana de anticipación. Para newborn, la fecha se ajusta al nacimiento de tu bebé sin penalización.'] },
      { h: 'Seguridad del bebé', p: ['Ninguna pose se fuerza. Si el bebé no está cómodo, cambiamos de set o hacemos una pausa. Un adulto responsable debe estar presente durante toda la sesión.'] },
      { h: 'Entrega', p: ['Recibes 10 fotos en 5 días hábiles y la galería completa en 15 días hábiles. Las fotos se entregan editadas; los archivos sin editar no se entregan.'] },
      { h: 'Uso de las imágenes', p: ['Las fotos son para uso personal. Nido conserva los derechos de autor y solo usa imágenes en su portafolio con tu autorización por escrito.'] },
    ],
  },
};

@Component({
  selector: 'app-legal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <article class="legal wrap">
      <a routerLink="/" class="link back">Volver al inicio</a>
      <h1>{{ doc().title }}</h1>
      <p class="updated">Actualizado: {{ doc().updated }}</p>
      <p class="intro">{{ doc().intro }}</p>
      @for (s of doc().sections; track s.h) {
        <section>
          <h2>{{ s.h }}</h2>
          @for (p of s.p; track p) {
            <p>{{ p }}</p>
          }
        </section>
      }
      <p class="note">Documento de ejemplo para un sitio demo con marca ficticia. En un proyecto real lo revisa un abogado.</p>
    </article>
  `,
  styles: `
    .legal { max-width: 860px; padding-block: 140px 120px; }
    .back { display: inline-block; margin-bottom: 40px; font-size: var(--step-small); }
    h1 { font-size: var(--step-head); }
    .updated { margin-top: 14px; font-size: var(--step-small); color: var(--muted); }
    .intro { margin-top: 32px; font-size: var(--step-lead); font-weight: 600; line-height: 1.3; letter-spacing: -0.02em; }
    section { margin-top: 56px; }
    h2 { font-size: var(--step-lead); letter-spacing: -0.03em; margin-bottom: 12px; }
    section p + p { margin-top: 12px; }
    .note { margin-top: 72px; padding: 20px 22px; background: var(--surface); font-size: var(--step-small); }
  `,
})
export default class Legal {
  private readonly route = inject(ActivatedRoute);
  private readonly key = toSignal(this.route.data.pipe(map((d) => d['doc'] as string)), { initialValue: 'privacidad' });
  protected readonly doc = computed(() => DOCS[this.key()] ?? DOCS['privacidad']);

  constructor() {
    const d = DOCS[this.route.snapshot.data['doc']] ?? DOCS['privacidad'];
    inject(Title).setTitle(`${d.title} · Nido Fotografía`);
    inject(Meta).updateTag({ name: 'description', content: d.intro.slice(0, 155) });
  }
}
