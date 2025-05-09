interface AuthHeaderProps {
  title: string;
}

export default function AuthHeader({ title }: AuthHeaderProps) {
  return (
    <div className="w-full md:w-1/2 bg-gradient-to-br from-[#1F2668] to-[#22BBCC] text-white">
      <div className="py-6 md:py-8 px-6 md:px-10">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
      </div>
    </div>
  );
} 