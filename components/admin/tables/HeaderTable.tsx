import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { OrderBy } from "@/types/general"
import { ArrowDown } from "lucide-react"

export const HeaderCell = ({ title, column, orderBy, setOrderBy }: { title: string, column: string, orderBy: OrderBy | null, setOrderBy: Function }) => {

    const changeOrderBy = (column: string) => {
        setOrderBy(orderBy?.sort == "desc" ? null : { order: column, sort: orderBy?.sort === "asc" ? "desc" : "asc" })
    }

    return <Button onClick={() => changeOrderBy(column)} className='space-x-2' variant={"ghost"}>
        <span className="mr-2">{title}</span>
        {orderBy?.order === column && <ArrowDown className={cn("h-4 w-4", { "rotate-180": orderBy?.order === column && orderBy?.sort === "desc" })} />}
    </Button>
}