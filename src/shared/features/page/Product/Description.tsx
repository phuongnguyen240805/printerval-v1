import { Button } from "@/shared/ui/button"
import { useState } from "react"

const Description = ({ description }: { description: string }) => {
    const [show, setShow] = useState(false)
    return (
        <div className="px-2">
            <h3 className="font-bold text-base sm:text-lg">Product Description</h3>
            <div className={`${show ? "" : "line-clamp-1"}`}>
                <pre className="text-xs sm:text-sm whitespace-pre-wrap break-words bg-white rounded shadow-sm">
                    {description}
                </pre>

            </div>
            {/* Button Show more */}
            <Button
                onClick={() => setShow(!show)}
                className="my-2 sm:my-3 border-2 border-orange-500 bg-transperent flex text-orange-500 mx-auto hover:border-black hover:bg-transperent hover:text-black w-28 sm:w-32 text-xs sm:text-sm"
            >
                {show ? "Show Less" : "Show More"}
            </Button>
        </div>
    )
}
export default Description