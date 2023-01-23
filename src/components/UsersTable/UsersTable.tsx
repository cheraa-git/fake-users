import './UsersTable.css'
import { FC, useRef } from "react"
import { User } from "../../types"
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'

interface UsersTableProps {
  users: User[]
  setPage: (start: number, end: number) => void
}

const round = (n: number) => {
  return Math.round(n / 10) * 10
}

export const UsersTable: FC<UsersTableProps> = ({ users, setPage }) => {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const loadUsers = (startIndex: number, stopIndex: number) => {
    startIndex = round(startIndex) + 20

    if (stopIndex >= users.length - 2 ) {
      setPage(round(startIndex), round(startIndex) + 10)
      // console.log('SET_PAGE', round(startIndex), round(startIndex) + 10, '-', stopIndex)
    }
  }

  const Row = ({ index, style }: ListChildComponentProps) => {
    const user = users[index]
    return (
      <div className="grid grid-cols-10 gap-3 items-center border-b justify-center" style={style}>
        <div className="col-span-1 text-center">{index + 1}</div>
        <div className="col-span-2">{user.name}</div>
        <div className="col-span-3">{user.address}</div>
        <div className="col-span-2 text-center">{user.phone}</div>
        <div className="col-span-2 text-center">{user.id}</div>
      </div>
    )
  }

  const isItemLoaded = () => {
    return false
  }


  return (
    <div className="border border-sky-600 mx-[10%] rounded mb-5 min-w-[700px]" ref={tableContainerRef}>
      <div className="grid grid-cols-10 bg-sky-600 text-white items-center h-8">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-2 text-center">Name</div>
        <div className="col-span-3 text-center">Address</div>
        <div className="col-span-2 text-center">Phone</div>
        <div className="col-span-2 text-center">ID</div>
      </div>

      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={users.length}
        loadMoreItems={loadUsers}
      >
        {({ onItemsRendered, ref }) => (
          <FixedSizeList
            itemCount={users.length}
            onItemsRendered={onItemsRendered}
            ref={ref}
            height={500}
            width={tableContainerRef.current?.offsetWidth || 700}
            itemSize={100}>
            {Row}
          </FixedSizeList>
        )}
      </InfiniteLoader>

    </div>
  )
}
