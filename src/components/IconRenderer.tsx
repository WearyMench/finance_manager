import React from 'react';
import {
  Briefcase,
  Laptop,
  TrendingUp,
  Wallet,
  ShoppingCart,
  Car,
  Home,
  Film,
  Heart,
  BookOpen,
  Shirt,
  Package,
  Plus,
  DollarSign,
  Target,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone,
  TrendingDown,
  Edit,
  Trash2,
  Tag,
  Palette,
  Save,
  X,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Music,
  Trophy,
  Star,
  Flame,
  Settings
} from 'lucide-react';

interface IconRendererProps {
  iconName: string;
  className?: string;
  size?: number;
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Briefcase,
  Laptop,
  TrendingUp,
  Wallet,
  ShoppingCart,
  Car,
  Home,
  Film,
  Heart,
  BookOpen,
  Shirt,
  Package,
  Plus,
  DollarSign,
  Target,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone,
  TrendingDown,
  Edit,
  Trash2,
  Tag,
  Palette,
  Save,
  X,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Music,
  Trophy,
  Star,
  Flame,
  Settings
};

export default function IconRenderer({ iconName, className = '', size = 20 }: IconRendererProps) {
  const IconComponent = iconMap[iconName] || Package; // Fallback to Package icon
  
  return <IconComponent className={className} size={size} />;
}
