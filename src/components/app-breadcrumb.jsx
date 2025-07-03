import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useLocation, Link } from 'react-router-dom'

export function AppBreadcrumb() {
    const location = useLocation()
    const paths = location.pathname.split('/').filter(Boolean)
    
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {paths.map((path, index) => {
                    const href = '/' + paths.slice(0, index + 1).join('/')
                    const isLast = index === paths.length - 1

                    return (
                        <>
                            <BreadcrumbSeparator key={`sep-${index}`} />
                            <BreadcrumbItem key={href}>
                                {isLast ? (
                                    <BreadcrumbPage>{formatLabel(path)}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link to={href}>{formatLabel(path)}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

function formatLabel(path) {
    return path
        .replace(/-/g, ' ')
        .toUpperCase()
}