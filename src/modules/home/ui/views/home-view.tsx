import CategoriesSection from "../sections/categories-section";
import HomeVideosSection from "../sections/home-videos-sections";

interface HomeViewProps {
  categoryId?: string;
}

export default function HomeView({ categoryId }: HomeViewProps) {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 pt-2.5 flex flex-col gap-y-6">
      <div className="px-4">
        <CategoriesSection categoryId={categoryId} />
      </div>
      <HomeVideosSection categoryId={categoryId} />
    </div>
  )
}
