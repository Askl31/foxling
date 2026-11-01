import { foxySVG } from '../content/art';
import { playTapSound } from '../speech/sfx';

export function Foxy({
  mood = 'happy',
  size = 140,
  className = '',
  onClick,
  isSpeaking = false,
  interactive = false,
}: {
  mood?: 'happy' | 'sleep' | 'point' | 'surprise' | 'eat';
  size?: number;
  className?: string;
  onClick?: () => void;
  isSpeaking?: boolean;
  interactive?: boolean;
}) {
  const handleClick = () => {
    if (onClick) {
      playTapSound();
      onClick();
    }
  };

  return (
    <div
      className={`foxy mood-${mood} ${isSpeaking ? 'foxy-talking' : ''} ${interactive || onClick ? 'foxy-interactive' : ''} ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: foxySVG(mood) }}
      aria-label={`Foxy the fox (${mood})`}
      role="img"
      onClick={onClick ? handleClick : undefined}
      tabIndex={onClick ? 0 : undefined}
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
