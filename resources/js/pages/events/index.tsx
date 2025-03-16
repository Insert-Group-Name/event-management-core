import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <div>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>Events View</div>
            </div>
        </div>
    );
}
