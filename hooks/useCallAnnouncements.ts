import { getLastAnnouncement } from "@/actions/admin/announcements/get-last-announcements";
import { useEffect } from "react";

export const useCallAnnouncements = (addAnnouncement: Function) => {

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const lastAnnouncements = await getLastAnnouncement();
            if (lastAnnouncements && lastAnnouncements.length > 0) {
                addAnnouncement(lastAnnouncements as any);
            }
        }
        fetchAnnouncements();
    }, [])

    return

}
