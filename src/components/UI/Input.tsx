import { FC, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  label?: string
}

export const Input: FC<InputProps> = ({ label, className, ...args }) => {
  const inputClasses = 'border border-blue-200 rounded outline-none w-[400px] mb-4 p-2 ' + className
  return (
    <label className="flex flex-col">
      {label}
      <input {...args} className={inputClasses + className} />
      {/* <input {...args} className="border border-blue-200 rounded outline-none mb-4 p-5" /> */}
    </label>
  )
}
