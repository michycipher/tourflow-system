import { Tour } from "@/types/embed";

interface TourSelectorProps {
  tours: Tour[];
  selectedTour: Tour;
  onSelectTour: (tour: Tour) => void;
}

export default function TourSelector({ tours, selectedTour, onSelectTour }: TourSelectorProps) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-white mb-4">Select Tour</h2>
      <div className="space-y-3">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
              selectedTour.id === tour.id
                ? "border-purple-500/50 bg-purple-500/10"
                : "border-slate-800 hover:bg-slate-900/50"
            }`}
            onClick={() => onSelectTour(tour)}
          >
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                  selectedTour.id === tour.id
                    ? "border-purple-400 bg-purple-400"
                    : "border-slate-600"
                }`}
              >
                {selectedTour.id === tour.id && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="font-medium text-white">{tour.title}</span>
            </div>
            <div className="text-slate-400 text-sm">{tour.steps} steps</div>
          </div>
        ))}
      </div>
    </div>
  );
}