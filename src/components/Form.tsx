import { FC } from "react"
import { MenuItem, Select, Slider, TextField, Tooltip } from "@mui/material"
import { Lang, User } from "../types"
import t from '../data/translation.json'
import { CSVLink } from "react-csv"
import GlobeIcon from '../assets/globe.svg'


interface FormProps {
  seed: string
  setSeed: (seed: string) => void,
  lang: Lang
  setLang: (lang: Lang) => void
  errors: string
  setErrors: (n: string) => void
  users: User[]
}

export const Form: FC<FormProps> = ({ seed, setSeed, lang, setLang, errors, setErrors, users }) => {
  const csvData = [
    [t["Name"][lang], t["Address"][lang], t["Phone"][lang], 'ID'],
    ...users.map(user => [user.name, user.address, user.phone, user.id])
  ]

  const setRandomSeed = () => {
    const randomSeed = String(Math.floor(Math.random() * 100000))
    setSeed(randomSeed)
  }

  const setErrorsHandler = (value: string) => {
    if (value === '.') value = '0.'
    if (isNaN(+value) || +value > 1000) return
    setErrors(`${value}`)
  }

  const setSeedHandler = (value: string) => {
    if (isNaN(+value) || value.includes('.') || value === ' ' || value.length > 14) return
    setSeed(value)
  }

  return (
    <div className="flex flex-col mt-7 max-w-[80%] mx-auto">

      <div className="w-[400px] flex flex-col">

        <Select
          value={lang}
          onChange={({ target }) => setLang(target.value as Lang)}
          startAdornment={<img className="mr-[35%]" src={GlobeIcon} width={30} alt="globe"/>}
        >
          <MenuItem value="rus">RUS</MenuItem>
          <MenuItem value="usa">USA</MenuItem>
          <MenuItem value="pl">PL</MenuItem>
        </Select>

        <div className="my-4">
          <Tooltip title="0 - 1000" placement="left">
            <TextField label={t["Number of errors"][lang]}
                       fullWidth
                       inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                       value={errors}
                       onChange={e => setErrorsHandler(e.target.value)}
            />
          </Tooltip>
          <Slider
            valueLabelDisplay="auto"
            step={0.25}
            min={0}
            max={10}
            value={+errors}
            onChange={(e, newValue) => setErrorsHandler(newValue + '')}
          />
        </div>

        <Tooltip title={t["integer (from 0 to 15 symbols)"][lang]} placement="left">
          <TextField label={t["Seed"][lang]} value={seed} onChange={e => setSeedHandler(e.target.value)}/>
        </Tooltip>

        <div className="mb-10 text-white font-bold mt-7">
          <button
            onClick={setRandomSeed}
            className="bg-sky-500 rounded px-4 py-1 hover:opacity-70 transition-opacity mr-5"
          >
            {t['Random seed'][lang]}
          </button>
          <CSVLink data={csvData}
                   filename="users.csv"
                   className="bg-green-500 rounded px-4 py-2 hover:opacity-70 transition-opacity">
            {t["Download CSV"][lang]}
          </CSVLink>
        </div>
      </div>
    </div>
  )
}
