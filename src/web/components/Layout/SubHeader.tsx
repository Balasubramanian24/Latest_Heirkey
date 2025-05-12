interface SubHeaderProps {
  title: string;
}

export default function SubHeader({ title }: SubHeaderProps) {
  return (
    <div className="w-full bg-gradient-to-br from-[#1F2668] to-[#22BBCC] text-white">
      <div className="max-w-7xl mx-auto py-6 px-8">
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
    </div>
  );
} 