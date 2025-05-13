import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CategoryConfirmCardProps = {
  onStart: () => void;
  onBack: () => void;
  categoryLabel?: string;
};

const CategoryConfirmCard: React.FC<CategoryConfirmCardProps> = ({
  onStart,
  onBack,
  categoryLabel = "Selected Category",
}) => {
  return (
    <>
    <div className="max-w-md mx-auto space-y-4 px-4">
    <Card className="shadow-md bg-gray-200 rounded-xl mt-4">
      <CardContent className="pt-6 px-6 pb-4 space-y-3">
        <h2 className="text-base font-semibold text-purple-700">
          How to Add Your Information
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Now, you are about to enter details about your home, life, and essential information to be passed on to your family members. Each section has several questions. Fill out as much as you can/like. You can always come back to fill out more information later.
        </p>

        <hr className="border-t border-black mt-4" />
      </CardContent>
    </Card>

      <div className="space-y-2">
        <Button
          className="w-full h-3 bg-[#2BCFD5] hover:bg-[#25b6bb] text-white text-lg font-semibold rounded-lg py-6 transition-colors"
          onClick={onStart}
        >
          Get Started with "{categoryLabel}"
        </Button>

        <Button
          variant="outline"
          className="w-full h-12 bg-white text-black border-2 border-gray-300 flex items-center justify-center text-lg font-semibold rounded-lg py-2"
          onClick={onBack}
        >
          Back to All Categories
        </Button>
      </div>
    </div>
    </>
  );
};

export default CategoryConfirmCard;
