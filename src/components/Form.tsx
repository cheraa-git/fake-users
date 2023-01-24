import { FC } from "react"
import { MenuItem, Select, TextField } from "@mui/material"
import { Lang } from "../types"


interface FormProps {
  seed: string
  setSeed: (seed: string) => void,
  lang: Lang
  setLang: (lang: Lang) => void
}

export const Form: FC<FormProps> = ({ seed, setSeed, lang, setLang }) => {
  const setRandomSeed = () => {
    const randomSeed = String(Math.floor(Math.random() * 100000))
    setSeed(randomSeed)
  }

  return (
    <div className="flex flex-col mt-7 max-w-[80%] mx-auto">
      <div className="w-[400px] flex flex-col">
        <Select
          value={lang}
          label="Age"
          onChange={({ target }) => setLang(target.value as Lang)}
        >
          <MenuItem value="rus">RUS</MenuItem>
          <MenuItem value="usa">USA</MenuItem>
          <MenuItem value="pl">PL</MenuItem>
        </Select>

        <div className="flex my-4">
          <TextField label="Number of errors"
                     fullWidth inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />
          <Select value={'1'}>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="4">4</MenuItem>
            <MenuItem value="5">5</MenuItem>
            <MenuItem value="6">6</MenuItem>
            <MenuItem value="7">7</MenuItem>
            <MenuItem value="8">8</MenuItem>
            <MenuItem value="9">9</MenuItem>
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="max">max</MenuItem>
          </Select>
        </div>

        <TextField label="seed"/>

        <div className="mb-10 text-white font-bold mt-7">
          <button
            onClick={setRandomSeed}
            className="bg-sky-500 rounded px-4 py-1 hover:opacity-70 transition-opacity mr-5"
          >
            Random seed
          </button>
          <button
            onClick={() => console.log('click')}
            className="bg-green-500 rounded px-4 py-1 hover:opacity-70 transition-opacity"
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  )
}
