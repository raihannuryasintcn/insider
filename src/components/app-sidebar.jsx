import { Map, Download, Search, UserRound, ChevronUp, Users, ScrollText, ChartNoAxesCombined, Funnel, Info, LandPlot, Speech } from "lucide-react" // Added Users and ScrollText icons
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
const market = [
    {
        title: "ISP Nasional",
        url: "/",
        icon: LandPlot,
    },
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
    },
    {
        title: "List ISP",
        url: "/list-isp",
        icon: Search,
    },
    {
        title: "Download",
        url: "/download",
        icon: Download,
    },
]

const funnel = [
    {
        title: "Description",
        url: "/funnel-desc",
        icon: Funnel,
    },
    {
        title: "Funnel",
        url: "/funnel",
        icon: ChartNoAxesCombined,
    }

]

const faq = [
    {
        title: "FAQ",
        url: "/faq",
        icon: Speech,
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

const aboutUs = [
    {
        title: "About Us",
        url: "/about-us",
        icon: Info,
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
                        <div className="flex items-center justify-center gap-1">
                            <img width={"33px"} src="insider-icon.svg" alt="" />
                            <img width={"90px"} src="insider-text.svg" alt="" />
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className={"bg-white"}>
                <SidebarGroup>
                    <SidebarGroupLabel>Market</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {market.map((item) => {
                                const isActive = location.pathname === item.url;
                                const withExtraPadding = ["TR1", "TR2","TR3","TR4"].includes(item.title);

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link
                                                to={item.url}
                                                className={withExtraPadding ? "pl-6" : ""}
                                            >
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
                    <SidebarGroupLabel>Sales Funnel</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {funnel.map((item) => {
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

                    <SidebarGroupLabel>FAQ</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenu>
                                {faq.map((item) => {
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
                <SidebarGroup>

                    <SidebarGroupLabel>About Us</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenu>
                                {aboutUs.map((item) => {
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
                        <SidebarGroupLabel>Others</SidebarGroupLabel>
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