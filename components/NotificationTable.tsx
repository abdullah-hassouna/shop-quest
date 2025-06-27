import React, { useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from 'next/link'


export default function NotificationTable() {
    return (<>
        <h3 className='mx-2'>Notitfications</h3>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]">Sender</TableHead>
                    <TableHead>Message</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow className='bg-blue-50'>
                    <TableCell className="font-medium">Admin</TableCell>
                    <TableCell>Hello</TableCell>
                </TableRow>
            </TableBody>
        </Table>
        <div className='flex justify-center items-center w-full'>
            <Link className='border-2 rounded-lg px-2.5 py-1.5 w-full mt-4 hover:bg-purple-100 transition-all' href='#'>
                View All Notifications
            </Link>
        </div>
    </>
    )
}
