import seedRandom, { PRNG } from 'seedrandom'
import { Lang, User } from "./types"
import data from "./data/data.json"
import Fakerator from 'fakerator'


const getRandomValue = (random: PRNG, array: string[]) => {
  const randomIndex = Math.floor(random() * array.length)
  return array[randomIndex]
}

const getRandomId = (random: PRNG) => {
  const min = 100000000000
  const max = 999999999999
  return `${Math.round(min - 0.5 + random() * (max - min + 1))}`
}

const getCityWithType = (random: PRNG, lang: Lang) => {
  const city = getRandomValue(random, data[lang].cities)
  if (lang === 'usa') return city
  const cityTypes = ['г.', 'Г.', "гор.", 'Город', 'город', 'село', 'деревня', '']
  let type = cityTypes[Math.floor(random() * cityTypes.length)]
  if (!type.includes('.')) {
    type += ' '
  }
  return type + city
}

const getRandomStreet = (cityWithType: string, random: PRNG, lang: Lang) => {
  const street = getRandomValue(random, data[lang].streets)
  if (lang === 'usa') return street
  if (cityWithType.includes('деревня') || cityWithType.includes('село')) {
    return Math.floor(random() * 3) === 0 ? '' : street
  }
  return street
}

const getRandomHouse = (random: PRNG, lang: Lang) => {
  const houseNumb = Math.floor(random() * 123 + 1)
  if (lang === 'usa') return houseNumb
  return `д.${houseNumb}`
}

const generatePhone = (random: PRNG, lang: Lang) => {
  const codes = data.rus.phoneCodes
  const countryCodes = {
    "rus": ['8', '7', '+7'],
    "usa": ['1', '+1', '+1', '+1']
  }
  const countryCode = getRandomValue(random, countryCodes[lang])
  const cityCode = getRandomValue(random, codes)
  let number = Math.floor(random() * 9999999).toString()
  number = "0".repeat(7 - number.length) + number
  return `${countryCode}-${cityCode}-${number}`
}

const getPrngUser = (seed: string, lang: Lang): User => {
  const random = seedRandom(seed)
  const [ names, states] = [data[lang].names, data[lang].states]
  generatePhone(random, lang)
  const city = getCityWithType(random, lang)
  const street = getRandomStreet(city, random, lang)
  const state = getRandomValue(random, states)
  const house = getRandomHouse(random, lang)
  const address = [state, city, street, house].filter(str => str).join(', ')
  return {
    id: getRandomId(random),
    name: getRandomValue(random, names),
    phone: generatePhone(random, lang),
    address
  }
}

export const getPage = (seed: string, lang: Lang, start: number, end: number): User[] => {
  const users = []
  if (!seed) {
    seed = '***@@@qaz'
  }
  console.log(seed, `${start}:${end}`)
  for (let i = start; i < end; i++) {
    users.push(getPrngUser(seed + i, lang))
  }
  return users
}
