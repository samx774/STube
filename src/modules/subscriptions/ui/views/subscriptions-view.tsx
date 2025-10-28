import SubscriptionsSection from "../sections/subscriptions-srction";


export default function SubscriptionsView() {
    return (
        <div className="max-w-screen-md mx-auto mb-10 pt-2.5 flex flex-col px-4 gap-y-6">
            <h1 className="text-2xl font-bold">All Subscriptions</h1>
            <p className="text-xs text-muted-foreground">View and manage all your subscriptions</p>
            <SubscriptionsSection />
        </div>
    )
}
