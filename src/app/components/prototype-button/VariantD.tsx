import type { CSSProperties, FC, ReactNode } from 'react';
import { IconArrowUpRight, IconBrandGithub } from '../ui/icons';
import { ContactSendCurrent, ContactSendD } from './ContactSend';
import { Matrix, type ProtoButtonProps, type ProtoIcon } from './Matrix';
import { DFrame } from './VariantDBase';

/* PROTOTYPE (button spec) — Variant D: variant C's frost glass at the
   site's sharp-corner shape. Same glass language (translucent fill +
   hairline border, gold primary / neutral secondary) with square corners,
   40ms press snap, and a theme-native loader: three dots in a discrete
   steps() chase (the plan-marker / dev-caret idiom) instead of a generic
   spinner — no face overlay motion on loading.
   Tokens + frame live in VariantDBase (shared with the contact send
   exhibit); this file keeps D's content layer (matrix loader logic) and
   the exhibit sections. Below the matrix: the contact send button, the
   page's deliberate exception — shipped skin vs this variant's sharp
   glass over the same send-plane choreography (see ContactSend). Loading
   rows run pinned. */

const PROTO_ICONS: Record<ProtoIcon, FC<{ size?: number }>> = {
  'arrow-up-right': IconArrowUpRight,
  'brand-github': IconBrandGithub,
};

/* Loader: one shared timeline, four dots. Each dot carries its own
   (ax, ay) = its starting corner and (bx, by) = the next corner clockwise,
   so a single keyframes drives the whole sequence:
   sit collapsed at center → burst to corners → slide one corner clockwise
   while morphing square→circle → collapse back to center keeping circles
   → morph circle→square at center → hold → loop.
   Takes the button's currentColor, so primary reads gold and secondary
   reads label-white. */
const CORNERS_UNIT: Array<[number, number, number, number]> = [
  [-1, -1, 1, -1], // tl → tr
  [1, -1, 1, 1], // tr → br
  [1, 1, -1, 1], // br → bl
  [-1, 1, -1, -1], // bl → tl
];
const dotStyle = (
  [ax, ay, bx, by]: (typeof CORNERS_UNIT)[number],
  offset: number,
  drop1: number,
  drop2: number,
): CSSProperties =>
  ({
    '--ax': `${ax * offset}px`,
    '--ay': `${ay * offset}px`,
    '--bx': `${bx * offset}px`,
    '--by': `${by * offset}px`,
    '--drop1': `${drop1}px`,
    '--drop2': `${drop2}px`,
  }) as CSSProperties;

const Loader: FC<{ margin?: 2 | 3 }> = ({ margin = 3 }) => {
  /* 20px box, 4px dots (2px half-size): margin 3 → ±5px (14×14),
     margin 2 → ±6px (16×16). */
  const offset = margin === 2 ? 6 : 5;
  const drop1 = margin === 2 ? 6 : 5;
  const drop2 = margin === 2 ? 3.5 : 3;
  return (
    <span aria-hidden="true" className="relative block size-5 shrink-0">
      {CORNERS_UNIT.map((corner) => (
        <span
          key={corner.join(',')}
          className="proto-morph-dot absolute top-1/2 left-1/2 -mt-[2px] -ml-[2px] size-1 bg-current"
          style={dotStyle(corner, offset, drop1, drop2)}
        />
      ))}
    </span>
  );
};

const Button: FC<ProtoButtonProps> = ({
  variant = 'primary',
  size = 'md',
  label,
  icon,
  iconPosition = 'trailing',
  iconOnly,
  loading,
  disabled,
  loaderMargin = 3,
}) => {
  const Icon = icon ? PROTO_ICONS[icon] : null;
  /* Content layer only — the root (cursor, aria-busy, press snap, shape)
     is DFrame; icon-only re-addresses the frame's size to its square. */
  const content = iconOnly ? (
    icon ? (
      <>
        {loading ? <Loader margin={loaderMargin} /> : Icon !== null && <Icon size={20} />}
        <span className="sr-only">{label}</span>
      </>
    ) : (
      label
    )
  ) : (
    <>
      {/* Loader takes over the icon's own slot — it sits where the icon
          would sit (leading → before text, trailing → after text), so the
          layout never shifts when loading starts. */}
      {iconPosition === 'leading' &&
        (loading ? <Loader margin={loaderMargin} /> : Icon !== null && <Icon size={20} />)}
      <span>{label}</span>
      {iconPosition === 'trailing' &&
        (loading ? (
          <Loader margin={loaderMargin} />
        ) : (
          Icon !== null && <Icon size={20} aria-hidden="true" />
        ))}
    </>
  );

  return (
    <DFrame
      variant={variant}
      size={iconOnly ? `icon-${size}` : size}
      loading={loading}
      disabled={disabled}
    >
      {content}
    </DFrame>
  );
};

const Row: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <div className="flex flex-wrap items-center gap-4">
    <span className="w-24 shrink-0 text-xs font-medium tracking-widest text-white/40 uppercase">
      {title}
    </span>
    {children}
  </div>
);

const Cell: FC<{ caption: string; children: ReactNode }> = ({ caption, children }) => (
  <div className="flex flex-col gap-2">
    {children}
    <span className="text-xs tracking-widest text-white/40">{caption}</span>
  </div>
);

const SendPair: FC<{ loading?: boolean }> = ({ loading = false }) => (
  <>
    <Cell caption="Shipped">
      <ContactSendCurrent loading={loading} />
    </Cell>
    <Cell caption="D sharp glass">
      <ContactSendD loading={loading} />
    </Cell>
  </>
);

export const VariantD = () => (
  <>
    <Matrix button={Button} />

    {/* The contact send button's comparison exhibit, heading the exception
        note on the page: the shipped flat-gold frame against its sharp-glass
        re-skin, both carrying the same send-plane loading choreography and
        the purple 3s cancel-window bar. Pinned rows loop that bar (see
        .proto-send-progress in globals.css) so the sweep never freezes at
        full width; production's one-shot is untouched. Labels are hardcoded
        English like the matrix's — the prototype route carries no dict. */}
    <section className="flex flex-col gap-4">
      <h3 className="text-gold text-sm tracking-widest uppercase">Contact — exception</h3>
      <Row title="Idle">
        <SendPair />
      </Row>
      <Row title="Loading">
        <SendPair loading />
      </Row>
    </section>
  </>
);
