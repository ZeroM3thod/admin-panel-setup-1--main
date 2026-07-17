import {
  Square,
  Sparkles,
  Boxes,
  MousePointerClick,
  LayoutGrid,
  Type,
  Image as ImageIcon,
  Layers,
  Zap,
  Star,
  Heart,
  Bell,
  Tag,
  Table,
  FormInput,
  ToggleLeft,
  Sliders,
  Menu,
  PanelsTopLeft,
  Loader,
  Move,
  Palette,
  Code2,
  type LucideIcon,
} from "lucide-react"

export const ASSET_ICONS: Record<string, LucideIcon> = {
  Square,
  Sparkles,
  Boxes,
  MousePointerClick,
  LayoutGrid,
  Type,
  ImageIcon,
  Layers,
  Zap,
  Star,
  Heart,
  Bell,
  Tag,
  Table,
  FormInput,
  ToggleLeft,
  Sliders,
  Menu,
  PanelsTopLeft,
  Loader,
  Move,
  Palette,
  Code2,
}

export const ASSET_ICON_NAMES = Object.keys(ASSET_ICONS)

export function AssetIcon({ name, ...props }: { name: string } & React.ComponentProps<LucideIcon>) {
  const Icon = ASSET_ICONS[name] ?? Code2
  return <Icon {...props} />
}
