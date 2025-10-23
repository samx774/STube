import TrendingVideosSection from "../sections/trending-videos-sections";


export default function TrendingView() {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 pt-2.5 flex flex-col gap-y-6">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Trending</h1>
        <p className="text-xs text-muted-foreground">Most popular videos at the moment</p>
      </div>
      <TrendingVideosSection />
    </div>
  )
}
