"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useWorkspaceRecommendation } from "@/hooks/use-workspace-recommendation";
import { useEffect } from "react";
import { use } from "react";

function SuggestionSheet(){

  const { fetchRecommendation, recommendation, loading, error } = useWorkspaceRecommendation();

  useEffect(()=>{
    if(recommendation){
      // Handle the recommendation here, e.g., display it in a modal or alert
      console.log('Recommendation:', recommendation);
    }
  },[recommendation])

    return (
        <Sheet>
              <SheetTrigger asChild>
                <button className="bg-gradient-to-r from-[#c62ef8] via-[#818dd3] to-[#21e3b6] text-transparent bg-clip-text">
                  looking for a coworking spaces?
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Find Coworking Spaces</SheetTitle>
                </SheetHeader>
                <div>
                  <p>Here you can search and filter coworking spaces based on your preferences.</p>
                  {/* Add your search/filter functionality here */}
                  <div className="p-4">
                    <button
                      onClick={() => fetchRecommendation('making zoom call', { charging_plugs: 1, silent: 1, high_internet_speed: 1, low_crowdedness: 1 })}
                      disabled={loading}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      {loading ? 'Loading...' : 'Get Recommendation'}
                    </button>

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {recommendation && (
                      <pre className="mt-4 p-4 rounded whitespace-pre-wrap">{recommendation}</pre>
                    )}
                  </div>

                  {/*bs code to test only */}
                </div>
              </SheetContent>
            </Sheet>
    )
}


export {SuggestionSheet}