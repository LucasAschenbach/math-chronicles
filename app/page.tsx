import timelineItems from "../content/timeline.json";
import { Timeline } from "../components/Timeline";
import type { TimelineItem } from "../components/Timeline";

export default function Home() {
  const items = timelineItems as TimelineItem[];
  return (
    <div className="py-4">
      <Timeline items={items} />
    </div>
  );
}

