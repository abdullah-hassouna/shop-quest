"use server"

import getUserSession from '@/actions/auth/regisreation/get-user-session';
import { Button } from "@/components/ui/button"
import {
    Bell,
    Menu,
    Package2,
    X,
} from "lucide-react"
import Link from 'next/link';
import { NavigationContent } from '@/components/admin/sidebar';
import { redirect } from 'next/navigation';
import { RedirectType } from 'next/navigation';


interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    function redirectUnauthedUser() {
        redirect('/', RedirectType.replace);
    }

    const getCurrentUserRole = async () => {
        try {
            const { success, sessionExpired, userData } = await getUserSession();

            if (!success || sessionExpired || !userData) {
                redirectUnauthedUser()
                return;
            }

            if (!userData.role.startsWith('ADMIN')) {
                redirectUnauthedUser()
                return;
            }

        } catch (error) {
            console.error("Error fetching user session:", error);
            redirectUnauthedUser()
        }
    };

    getCurrentUserRole();


    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden relative overflow-hidden border-r bg-muted/40 md:block">
                <div className="flex fixed w-70 h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span>Admin UI</span>
                        </Link>
                        <Button
                            variant="outline"
                            size="icon"
                            className="ml-auto h-8 w-8 bg-transparent"
                        >
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </div>

                    <div className="flex-1 overflow-auto py-2">
                        <NavigationContent />
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="relative flex h-14 items-center gap-4 border-b bg-muted/40 px-4 md:hidden lg:h-[60px] lg:px-6">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                    >
                        <details className="group">
                            <summary className="cursor-pointer flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors select-none">
                                <Menu />
                            </summary>

                            <div className="border-b bg-background shadow-lg md:hidden absolute z-[999] h-[95vh] left-0 top-14">
                                <div className="p-4">
                                    <NavigationContent />
                                </div>
                            </div>
                        </details>
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>

                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Package2 className="h-6 w-6" />
                        <span>Admin UI</span>
                    </Link>

                    <Button
                        variant="outline"
                        size="icon"
                        className="ml-auto h-8 w-8"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Toggle notifications</span>
                    </Button>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;