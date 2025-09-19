import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";

const updates = [
    { id: 1, title: "Major Road Resurfacing Project", date: "Sept 15, 2025", description: "Upcoming work on Main Street affecting traffic for 2 weeks. Detour routes will be posted." },
    { id: 2, title: "New Community Center Grand Opening", date: "Oct 1, 2025", description: "The new Civic Hub is open to the public with a new gymnasium and library." },
    { id: 3, title: "Park Playground Renovation", date: "Sept 10, 2025", description: "Renovation complete at City Park. All new equipment is now available for public use." },
];

const InfrastructureUpdates = () => {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Infrastructure Updates</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px] md:h-[calc(50vh-8rem)]">
                    <div className="space-y-4 pr-4">
                        {updates.map(update => (
                            <Card key={update.id} className="p-4">
                                <CardTitle className="text-base">{update.title}</CardTitle>
                                <CardDescription className="text-sm text-gray-500">{update.date}</CardDescription>
                                <p className="mt-2 text-sm">{update.description}</p>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default InfrastructureUpdates;
