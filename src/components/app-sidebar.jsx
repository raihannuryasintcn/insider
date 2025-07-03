import { Map, Home, Download, Search, UserRound, ChevronUp, Users, ScrollText, ChartNoAxesCombined } from "lucide-react" // Added Users and ScrollText icons
import { useLocation } from "react-router-dom";


import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuButtonFooter,
} from "@/components/ui/sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/auth/Auth" // Import the useAuth hook to access authentication context


// Menu items.
const dashboard = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Funnel",
        url: "/funnel",
        icon: ChartNoAxesCombined,
    }
]

const powerbi = [
    {
        title: "TR1",
        url: "/tr1",
        icon: Map,
    },
    {
        title: "TR2",
        url: "/tr2",
        icon: Map,
    },
    {
        title: "TR3",
        url: "/tr3",
        icon: Map,
    },
    {
        title: "TR4",
        url: "/tr4",
        icon: Map,
    }
]

const danlainlain = [
    {
        title: "List ISP",
        url: "/list-isp",
        icon: Search,
    },
    {
        title: "Download",
        url: "/download",
        icon: Download,
    }
]

const adminLinks = [
    {
        title: "Manage Users",
        url: "/user-management",
        icon: Users,
    },
    {
        title: "Activity Logs",
        url: "/activity-logs",
        icon: ScrollText,
    }
]


export function AppSidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();


    const handleSignOut = () => {
        logout();
        navigate("/login");
    };
    return (
        <Sidebar>
            <SidebarHeader className={"bg-white p-4"}>
                <SidebarMenu>
                    <SidebarMenuItem className=" border-b-2 py-2">
                        <div className="flex items-center justify-center gap-2">
                            <img width={"25px"} src="favicon.ico" alt="" />
                            <img width={"90px"} src="insider-text.svg" alt="" />
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className={"bg-white"}>
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {dashboard.map((item) => {
                                const isActive = location.pathname === item.url;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link to={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Power BI</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {powerbi.map((item) => {
                                const isActive = location.pathname === item.url;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link to={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>

                    <SidebarGroupLabel>Tools Lainnya</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenu>
                                {danlainlain.map((item) => {
                                    const isActive = location.pathname === item.url;

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={isActive}>
                                                <Link to={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {user?.role === 'administrator' && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {adminLinks.map((item) => {
                                    const isActive = location.pathname === item.url;

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={isActive}>
                                                <Link to={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>
            <SidebarFooter className={"bg-white"}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButtonFooter>
                            <UserRound /> {user?.username || 'Guest'}
                            <ChevronUp className="ml-auto" />
                        </SidebarMenuButtonFooter>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="top"
                        className="w-[--radix-popper-anchor-width]"
                    >
                        <DropdownMenuItem>
                            <button
                                onClick={handleSignOut}
                                className="w-full text-left "
                            >
                                Sign Out
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    )
}