import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { CreateOrganization, SignIn, useAuth, useUser, useOrganizationList } from '@clerk/clerk-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWorkspaces } from '../features/workspaceSlice'
import { loadTheme } from '../features/themeSlice'
import { Loader2Icon } from 'lucide-react'

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { user, isLoaded: isUserLoaded } = useUser()
    const { isLoaded: isOrgLoaded, userMemberships } = useOrganizationList({ userMemberships: true })
    const { workspaces, loading } = useSelector((state) => state.workspace)
    const { getToken } = useAuth()
    const dispatch = useDispatch()

    // Initial load of theme
    useEffect(() => {
        dispatch(loadTheme())
    }, [dispatch])

    // Initial load of workspaces when user is authenticated
    useEffect(() => {
        if (isUserLoaded && user && workspaces.length === 0) {
            dispatch(fetchWorkspaces({ getToken }))
        }
    }, [user, isUserLoaded, dispatch, getToken, workspaces.length])

    // Sync workspaces when organization memberships change (e.g. after creating an organization)
    useEffect(() => {
        if (isOrgLoaded && userMemberships?.data?.length > 0 && workspaces.length === 0) {
            dispatch(fetchWorkspaces({ getToken }))
        }
    }, [isOrgLoaded, userMemberships?.data?.length, dispatch, getToken, workspaces.length])

    // 1. Wait until Clerk has finished loading state before rendering
    if (!isUserLoaded || (user && !isOrgLoaded)) {
        return (
            <div className='flex items-center justify-center h-screen bg-white dark:bg-zinc-950'>
                <Loader2Icon className="size-7 text-blue-500 animate-spin" />
            </div>
        )
    }

    // 2. Unauthenticated users must see Register / Login page first
    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen bg-white dark:bg-zinc-950">
                <SignIn />
            </div>
        )
    }

    // 3. Show loader while fetching user's workspaces
    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen bg-white dark:bg-zinc-950'>
                <Loader2Icon className="size-7 text-blue-500 animate-spin" />
            </div>
        )
    }

    // 4. Authenticated users without an organization must see Create Organization page
    const hasOrgInClerk = userMemberships?.data && userMemberships.data.length > 0
    const hasWorkspace = workspaces && workspaces.length > 0

    if (!hasOrgInClerk && !hasWorkspace) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <CreateOrganization 
                    afterCreateOrganizationUrl="/" 
                    skipInvitationScreen={true} 
                />
            </div>
        )
    }

    return (
        <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col h-screen">
                <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-scroll">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout
