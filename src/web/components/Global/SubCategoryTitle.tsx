interface SubCategoryTitleProps {
  category: string;
  description: string;
}

const SubCategoryTitle = ({ category, description }: SubCategoryTitleProps) => (
  <div className="mb-6">
    <h2 className="text-3xl font-bold">
      Home Instructions: <span className="text-[#1ccfc9]">{category}</span>
    </h2>
    <p className="text-[#555] mt-2">
      {description}
    </p>
  </div>
);

export default SubCategoryTitle; 