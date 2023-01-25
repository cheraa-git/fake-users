import seedRandom, { PRNG } from 'seedrandom'
import { Lang, User, userKeysType } from "./types"
import data from "./data/data.json"
import Fakerator from 'fakerator'


const fakeratorCreator = (seed: number, lang: Lang) => {
  let region
  if (lang === 'rus') region = 'ru-RU'
  else if (lang === 'pl') region = 'pl-PL'
  else if (lang === 'usa') region = ''
  const fakeratorInstance = Fakerator(region)
  // @ts-ignore
  fakeratorInstance.seed(seed)
  return fakeratorInstance
}

const getRandomValue = (random: PRNG, array: string[]) => {
  const randomIndex = Math.floor(random() * array.length)
  return array[randomIndex]
}

const getId = (random: PRNG) => {
  const min = 100000000000
  const max = 999999999999
  return `${Math.round(min - 0.5 + random() * (max - min + 1))}`
}

const getCityWithType = (random: PRNG, city: string, lang: Lang) => {
  if (lang !== 'rus') return city
  const cityTypes = ['г.', 'Г.', "гор.", 'Город', 'город', 'село', 'деревня', '']
  let type = cityTypes[Math.floor(random() * cityTypes.length)]
  if (!type.includes('.')) {
    type += ' '
  }
  return type + city
}

const getStreet = (cityWithType: string, seed: string, lang: Lang) => {
  const random = seedRandom(seed)
  const street = getRandomValue(random, data[lang].streets)
  if (lang === 'usa') return street
  if (lang === 'pl') return fakeratorCreator(+seed, lang).address.streetName()
  if (cityWithType.includes('деревня') || cityWithType.includes('село')) {
    return Math.floor(random() * 3) === 0 ? '' : street
  }
  return street
}

const getHouse = (random: PRNG, lang: Lang) => {
  const houseNumb = Math.floor(random() * 234 + 1)
  if (lang !== 'rus') return houseNumb
  return `д.${houseNumb}`
}

const getPhone = (seed: string, lang: Lang) => {
  const fakerator = fakeratorCreator(+seed, lang)
  const phone = fakerator.phone.number()
  return lang === 'rus' ? '8' + phone : phone
}

const getName = (seed: string, lang: Lang) => {
  const { names } = fakeratorCreator(+seed, lang)
  const random = seedRandom(seed)
  const gender = !!Math.floor(random() * 2) ? 'm' : 'f'
  const genderName = {
    m: `${names.lastNameM()} ${names.firstNameM()}`,
    f: `${names.lastNameF()} ${names.firstNameF()}`
  }
  if (lang !== 'rus') return genderName[gender]
  const genderSurname = {
    m: getRandomValue(random, data.rus.surnameM),
    f: getRandomValue(random, data.rus.surnameF)
  }
  return `${genderName[gender]} ${genderSurname[gender]}`
}

const getPrngUser = (seed: string, lang: Lang): User => {
  const random = seedRandom(seed)
  const fakerator = fakeratorCreator(+seed, lang)
  const city = getCityWithType(random, fakerator.address.city(), lang)
  const street = getStreet(city, seed, lang)
  const state = getRandomValue(random, data[lang].states)
  const house = getHouse(random, lang)
  const address = [state, city, street, house].filter(str => str).join(', ')
  return {
    id: getId(random),
    name: getName(seed, lang),
    phone: getPhone(seed, lang),
    address
  }
}

const makeErrors = (errors: number, user: User, seed: string, lang: Lang) => {
  const letters = data[lang].letters.split('')
  const userKeys = Object.keys(user) as userKeysType[]
  for (let i = 0; i < errors; i++) {
    const random = seedRandom(seed + i)
    if (random() > errors) continue
    const randomLetter = letters[Math.floor(random() * letters.length)]
    const key = userKeys[Math.floor(random() * userKeys.length)]
    const value = user[key].split('')
    const letterIndex = Math.floor(random() * value.length)
    if (value[letterIndex] === ' ') {
      errors++
      continue
    }
    value[letterIndex] = randomLetter
    user[key] = value.join('')
  }
  return user
}


export const getPage = (customSeed: string, lang: Lang, start: number, end: number, errors: number): User[] => {
  const users = []
  if (!customSeed) {
    customSeed = '936283947'
  }
  for (let i = start; i < end; i++) {
    const seed = customSeed + i
    const user = makeErrors(errors, getPrngUser(seed, lang), seed, lang)
    users.push(user)
  }
  return users
}

