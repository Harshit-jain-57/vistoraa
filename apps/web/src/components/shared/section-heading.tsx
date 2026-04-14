import { Pill } from '../ui/pill';

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl space-y-4">
      <Pill>{eyebrow}</Pill>
      <div className="space-y-3">
        <h2 className="display-font text-4xl font-semibold leading-tight text-[var(--text-dark)] sm:text-5xl">
          {title}
        </h2>
        <p className="text-base leading-7 text-[var(--text-muted)]">{description}</p>
      </div>
    </div>
  );
}
