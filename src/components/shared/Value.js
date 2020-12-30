const Value = ({ children }) => {
  return (
    <div className="font-mono bg-gray-300 px-2 inline">
      {children}
    </div>
  )
}

const ValueItem = ({ children, value, bigValue = false, bold = false, icon }) => {
  return (
    <div className="mx-4 mb-6 text-sm">
      <div className={`${bold ? "text-white font-bold" : "text-gray-400 font-normal"} mb-2`}>
        {children}
      </div>
      <div className={`${bigValue ? "text-lg" : "text-sm"} ${bold ? "font-bold" : "font-normal"}`}>
        {icon
          ? <div className="flex justify-center items-center">
              <div className="mr-2">
                <img src={icon} alt="icon" />
              </div>
              <div>{value}</div>
            </div>
          : value
        }
      </div>
    </div>
  )
}

export { Value, ValueItem }
