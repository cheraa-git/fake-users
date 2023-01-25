import { FC, useRef, useState } from "react"
import { Lang, User } from "../types"
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import t from '../data/translation.json'
import { LOAD_STEP } from "../constants"


interface UsersTableProps {
  users: User[]
  lang: Lang,
  generatePage: (start: number, end: number) => void
}

const round10 = (n: number) => {
  return Math.round(n / 10) * 10
}

export const UsersTable: FC<UsersTableProps> = ({ users, lang, generatePage }) => {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const [usersLength, setUsersLength] = useState(users.length)

  const loadUsers = (startIndex: number, stopIndex: number) => {
    startIndex = round10(startIndex) + (LOAD_STEP * 2)
    setUsersLength(users.length)
    if (stopIndex >= users.length - 2) {
      generatePage(startIndex, round10(startIndex) + LOAD_STEP)
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
        <div className="col-span-2 text-center">{t["Name"][lang]}</div>
        <div className="col-span-3 text-center">{t["Address"][lang]}</div>
        <div className="col-span-2 text-center">{t["Phone"][lang]}</div>
        <div className="col-span-2 text-center">ID</div>
      </div>

      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={usersLength < 40 ? 40 : usersLength}
        loadMoreItems={loadUsers}
      >
        {({ onItemsRendered, ref }) => (
          <FixedSizeList
            itemCount={users.length}
            onItemsRendered={onItemsRendered}
            ref={ref}
            height={700}
            width={tableContainerRef.current?.offsetWidth || 700}
            itemSize={100}>
            {Row}
          </FixedSizeList>
        )}
      </InfiniteLoader>

    </div>
  )
}
