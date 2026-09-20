import { cn } from '@/lib/utils';
import themePaperImg from '@/assets/theme-paper.webp';
import themeMidnightImg from '@/assets/theme-midnight.webp';
import themePastelImg from '@/assets/theme-pastel.webp';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  fgColor: string;
  bgColor: string;
  bgGradient?: string;
  image: string;
}

export const themePresets: ThemePreset[] = [
  {
    id: 'paper',
    name: 'Paper',
    description: 'Soft, minimal',
    fgColor: '#3d3225',
    bgColor: '#faf6f0',
    bgGradient: `
      radial-gradient(ellipse at 0% 0%, #f5ede3 0%, transparent 50%),
      radial-gradient(ellipse at 100% 0%, #ebe4d8 0%, transparent 50%),
      radial-gradient(ellipse at 100% 100%, #f0e6d6 0%, transparent 50%),
      radial-gradient(ellipse at 0% 100%, #faf6f0 0%, transparent 50%),
      linear-gradient(135deg, #faf6f0 0%, #f5ede3 100%)
    `.replace(/\s+/g, ' ').trim(),
    image: themePaperImg,
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark, high contrast',
    fgColor: '#ffffff',
    bgColor: '#1e293b',
    bgGradient: `
      radial-gradient(ellipse at 0% 0%, #334155 0%, transparent 50%),
      radial-gradient(ellipse at 100% 50%, #1e3a5f 0%, transparent 50%),
      radial-gradient(ellipse at 50% 100%, #312e81 0%, transparent 50%),
      radial-gradient(ellipse at 0% 80%, #1e293b 0%, transparent 40%),
      linear-gradient(160deg, #0f172a 0%, #020617 100%)
    `.replace(/\s+/g, ' ').trim(),
    image: themeMidnightImg,
  },
  {
    id: 'pastel',
    name: 'Pastel',
    description: 'Soft, dreamy',
    fgColor: '#9f6b6b',
    bgColor: '#fdf6f3',
    bgGradient: `
      radial-gradient(ellipse at 0% 0%, #fce7f3 0%, transparent 50%),
      radial-gradient(ellipse at 100% 0%, #e9d5ff 0%, transparent 50%),
      radial-gradient(ellipse at 100% 100%, #fbcfe8 0%, transparent 50%),
      radial-gradient(ellipse at 0% 100%, #fdf6f3 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, #f5d0fe 0%, transparent 60%),
      linear-gradient(135deg, #fdf6f3 0%, #fce7f3 100%)
    `.replace(/\s+/g, ' ').trim(),
    image: themePastelImg,
  },
];

interface ThemePresetsProps {
  selectedTheme: string;
  onThemeChange: (theme: ThemePreset) => void;
}

export function ThemePresets({ selectedTheme, onThemeChange }: ThemePresetsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {themePresets.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onThemeChange(theme)}
          className={cn(
            "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200 border",
            selectedTheme === theme.id
              ? "gradient-border-selected"
              : "border-[#E5E5E5] bg-white hover:bg-[#F5F5F5]/50"
          )}
        >
          <img 
            src={theme.image} 
            alt={theme.name}
            className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
            width={40}
            height={40}
            loading="lazy"
            decoding="async"
          />
          <p className="text-xs font-medium text-foreground">
            {theme.name}
          </p>
        </button>
      ))}
    </div>
  );
}