import SubscribedVideosSection from "../sections/subscribed-videos-sections";


export default function SubscribedView() {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 pt-2.5 flex flex-col gap-y-6">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Subscribed</h1>
        <p className="text-xs text-muted-foreground">Videos from your favorite creators</p>
      </div>
      <SubscribedVideosSection />
    </div>
  )
}
