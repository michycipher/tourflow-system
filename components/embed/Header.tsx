interface HeaderProps {
  title: string;
  description: string;
}

export default function Header({ title, description }: HeaderProps) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      <div className="h-px bg-border mt-6"></div>
    </div>
  );
}