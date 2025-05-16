// components/dashboard/CategoryCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryCardProps {
  name: string;
  description: string;
  imageUrl: string;
  questionCount: number;
  totalQuestions?: number; // Make it optional for backward compatibility
  isCompleted: boolean;
  index: number;
  onClick: () => void;
}

export default function CategoryCard({
  name,
  description,
  imageUrl,
  questionCount,
  totalQuestions = 0, // Default to 0 if not provided
  isCompleted,
  index,
  onClick,
}: CategoryCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className="cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="overflow-hidden rounded-xl shadow">
        <div className="relative h-32 sm:h-40">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
          {isCompleted && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="default" className="flex items-center gap-1 bg-green-500 text-white">
                <CheckCircle className="h-4 w-4" />
                Completed
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-secondary-900">
              {name}
            </h3>
            <span className="text-xs text-primary">{questionCount}/{totalQuestions} Qs</span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
