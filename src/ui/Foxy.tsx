import { foxySVG } from '../content/art';

export function Foxy({ mood = 'happy', size = 140, className = '' }: { mood?: 'happy' | 'sleep' | 'point' | 'surprise' | 'eat'; size?: number; className?: string }) {
  return (
    <div
      className={`foxy ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: foxySVG(mood) }}
      aria-label="Foxy the fox"
      role="img"
    />
  );
}

export function WordImage({ svg, size = 150, label }: { svg: string; size?: number; label?: string }) {
  return (
    <div
      className="word-art"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
      role="img"
      aria-label={label ?? 'picture'}
    />
  );
}
