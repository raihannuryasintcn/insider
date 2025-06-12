import { Map, Home, Download, Search, UserRound, ChevronUp, Users, ScrollText } from "lucide-react" // Added Users and ScrollText icons

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
import { useAuth } from "@/components/Auth" // Import the useAuth hook to access authentication context


// Menu items.
const dashboard = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    }
]

const powerbi = [
    {
        title: "TR1",
        url: "/tr-1",
        icon: Map,
    },
    {
        title: "TR2",
        url: "/tr-2",
        icon: Map,
    },
    {
        title: "TR3",
        url: "/tr-3",
        icon: Map,
    },
    {
        title: "TR4",
        url: "/tr-4",
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
        title: "User Management",
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

    const handleSignOut = () => {
        logout();
        navigate("/login");
    };
    return (
        <Sidebar>
            <SidebarHeader className={"bg-white p-4"}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-2">
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
                            {dashboard.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Power BI</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {powerbi.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>

                    <SidebarGroupLabel>Tools Lainnya</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {danlainlain.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {user?.role === 'administrator' && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {adminLinks.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link to={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>
            <SidebarFooter className={"bg-white"}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton>
                            <UserRound /> {user?.username || 'Guest'}
                            <ChevronUp className="ml-auto" />
                        </SidebarMenuButton>
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