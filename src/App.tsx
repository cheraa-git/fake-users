import { Form } from './components/Form'

import { UsersTable } from './components/UsersTable/UsersTable'
import { getPage } from './generator'
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Lang, User } from "./types"




export const LOAD_STEP = 10

function App() {

  const [seed, setSeed] = useState('_')
  const [lang, setLang] = useState<Lang>('rus')
  const [startIndex, setStartIndex] = useState(20)
  const [endIndex, setEndIndex] = useState(30)
  const [users, setUsers] = useState<User[]>([])
  let loadedPages = useRef<string[]>([])

  const generatePage = useCallback(() => {
    const loadingPage = `${startIndex}:${endIndex}`
    // console.log('generatePage', loadedPages.current)
    if (!loadedPages.current.includes(loadingPage)) {
      loadedPages.current.push(`${startIndex}:${endIndex}`)
      const currentUsers = getPage(seed, lang, startIndex, endIndex)
      setUsers(prev => [...prev, ...currentUsers])
    }
  }, [seed, lang, startIndex, endIndex, loadedPages])

  const getStatistic = (users: User[]) => {
    const strUsers = users.map(user => user.id + user.name + user.address + user.phone)
    const res = `
  ${users.length} : ${users.length - new Set(strUsers).size}\n
  [${loadedPages.current.join(', ')}]
  `
    return res
  }

  const setPage = (start: number, end: number) => {
    setStartIndex(start)
    setEndIndex(end)
    // console.log('setPage', `${start}:${end}`)
  }
  useMemo(() => {
    // console.log(lang, seed)
    setUsers([])
    setPage(0, LOAD_STEP * 2)
    loadedPages.current = []
    generatePage()
  }, [lang, seed, loadedPages])

  useEffect(() => {
    generatePage()
  }, [generatePage])


  return (
    <div className="" onScroll={(e) => console.log(e)}>
      <h1 className="bold text-5xl text-center">
        Generate <span className="text-sky-600">demo</span> Users!
      </h1>
      <Form seed={seed} setSeed={setSeed} lang={lang} setLang={setLang}/>
      <p className="text-lg font-bold ml-[50vw] w-[400px]">{getStatistic(users)}</p>
      <UsersTable users={users} setPage={setPage}/>
    </div>
  )
}

export default App

