// All shared type definitions for the component system

export interface ComponentProps {
  id?: string;
  className?: string;
  dataSource?: string;
}

export interface PageConfig {
  pageTitle: string;
  metadata?: {
    description?: string;
    keywords?: string[];
  };
  layout: ComponentDefinition[];
  scripts?: string[];
}

export interface HeaderProps extends ComponentProps {
  name?: string;
  subtitle?: string;
  image?: string;
  imageText?: string;
  buttons?: Array<{ text: string; href: string }>;
}

export interface ComponentDefinition {
  component: string;
  props?: Record<string, unknown>;
}

// Generic render function type used by the registry
export type RenderChildren = (defs: ComponentDefinition[], container: HTMLElement) => Promise<void>;
export type RenderFn = (
  props: Record<string, unknown>,
  renderChildren?: RenderChildren
) => Promise<HTMLElement> | HTMLElement;

// Atom props
export interface ButtonProps extends ComponentProps {
  text: string;
  href?: string;
  variant?: 'primary' | 'secondary';
}

export interface ImgProps extends ComponentProps {
  src: string;
  alt: string;
}

export interface BadgeProps extends ComponentProps {
  text: string;
}

export interface IconProps extends ComponentProps {
  icon: string;
  size?: string;
}

// Molecule props
export interface NavLinkProps extends ComponentProps {
  text: string;
  href: string;
}

export interface ProjectCardProps extends ComponentProps {
  title: string;
  image?: string;
  sub_description?: string;
  description?: string;
  category?: string[];
  link?: string;
}

// Container props
export interface NavigationProps extends ComponentProps {
  brand?: string;
  links?: NavLinkProps[];
}

export interface ProjectListProps extends ComponentProps {
  title?: string;
  dataSource: string;
  layout?: 'grid' | 'list';
}
