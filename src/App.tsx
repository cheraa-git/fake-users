import { Form } from './components/Form'
import { UsersTable } from './components/UsersTable'
import { getPage } from './generator'
import { useCallback, useEffect, useRef, useState } from "react"
import { Lang, User } from "./types"
import t from './data/translation.json'
import { LOAD_STEP } from "./constants"


function App() {
  const [seed, setSeed] = useState('1')
  const [lang, setLang] = useState<Lang>('rus')
  const [errors, setErrors] = useState('0')
  const [users, setUsers] = useState<User[]>([])
  let loadedPages = useRef<string[]>([])

  const generatePage = useCallback((start: number, end: number,) => {
    const loadingPage = `${start}:${end}`
    if (!loadedPages.current.includes(loadingPage)) {
      loadedPages.current.push(`${start}:${end}`)
      const currentUsers = getPage(seed, lang, start, end, +errors)
      setUsers(prev => [...prev, ...currentUsers])
    }
  }, [seed, lang, loadedPages, errors])

  useEffect(() => {
    setUsers([])
    loadedPages.current = []
    generatePage(0, LOAD_STEP * 2)
  }, [loadedPages, generatePage])


  return (
    <div>
      <h1 className="bold text-5xl text-center">
        {t["Generate"][lang]} <span className="text-sky-600">{t["demo"][lang]}</span> {t["Users"][lang]}!
      </h1>
      <Form seed={seed} setSeed={setSeed} lang={lang} setLang={setLang} errors={errors} setErrors={setErrors}
            users={users}/>
      <UsersTable users={users} lang={lang} generatePage={generatePage}/>
    </div>
  )
}

export default App

