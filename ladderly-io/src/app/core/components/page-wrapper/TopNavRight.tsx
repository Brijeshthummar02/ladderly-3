import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { api } from '~/trpc/react'
import { IconVerticalChevron } from '../icons/VerticalChevron'
import { MenuContext } from './MenuProvider'
import {
  AccountMenuItems,
  CommunityMenuItems,
  GrowMenuItems,
  TOP_NAV_STANDARD_CLASSES,
} from './TopNavSubmenu'

const TOP_NAV_RIGHT_SECTION_CLASSES = 'ml-auto flex items-center space-x-6'

export const TopNavRight = () => {
  const router = useRouter()
  const searchParams = useSearchParams() ?? new URLSearchParams()
  const currentUserQuery = api.user.getCurrentUser.useQuery()
  const currentUser = currentUserQuery.data
  const { setMenu, openMenuName } = React.useContext(MenuContext)

  useEffect(() => {
    const refreshCurrentUser = searchParams.get('refresh_current_user')

    if (refreshCurrentUser === 'true') {
      // Remove the query parameter and refetch data
      const newQuery = new URLSearchParams(searchParams)
      newQuery.delete('refresh_current_user')
      router.replace(`?${newQuery.toString()}`)

      // Refetch the current user
      void currentUserQuery.refetch()
    }
  }, [searchParams, currentUserQuery, router])

  const handleAccountClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (openMenuName === 'account') {
      setMenu?.(null, '')
    } else if (currentUser) {
      setMenu?.(
        <AccountMenuItems userId={currentUser.id.toString()} />,
        'account',
      )
    }
  }

  const handleCommunityClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (openMenuName === 'community') {
      setMenu?.(null, '')
    } else {
      setMenu?.(<CommunityMenuItems />, 'community')
    }
  }

  const handleGrowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (openMenuName === 'grow') {
      setMenu?.(null, '')
    } else {
      setMenu?.(<GrowMenuItems />, 'grow')
    }
  }

  return (
    <div className={TOP_NAV_RIGHT_SECTION_CLASSES}>
      <Link href="/perks" className={TOP_NAV_STANDARD_CLASSES}>
        Perks
      </Link>
      <Link href="/blog/2025-05-03-faq" className={TOP_NAV_STANDARD_CLASSES}>
        FAQ
      </Link>
      <button onClick={handleGrowClick} className={TOP_NAV_STANDARD_CLASSES}>
        Grow
        <IconVerticalChevron isPointingUp={openMenuName === 'grow'} />
      </button>
      <button
        onClick={handleCommunityClick}
        className={TOP_NAV_STANDARD_CLASSES}
      >
        Community
        <IconVerticalChevron isPointingUp={openMenuName === 'community'} />
      </button>
      {currentUser ? (
        <button
          onClick={handleAccountClick}
          className={TOP_NAV_STANDARD_CLASSES}
        >
          Account
          <IconVerticalChevron isPointingUp={openMenuName === 'account'} />
        </button>
      ) : (
        <>
          <Link className={TOP_NAV_STANDARD_CLASSES} href="/login">
            Log In
          </Link>
          <Link className={TOP_NAV_STANDARD_CLASSES} href="/signup">
            Create Account
          </Link>
        </>
      )}
    </div>
  )
}

export const TopNavRightSkeleton = () => (
  <div className={TOP_NAV_RIGHT_SECTION_CLASSES}>
    <Link href="/perks" className={TOP_NAV_STANDARD_CLASSES}>
      Perks
    </Link>
    <Link href="/blog" className={TOP_NAV_STANDARD_CLASSES}>
      Blog
    </Link>
  </div>
)
